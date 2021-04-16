import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const estimatedCostTableBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/bicycle-infrastructure#EstimatedCostTable';
const bicycleInfrastructureUri = 'http://lblod.data.gift/vocabularies/subsidie/bicycle-infrastructure#';
const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';
const subsidyRulesUri = 'http://data.lblod.info/id/subsidies/rules/';
const csvw = 'http://www.w3.org/ns/csvw#';

const EstimatedCostTableType = new rdflib.NamedNode(`${csvw}Table`);
const EstimatedCostEntryType = new rdflib.NamedNode(`${csvw}Row`);
const estimatedCostTablePredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}EstimatedCostTable`);
const estimatedCostEntryPredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}EstimatedCostEntry`);

const descriptionPredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}costEstimationType`);
const costPredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}cost`);
const sharePredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}share`);
const indexPredicate = new rdflib.NamedNode(`${extBaseUri}index`);

class EntryProperties {
  @tracked value;
  @tracked errors = [];

  constructor(value, predicate) {
    this.value = value;
    this.predicate = predicate;
    this.errors = [];
  }
}

class EstimatedCostEntry {
  @tracked estimatedCostEntrySubject;

  constructor({
    estimatedCostEntrySubject,
    description,
    cost,
    share,
    index
  }) {
    this.estimatedCostEntrySubject = estimatedCostEntrySubject;
    this.description = new EntryProperties(description, descriptionPredicate);
    this.cost = new EntryProperties(cost, costPredicate);
    this.share = new EntryProperties(share, sharePredicate);
    this.index = new EntryProperties(index, indexPredicate);
  }
}

const tableRows = [
  {
    uuid: "bda9c645-9520-44ff-bac4-8b77647a93e0",
    description: "Totale raming van de kostprijs excl. BTW (enkel subsidieerbare kosten) en excl. onteigeningsvergoedingen",
    cost: 0,
    share: 100,
    index: 0
  },
  {
    uuid: "38f24b3d-e4dd-408e-a530-c8d3a8fca0ff",
    description: "Totale raming van de onteigeningsvergoedingen",
    cost: 0,
    share: 100,
    index: 1
  }
];

export default class CustomSubsidyFormFieldsEstimatedCostTableEditComponent extends InputFieldComponent {
  @tracked estimatedCostTableSubject = null;
  @tracked entries = [];
  @tracked costHasValue = null;

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
    this.checkCostValues();

    // Create table and entries in the store if not already existing
    next(this, () => {
      this.initializeTable();
    });
  }

  get hasEstimatedCostTable() {
    if (!this.estimatedCostTableSubject)
      return false;
    else
      return this.storeOptions.store.match(this.sourceNode,
                                          estimatedCostTablePredicate,
                                          this.estimatedCostTableSubject,
                                          this.storeOptions.sourceGraph).length > 0;
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const triples =  matches.triples;

    if (triples.length) {
      this.estimatedCostTableSubject = triples[0].object; // assuming only one per form

      const entriesMatches = triplesForPath({
        store: this.storeOptions.store,
        path: estimatedCostEntryPredicate,
        formGraph: this.storeOptions.formGraph,
        sourceNode: this.estimatedCostTableSubject,
        sourceGraph: this.storeOptions.sourceGraph
      });
      const entriesTriples = entriesMatches.triples;
      if (entriesTriples.length > 0) {
        for (let entry of entriesTriples) {
          const entryProperties = this.storeOptions.store.match(entry.object,
                                        undefined,
                                        undefined,
                                        this.storeOptions.sourceGraph);

          const parsedEntry = this.parseEntryProperties(entryProperties);

          // Check if one of the cost fields has a positive value && !=0

          this.entries.pushObject(new EstimatedCostEntry({
            estimatedCostEntrySubject: entry.object,
            description: parsedEntry.description,
            cost: parsedEntry.cost,
            share: parsedEntry.share,
            index: parsedEntry.index,
          }));

          this.entries.sort((a, b) => a.index.value - b.index.value);
        }
      }
    }
  }


  parseEntryProperties(entryProperties) {
    let entry = {};
    if (entryProperties.find(entry => entry.predicate.value == descriptionPredicate.value))
    entry.description = entryProperties.find(
      entry => entry.predicate.value == descriptionPredicate.value
    ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == costPredicate.value))
      entry.cost = entryProperties.find(
        entry => entry.predicate.value == costPredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == sharePredicate.value))
      entry.share = entryProperties.find(
        entry => entry.predicate.value == sharePredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == indexPredicate.value))
    entry.index = entryProperties.find(
      entry => entry.predicate.value == indexPredicate.value
    ).object.value;
    return entry;
  }

  initializeTable() {
    if (!this.hasEstimatedCostTable) {
      this.createEstimatedCostTable();
      this.entries = this.createEntries();
      this.hasCostValue = false;
      super.updateValidations(); // Updates validation of the table
    }
  }

  createEstimatedCostTable() {
    const uuid = uuidv4();
    this.estimatedCostTableSubject = new rdflib.NamedNode(`${estimatedCostTableBaseUri}/${uuid}`);
    const triples = [
      {
        subject: this.estimatedCostTableSubject,
        predicate: RDF('type'),
        object: EstimatedCostTableType,
        graph: this.storeOptions.sourceGraph
      },
      {
        subject: this.estimatedCostTableSubject,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph
      },
      {
        subject: this.storeOptions.sourceNode,
        predicate: estimatedCostTablePredicate,
        object: this.estimatedCostTableSubject,
        graph: this.storeOptions.sourceGraph
      }
    ];
    this.storeOptions.store.addAll(triples);
  }

  createEntries() {
    let entries = [];
    const estimatedCostEntriesDetails = this.createEstimatedCostEntries();
    estimatedCostEntriesDetails.forEach(detail => {
      const newEntry = new EstimatedCostEntry({
        estimatedCostEntrySubject: detail.subject,
        description: detail.description,
        cost: detail.cost,
        share: detail.share,
        index: detail.index
      });
      entries.pushObject(newEntry);
    });

    this.initializeEntriesFields(entries);
    return entries;
  }

  createEstimatedCostEntries() {
    let triples = [];
    let estimatedCostEntriesDetails = [];
    tableRows.forEach(target => {

      const estimatedCostEntrySubject = () => {
        return new rdflib.NamedNode(`${subsidyRulesUri}/${target.uuid}`);
      };

      estimatedCostEntriesDetails.push({
        subject: estimatedCostEntrySubject(),
        description: target.description,
        cost: target.cost,
        share: target.share,
        index: target.index
      });

      triples.push({
        subject: estimatedCostEntrySubject(),
        predicate: RDF('type'),
        object: EstimatedCostEntryType,
        graph: this.storeOptions.sourceGraph
      },
        {
          subject: estimatedCostEntrySubject(),
          predicate: MU('uuid'),
          object: target.uuid,
          graph: this.storeOptions.sourceGraph
        },
        {
          subject: this.estimatedCostTableSubject,
          predicate: estimatedCostEntryPredicate,
          object: estimatedCostEntrySubject(),
          graph: this.storeOptions.sourceGraph
        }
      );
    });
    this.storeOptions.store.addAll(triples);
    return estimatedCostEntriesDetails;
  }


  initializeEntriesFields(entries) {
    let triples = [];
    entries.forEach(entry => {
      triples.push(
        {
          subject: entry.estimatedCostEntrySubject,
          predicate: entry['description'].predicate,
          object: entry['description'].value,
          graph: this.storeOptions.sourceGraph
        },
        {
          subject: entry.estimatedCostEntrySubject,
          predicate: entry['cost'].predicate,
          object: entry['cost'].value,
          graph: this.storeOptions.sourceGraph
        },
        {
          subject: entry.estimatedCostEntrySubject,
          predicate: entry['share'].predicate,
          object: entry['share'].value,
          graph: this.storeOptions.sourceGraph
        },
        {
          subject: entry.estimatedCostEntrySubject,
          predicate: entry['index'].predicate,
          object: entry['index'].value,
          graph: this.storeOptions.sourceGraph
        },
      );
    });
    this.storeOptions.store.addAll(triples);
  }

  updateFieldValueTriple(entry, field) {
    const fieldValueTriples = this.storeOptions.store.match(
      entry.estimatedCostEntrySubject,
      entry[field].predicate,
      undefined,
      this.storeOptions.sourceGraph
    );
    const triples = [
      ...fieldValueTriples
    ];
    this.storeOptions.store.removeStatements(triples);

    if (entry[field].value.toString().length > 0) {
      this.storeOptions.store.addAll([
        {
          subject: entry.estimatedCostEntrySubject,
          predicate: entry[field].predicate,
          object: entry[field].value,
          graph: this.storeOptions.sourceGraph
        }
      ]);
    }
  }

  checkCostValues(){
    const entries = this.storeOptions.store.match(
      undefined,
      costPredicate,
      undefined,
      this.storeOptions.sourceGraph
    );

    const validCosts = entries.filter(entry => parseInt(entry.object.value) > 0 );

    if(validCosts.length > 0) this.costHasValue = true;
    if(validCosts.length <= 0) this.costHasValue = false;
  }

  @action
    updateCost(entry){
      entry.cost.errors = [];

      if (this.isEmpty(entry.cost.value)) {
        entry.cost.errors.pushObject({
          message: 'Gemeentelijk aandeel in kosten is verplicht.'
        });
      }

      if (!this.isPositiveInteger(Number(entry.cost.value))) {
        entry.cost.errors.pushObject({
          message: 'Kosten moeten groter of gelijk aan 0 zijn'
        });
      }

      this.updateFieldValueTriple(entry, 'cost');

      this.checkCostValues();

      this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
      super.updateValidations(); // Updates validation of the table
    }

  @action
    updateShare(entry){
      entry.share.errors = [];


      if (this.isEmpty(entry.share.value)) {
        entry.share.errors.pushObject({
          message: 'Gemeentelijk aandeel in kosten is verplicht.'
        });
      }

      if (!this.isPositiveInteger(Number(entry.share.value))) {
        entry.share.errors.pushObject({
          message: 'Het gemeentelijke aandeel in kosten moet groter of gelijk aan 0 zijn'
        });
      }

      if (!this.isSmallerThan(Number(entry.share.value), 100)) {
        entry.share.errors.pushObject({
          message: 'Het gemeentelijke aandeel in kosten mag niet hoger liggen dan 100%'
        });
      }

      this.updateFieldValueTriple(entry, 'share');

      this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
      super.updateValidations(); // Updates validation of the table
  }



  isPositiveInteger(value) {
    return parseInt(value) >= 0;
  }

  isEmpty(value) {
    return value.toString().length == 0;
  }

  isValidInteger(value) {
    return parseFloat(value) % 1 === 0;
  }

  isSmallerThan(value, max) {
    return value <= max;
  }

}
