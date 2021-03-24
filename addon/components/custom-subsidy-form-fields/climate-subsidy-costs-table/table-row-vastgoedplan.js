import Component from '@glimmer/component';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next } from '@ember/runloop';

import { RDF, XSD } from '@lblod/submission-form-helpers';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';
// const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';

const tableEntryBaseUri = 'http://data.lblod.info/id/climate-table/row-entry';
const ClimateEntryType = new rdflib.NamedNode(`${extBaseUri}ClimateEntry`);
const climateEntryPredicate = new rdflib.NamedNode(`${extBaseUri}climateEntry`);
const actionDescriptionPredicate = new rdflib.NamedNode(`${extBaseUri}actionDescription`);
const amountPerActionPredicate = new rdflib.NamedNode(`${extBaseUri}amountPerAction`);
const costPerUnitPredicate = new rdflib.NamedNode(`${extBaseUri}costPerUnit`);
const restitutionPredicate = new rdflib.NamedNode(`${extBaseUri}restitution`);
// const populationCountPredicate = new rdflib.NamedNode(`${lblodSubsidieBaseUri}populationCount`);

export default class CustomSubsidyFormFieldsClimateSubsidyCostsTableTableRowVastgoedplanComponent extends Component {
  @tracked tableEntryUri = null;
  @tracked amount = null;
  @tracked restitution = null;
  @tracked toRealiseUnits = this.amount > 0 ? "1 strategisch vastgoedplan publiek patrimonium" : "nvt";
  @tracked costPerUnitDescription = null;
  @tracked errors = [];
  // TODO retrieve nr from DB and use that

  get storeOptions() {
    return this.args.storeOptions;
  }

  get populationCount() {
    return this.args.populationCount;
  }

  get businessRuleUri() {
    return new rdflib.NamedNode(this.args.businessRuleUriStr);
  }

  get climateTableSubject() {
    return this.args.climateTableSubject;
  }

  get getCostPerUnit() {
    if (this.populationCount < 25000) {
      return 15000;
    } else if (this.populationCount > 25000 && this.populationCount < 100000) {
      return 40000;
    } else if (this.populationCount > 100000) {
      return 60000;
    } else {
      return "Gemeente < 25.000 inwoners: 15.000 € | Gemeente 25.000-100.000 inwoners: 40.000 € | Gemeente >100.000 inwoners: 60.000 €";
    }
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

  setComponentValues(subject) {
    this.tableEntryUri = subject;
    this.amount = this.storeOptions.store.match(this.tableEntryUri, amountPerActionPredicate, null, this.storeOptions.sourceGraph)[0].object;
    this.costPerUnitDescription = this.storeOptions.store.match(this.tableEntryUri, costPerUnitPredicate, null, this.storeOptions.sourceGraph)[0].object;
    this.restitution = this.storeOptions.store.match(this.tableEntryUri, restitutionPredicate, null, this.storeOptions.sourceGraph)[0].object;
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
  update(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    this.errors = [];

    if (!this.isPositiveInteger(this.amount)) {
      this.errors.pushObject({
        message: 'Ingezet bedrag per actie moet groter of gelijk aan 0 zijn'
      });
      return;
    }

    if (!this.isValidInteger(this.amount)) {
      this.errors.pushObject({
        message: 'Ingezet bedrag per actie moet een geheel getal zijn'
      });
      return;
    }

    const parsedAmount = Number(this.amount);
    const currentResititution = Number(this.restitution.value);

    this.toRealiseUnits = this.amount > 0 ? "1 strategisch vastgoedplan publiek patrimonium" : "nvt";
    this.updateTripleObject(this.tableEntryUri, amountPerActionPredicate, rdflib.literal(parsedAmount, XSD('integer')));
    this.updateTripleObject(this.tableEntryUri, restitutionPredicate, rdflib.literal(parsedAmount / 2, XSD('float')));

    this.setComponentValues(this.tableEntryUri);

    const newResititution = Number(this.restitution.value);
    // Updates the "Terugtrekkingsrecht te verdelen" value
    this.args.updateTotaleRestitution(newResititution - currentResititution);
  }

  isPositiveInteger(value) {
    return parseInt(value) >= 0;
  }

  isValidInteger(value) {
    return parseFloat(value) % 1 === 0;
  }
}
