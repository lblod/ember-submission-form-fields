import Component from '@glimmer/component';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next } from '@ember/runloop';

import { RDF, XSD } from '@lblod/submission-form-helpers';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';

const tableEntryBaseUri = 'http://data.lblod.info/id/climate-table/row-entry';
const ClimateEntryType = new rdflib.NamedNode(`${extBaseUri}ClimateEntry`);
const climateEntryPredicate = new rdflib.NamedNode(`${extBaseUri}climateEntry`);
const actionDescriptionPredicate = new rdflib.NamedNode(`${extBaseUri}actionDescription`);
const amountPerActionPredicate = new rdflib.NamedNode(`${extBaseUri}amountPerAction`);
const costPerUnitPredicate = new rdflib.NamedNode(`${extBaseUri}costPerUnit`);
const restitutionPredicate = new rdflib.NamedNode(`${extBaseUri}restitution`);
const toRealiseUnitsPredicate = new rdflib.NamedNode(`${extBaseUri}toRealiseUnits`);

export default class CustomSubsidyFormFieldsClimateSubsidyCostsTableTableRowVastgoedplanComponent extends Component {
  @tracked tableEntryUri = null;
  @tracked amount = null;
  @tracked restitution = null;
  @tracked toRealiseUnits = null;
  @tracked costPerUnitDescription = null;
  @tracked errors = [];

  get storeOptions(){
    return this.args.storeOptions;
  }

  get businessRuleUri(){
    return new rdflib.NamedNode(this.args.businessRuleUriStr);
  }

  get climateTableSubject(){
    return this.args.climateTableSubject;
  }

  get getCostPerUnit() {
    const population = this.args.populationCount;
    if (population < 25000) {
      return 15000;
    } else if (population > 25000 && population < 100000) {
      return 40000;
    } else if (population > 100000){
      return 60000;
    } else {
      return "Gemeente < 25.000 inwoners: 15.000 € | Gemeente 25.000-100.000 inwoners: 40.000 € | Gemeente >100.000 inwoners: 60.000 €";
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

  setComponentValues(subject){
    this.tableEntryUri = subject;
    this.amount = this.storeOptions.store.match(this.tableEntryUri, amountPerActionPredicate, null, this.storeOptions.sourceGraph)[0].object;
    this.costPerUnitDescription = this.storeOptions.store.match(this.tableEntryUri, costPerUnitPredicate, null, this.storeOptions.sourceGraph)[0].object;
    this.restitution = this.storeOptions.store.match(this.tableEntryUri, restitutionPredicate, null, this.storeOptions.sourceGraph)[0].object;
    this.toRealiseUnits = this.storeOptions.store.match(this.tableEntryUri, toRealiseUnitsPredicate, null, this.storeOptions.sourceGraph)[0].object;
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
        predicate: costPerUnitPredicate,
        object: this.getCostPerUnit,
        graph: this.storeOptions.sourceGraph
      }
    );
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

    triples.push(
      {
        subject: tableEntryUri,
        predicate: toRealiseUnitsPredicate,
        object: "/",
        graph: this.storeOptions.sourceGraph
      }
    );

    this.storeOptions.store.addAll(triples);
    this.setComponentValues(tableEntryUri);
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

  @action
  update(e){
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    this.errors = [];

    if(this.amount > 0){
      this.toRealiseUnits = "1 strategisch vastgoedplan publiek patrimonium";
    } else {
      this.toRealiseUnits = "/";
    }

    const parsedAmount = Number(this.amount);

    this.updateTripleObject(this.tableEntryUri, amountPerActionPredicate, rdflib.literal(parsedAmount, XSD('integer')));
    this.updateTripleObject(this.tableEntryUri, restitutionPredicate, rdflib.literal(parsedAmount/2, XSD('float')));
    this.updateTripleObject(this.tableEntryUri, toRealiseUnitsPredicate, rdflib.literal(this.toRealiseUnits, XSD('string')));

    this.setComponentValues(this.tableEntryUri);
  }

  isPositiveInteger(value) {
    return parseInt(value) >= 0;
  }
}
