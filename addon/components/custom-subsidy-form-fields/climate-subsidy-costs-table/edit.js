import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';

const LBLOD_SUBSIDIE = new rdflib.Namespace('http://lblod.data.gift/vocabularies/subsidie/');
const DBPEDIA = new rdflib.Namespace('http://dbpedia.org/ontology/');
const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const climateTableBaseUri = 'http://data.lblod.info/climate-tables';
const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';
const climateTableType = new rdflib.NamedNode(`${lblodSubsidieBaseUri}ClimateTable`);
const climateTablePredicate = new rdflib.NamedNode(`${lblodSubsidieBaseUri}climateTable`);
const hasInvalidRowPredicate = new rdflib.NamedNode(`${climateTableBaseUri}/hasInvalidClimateTableEntry`);
const validClimateTable = new rdflib.NamedNode(`${lblodSubsidieBaseUri}validClimateTable`);

/*
 * Component wrapping the big subsidy table for climate action.
 * Some notes
 *  ---------
 * - The business rule URI are in the database. So if the rules change, you will have to maintain these too.
 *   In that case, you will have to create a new instance of a business rule.
 *   -  Please note, they mainly are stored as documentation, so we know what numbers mean when making reports.
 *   - Your main question is, why don't use this information to render data in the components?
 *     Well, NOW, this could be considered, but when we started, the rules were more complicated and given
 *     the huge time constraints, the unknow randomness of the upcoming changes in rules,
 *     we didn't want to lock ourselves to engineering a solution that wouldn't work for an custom rule.
 *     So yes, this implies double bookkeeping. And hopefuly we can refactor this a bit.
 *    - The same argumentation is valid for the custom rows here. Yes, these could be abstracted NOW, but that wasn't the case a the start.
 */
export default class CustomSubsidyFormFieldsClimateSubsidyCostsTableEditComponent extends InputFieldComponent {
  @tracked climateTableSubject = null;
  @tracked entries = [];
  @tracked populationCount = "100343";
  @tracked restitutionToDestribute = 10000;
  @tracked errors = [];

  get hasClimateTable() {
    if (!this.climateTableSubject)
      return false;
    else
      return this.storeOptions.store.match(this.sourceNode,
        climateTablePredicate,
        this.climateTableSubject,
        this.storeOptions.sourceGraph).length > 0;
  }

  constructor() {
    super(...arguments);
    this.loadProvidedValue();

    // Create table and entries in the store if not already existing
    next(this, () => {
      this.initializeTable();
    });
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const triples = matches.triples;

    if (triples.length) {
      this.climateTableSubject = triples[0].object; // assuming only one per form
    }

    const metaGraph = this.args.graphs.metaGraph;
    this.population = this.args.formStore.match(undefined, DBPEDIA('populationTotal'), undefined, metaGraph)[0].object.value;
    this.drawingRight = this.args.formStore.match(undefined, LBLOD_SUBSIDIE('drawingRight'), undefined, metaGraph)[0].object.value;
  }

  initializeTable() {
    if (!this.hasClimateTable) {
      this.createClimateTable();
      super.updateValidations(); // Updates validation of the table
    }
  }

  createClimateTable() {
    const uuid = uuidv4();
    this.climateTableSubject = new rdflib.NamedNode(`${climateTableBaseUri}/${uuid}`);
    const triples = [{
      subject: this.climateTableSubject,
      predicate: RDF('type'),
      object: climateTableType,
      graph: this.storeOptions.sourceGraph
    },
    {
      subject: this.climateTableSubject,
      predicate: MU('uuid'),
      object: uuid,
      graph: this.storeOptions.sourceGraph
    },
    {
      subject: this.storeOptions.sourceNode,
      predicate: climateTablePredicate,
      object: this.climateTableSubject,
      graph: this.storeOptions.sourceGraph
    }
    ];
    this.storeOptions.store.addAll(triples);
  }

  //TODO: move to some common code
  updateTripleObject(subject, predicate, newObject = null) {
    const triples = this.storeOptions.store.match(
      subject,
      predicate,
      undefined,
      this.storeOptions.sourceGraph
    );

    this.storeOptions.store.removeStatements([...triples]);

    if (newObject) {
      this.storeOptions.store.addAll([
        {
          subject: subject,
          predicate: predicate,
          object: newObject,
          graph: this.storeOptions.sourceGraph
        }
      ]);
    }
  }

  @action
  updateTotaleRestitution(value){
    this.restitutionToDestribute = this.restitutionToDestribute - value;
  }

  @action
  validate(){
    this.errors = [];
    const invalidRow = this.storeOptions.store.any(this.climateTableSubject, hasInvalidRowPredicate, null, this.storeOptions.sourceGraph);
    if(invalidRow){
      this.errors.pushObject({
        message: 'Een van de rijen is niet correct ingevuld'
      });
      this.updateTripleObject(this.climateTableSubject, validClimateTable, null);
    }
    else if (!this.isPositiveInteger(this.restitutionToDestribute)) {
      this.errors.pushObject({
        message: 'Terugtrekkingsrecht te verdelen moet groter of gelijk aan 0 zijn'
      });
      this.updateTripleObject(this.climateTableSubject, validClimateTable, null);
    }
    else {
      this.updateTripleObject(this.climateTableSubject, validClimateTable, true);
    }
  }

  isPositiveInteger(value) {
    return parseInt(value) >= 0;
  }
}
