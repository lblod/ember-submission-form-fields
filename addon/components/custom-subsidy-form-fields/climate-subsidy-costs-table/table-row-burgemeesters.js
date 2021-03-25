import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import rdflib from 'browser-rdflib';
import { next } from '@ember/runloop';
import { v4 as uuidv4 } from 'uuid';
import { RDF, XSD } from '@lblod/submission-form-helpers';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';
const climateTableBaseUri = 'http://data.lblod.info/climate-tables';

const tableEntryBaseUri = 'http://data.lblod.info/id/climate-table/row-entry';
const ClimateEntryType = new rdflib.NamedNode(`${extBaseUri}ClimateEntry`);
const climateEntryPredicate = new rdflib.NamedNode(`${extBaseUri}climateEntry`);
const actionDescriptionPredicate = new rdflib.NamedNode(`${extBaseUri}actionDescription`);
const amountPerActionPredicate = new rdflib.NamedNode(`${extBaseUri}amountPerAction`);
const restitutionPredicate = new rdflib.NamedNode(`${extBaseUri}restitution`);
const hasInvalidRowPredicate = new rdflib.NamedNode(`${climateTableBaseUri}/hasInvalidClimateTableEntry`);

export default class CustomSubsidyFormFieldsClimateSubsidyCostsTableTableRowBurgemeestersComponent extends Component {
  @tracked tableEntryUri = null;
  @tracked amount = null;
  @tracked restitution = null;
  @tracked toRealiseUnits = this.amount > 0 ? "1 goedgekeurd SECAP2030" : "nvt";
  @tracked errors = [];
  @tracked isValidRow = true;

  get storeOptions() {
    return this.args.storeOptions;
  }

  get climateTableSubject() {
    return this.args.climateTableSubject;
  }

  get businessRuleUri() {
    return new rdflib.NamedNode(this.args.businessRuleUriStr);
  }

  get onUpdateRow(){
    return this.args.onUpdateRow;
  }

  constructor() {
    super(...arguments);
    if (this.hasValues()) {
      this.loadProvidedValue();
    }
    else {
      //next for technical reasons
      next(this, () => {
        this.initializeDefault();
      });
    }
  }

  hasValues() {
    const values = this.storeOptions.store.match(null, actionDescriptionPredicate, this.businessRuleUri, this.storeOptions.sourceGraph);
    return values.length;
  }

  loadProvidedValue() {
    const values = this.storeOptions.store.match(null, actionDescriptionPredicate, this.businessRuleUri, this.storeOptions.sourceGraph);
    if (values.length > 1) {
      throw `Expected single value for ${this.businessRuleUri}`;
    }
    else {
      this.setComponentValues(values[0].subject);
    }
  }

  initializeDefault() {
    const uuid = uuidv4();
    const tableEntryUri = new rdflib.NamedNode(`${tableEntryBaseUri}/${uuid}`);

    let triples = [
      {
        subject: tableEntryUri,
        predicate: RDF('type'),
        object: ClimateEntryType,
        graph: this.storeOptions.sourceGraph
      },
      {
        subject: tableEntryUri,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph
      },
      {
        subject: this.climateTableSubject,
        predicate: climateEntryPredicate,
        object: tableEntryUri,
        graph: this.storeOptions.sourceGraph
      },
      {
        subject: tableEntryUri,
        predicate: actionDescriptionPredicate,
        object: this.businessRuleUri,
        graph: this.storeOptions.sourceGraph
      }
    ];

    triples.push(
      {
        subject: tableEntryUri,
        predicate: amountPerActionPredicate,
        object: 0,
        graph: this.storeOptions.sourceGraph
      }
    );

    triples.push(
      {
        subject: tableEntryUri,
        predicate: restitutionPredicate,
        object: 0,
        graph: this.storeOptions.sourceGraph
      }
    );

    this.storeOptions.store.addAll(triples);
    this.setComponentValues(tableEntryUri);
  }

  setComponentValues(subject) {
    this.tableEntryUri = subject;
    this.amount = this.storeOptions.store.match(this.tableEntryUri, amountPerActionPredicate, null, this.storeOptions.sourceGraph)[0].object;
    this.restitution = this.storeOptions.store.match(this.tableEntryUri, restitutionPredicate, null, this.storeOptions.sourceGraph)[0].object;
  }

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

  isValid(amount){
    this.errors = [];

    if (!this.isPositiveInteger(amount)) {
      this.errors.pushObject({
        message: 'Ingezet bedrag per actie moet groter of gelijk aan 0 zijn'
      });
      this.updateTripleObject(this.climateTableSubject, hasInvalidRowPredicate, this.tableEntryUri);
      return false;
    }

    if (!this.isValidInteger(amount)) {
      this.errors.pushObject({
        message: 'Ingezet bedrag per actie moet een geheel getal zijn'
      });
      this.updateTripleObject(this.climateTableSubject, hasInvalidRowPredicate, this.tableEntryUri);
      return false;
    }

    if (!this.isSmallerThan(amount, 20000)) {
      this.errors.pushObject({
        message: 'Ingezet bedrag per actie mag niet hoger liggen dan € 20.000'
      });
      this.updateTripleObject(this.climateTableSubject, hasInvalidRowPredicate, this.tableEntryUri);
      return false;
    }

    this.updateTripleObject(this.climateTableSubject, hasInvalidRowPredicate, null);
    return true;
  }

  isPositiveInteger(value) {
    return parseInt(value) >= 0;
  }

  isValidInteger(value) {
    return parseFloat(value) % 1 === 0;
  }

  isSmallerThan(value, max) {
    return value <= max;
  }

  @action
  update(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    if(!this.isValid(this.amount)){
      return this.onUpdateRow();
    }

    const parsedAmount = Number(this.amount);
    const currentResititution = Number(this.restitution.value);

    this.toRealiseUnits = this.amount > 0 ? "1 goedgekeurd SECAP2030" : "nvt";
    this.updateTripleObject(this.tableEntryUri, amountPerActionPredicate, rdflib.literal(parsedAmount, XSD('integer')));
    this.updateTripleObject(this.tableEntryUri, restitutionPredicate, rdflib.literal(parsedAmount / 2, XSD('float')));
    this.setComponentValues(this.tableEntryUri);

    const newResititution = Number(this.restitution.value);
    // Updates the "Terugtrekkingsrecht te verdelen" value
    this.args.updateTotaleRestitution(newResititution - currentResititution);
    return this.onUpdateRow();
  }
}
