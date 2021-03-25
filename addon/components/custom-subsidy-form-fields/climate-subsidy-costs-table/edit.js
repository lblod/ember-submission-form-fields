import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const climateTableBaseUri = 'http://data.lblod.info/climate-tables';
const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';
const climateTableType = new rdflib.NamedNode(`${lblodSubsidieBaseUri}ClimateTable`);
const climateTablePredicate = new rdflib.NamedNode(`${lblodSubsidieBaseUri}climateTable`);
const hasInvalidRowPredicate = new rdflib.NamedNode(`${climateTableBaseUri}/hasInvalidClimateTableEntry`);

export default class CustomSubsidyFormFieldsClimateSubsidyCostsTableEditComponent extends InputFieldComponent {
  @tracked climateTableSubject = null;
  @tracked entries = [];
  @tracked populationCount = "100343";
  @tracked restitutionToDestribute = 10000;
  @tracked totalRestitution = 10000;
  @tracked errors = [];
  @tracked validRows = 21;

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

  @action
  updateTotaleRestitution(value){
    this.restitutionToDestribute = this.restitutionToDestribute - value;
    this.errors = [];

    if (!this.isPositiveInteger(this.restitutionToDestribute)) {
      this.errors.pushObject({
        message: 'Terugtrekkingsrecht te verdelen moet groter of gelijk aan 0 zijn'
      });
    }
  }

  @action
  updateValidRows(validState){
    if(validState == true) return this.validRows++;
    if(validState == false) return this.validRows--;
  }

  @action
  validate(){
    const invalidRow = this.storeOptions.store.any(this.climateTableSubject, hasInvalidRowPredicate, null, this.storeOptions.sourceGraph);
    //TODO: further validation
  }

  isPositiveInteger(value) {
    return parseInt(value) >= 0;
  }
}
