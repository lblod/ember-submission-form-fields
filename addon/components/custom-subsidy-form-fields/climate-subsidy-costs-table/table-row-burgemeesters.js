import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import rdflib from 'browser-rdflib';
import { next } from '@ember/runloop';
import { v4 as uuidv4 } from 'uuid';
import { RDF, XSD } from '@lblod/submission-form-helpers';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';

const tableEntryBaseUri = 'http://data.lblod.info/id/climate-table/row-entry';
const ClimateEntryType = new rdflib.NamedNode(`${extBaseUri}ClimateEntry`);
const climateEntryPredicate = new rdflib.NamedNode(`${extBaseUri}climateEntry`);
const actionDescriptionPredicate = new rdflib.NamedNode(`${extBaseUri}actionDescription`);
const amountPerActionPredicate = new rdflib.NamedNode(`${extBaseUri}amountPerAction`);
const restitutionPredicate = new rdflib.NamedNode(`${extBaseUri}restitution`);
const toRealiseUnitsPredicate = new rdflib.NamedNode(`${extBaseUri}toRealiseUnits`);

export default class CustomSubsidyFormFieldsClimateSubsidyCostsTableTableRowBurgemeestersComponent extends Component {
  @tracked tableEntryUri = null;
  @tracked amount = null;
  @tracked restitution = null;
  @tracked toRealiseUnits = null;
  @tracked errors = [];

  get storeOptions(){
    return this.args.storeOptions;
  }

  get climateTableSubject(){
    return this.args.climateTableSubject;
  }

  get businessRuleUri(){
    return new rdflib.NamedNode(this.args.businessRuleUriStr);
  }

  get getAmount() {
    const calculated = Math.round(0.15 * this.args.populationCount);
    if (calculated > 20000) {
      return 20000;
    } else {
      return calculated;
    }
  }

  get getRestitution() {
    return this.getAmount * .5;
  }

  get getToRealiseUnits() {
    if (this.getAmount > 0) {
      return "1 goedgekeurd SECAP2030";
    } else {
      return "/";
    }
  }

  constructor() {
    super(...arguments);
    if(this.hasValues()){
      this.loadProvidedValue();

    }
    else {
      //next for technical reasons
      next(this, () => {
        this.initializeDefault();
      });
    }
  }

  hasValues(){
    const values = this.storeOptions.store.match(null, actionDescriptionPredicate, this.businessRuleUri, this.storeOptions.sourceGraph);
    return values.length;
  }

  loadProvidedValue(){
    const values = this.storeOptions.store.match(null, actionDescriptionPredicate, this.businessRuleUri, this.storeOptions.sourceGraph);
    if(values.length > 1 ){
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
        object: this.getBusinessRuleUri,
        graph: this.storeOptions.sourceGraph
      }
    ];

    triples.push(
      {
        subject: tableEntryUri,
        predicate: amountPerActionPredicate,
        object: this.getAmount,
        graph: this.storeOptions.sourceGraph
      }
    );

    triples.push(
      {
        subject: tableEntryUri,
        predicate: restitutionPredicate,
        object: this.getRestitution,
        graph: this.storeOptions.sourceGraph
      }
    );

    triples.push(
      {
        subject: tableEntryUri,
        predicate: toRealiseUnitsPredicate,
        object: this.getToRealiseUnits,
        graph: this.storeOptions.sourceGraph
      }
    );

    this.storeOptions.store.addAll(triples);
    this.setComponentValues(tableEntryUri);
  }

  setComponentValues(subject){
    this.tableEntryUri = subject;
    this.amount = this.storeOptions.store.match(this.tableEntryUri, amountPerActionPredicate, null, this.storeOptions.sourceGraph)[0].object;
    this.restitution = this.storeOptions.store.match(this.tableEntryUri, restitutionPredicate, null, this.storeOptions.sourceGraph)[0].object;
    this.toRealiseUnits = this.storeOptions.store.match(this.tableEntryUri, toRealiseUnitsPredicate, null, this.storeOptions.sourceGraph)[0].object;
  }

}
