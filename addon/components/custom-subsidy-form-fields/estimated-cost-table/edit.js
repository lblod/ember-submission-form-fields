import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const estimatedCostTableBaseUri = 'http://lblod.data.gift/id/subsidie/bicycle-infrastructure/table';
const bicycleInfrastructureUri = 'http://lblod.data.gift/vocabularies/subsidie/bicycle-infrastructure#';
const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';
const subsidyRulesUri = 'http://data.lblod.info/id/subsidies/rules/';

const EstimatedCostTableType = new rdflib.NamedNode(`${bicycleInfrastructureUri}EstimatedCostTable`);
const EstimatedCostEntryType = new rdflib.NamedNode(`${bicycleInfrastructureUri}EstimatedCostEntry`);
const estimatedCostTablePredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}estimatedCostTable`);
const estimatedCostEntryPredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}estimatedCostEntry`);

const descriptionPredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}costEstimationType`);
const costPredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}cost`);
const sharePredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}share`);
const indexPredicate = new rdflib.NamedNode(`${extBaseUri}index`);
const validEstimatedCostTable = new rdflib.NamedNode(`${bicycleInfrastructureUri}validEstimatedCostTable`);
const optionsPredicate = new rdflib.NamedNode('http://lblod.data.gift/vocabularies/forms/options')

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

const defaultRows = [
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

const aanvraagRows = [
  {
    uuid: "b22a9324-874a-42d1-b815-f20f96b31a53",
    description: "Kostprijs excl. BTW (enkel subsidieerbare kosten) en excl. onteigeningsvergoedingen",
    cost: 0,
    share: 100,
    index: 0
  },
  {
    uuid: "92a25430-ab31-46dc-a0d8-3f4cf1dc1b04",
    description: "Onteigeningsvergoedingen",
    cost: 0,
    share: 100,
    index: 1
  }
];

export default class CustomSubsidyFormFieldsEstimatedCostTableEditComponent extends InputFieldComponent {
  @tracked estimatedCostTableSubject = null;
  @tracked entries = [];
  @tracked errors = [];

  constructor() {
    super(...arguments);
    this.loadProvidedValue();

    // Create table and entries in the store if not already existing
    next(this, () => {
      this.initializeTable();
      this.validate();
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

  get isAanvraagStep() {
    if(this.args.field && this.args.field.options) {
      const option = JSON.parse(this.args.field.options);
      return option.isAanvraagStep;
    } else {
      return false;
    }
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

          this.entries.pushObject(new EstimatedCostEntry({
            estimatedCostEntrySubject: entry.object,
            description: parsedEntry.description,
            cost: parsedEntry.cost,
            share: parsedEntry.share,
            index: parsedEntry.index
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
    let rows = [];

    if(this.isAanvraagStep) {
      rows = aanvraagRows;
    } else {
      rows = defaultRows;
    }

    rows.forEach(target => {

      const uuid = uuidv4();
      const estimatedCostEntrySubject = new rdflib.NamedNode(`${subsidyRulesUri}/${uuid}`);

      estimatedCostEntriesDetails.push({
        subject: estimatedCostEntrySubject,
        description: target.description,
        cost: target.cost,
        share: target.share,
        index: target.index
      });

      triples.push({
        subject: estimatedCostEntrySubject,
        predicate: RDF('type'),
        object: EstimatedCostEntryType,
        graph: this.storeOptions.sourceGraph
      },
        {
          subject: estimatedCostEntrySubject,
          predicate: MU('uuid'),
          object: target.uuid,
          graph: this.storeOptions.sourceGraph
        },
        {
          subject: this.estimatedCostTableSubject,
          predicate: estimatedCostEntryPredicate,
          object: estimatedCostEntrySubject,
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

  validate(){
    this.errors = [];
    const entries = this.storeOptions.store.match(
      undefined,
      costPredicate,
      undefined,
      this.storeOptions.sourceGraph
    );

    const validCosts = entries.filter(entry => parseInt(entry.object.value) > 0 );
    if(!validCosts.length){
      this.errors.pushObject({
        message: 'Mintens één kosten veld moet een waarde groter dan 0 bevatten.'
      });
      this.updateTripleObject(this.estimatedCostTableSubject, validEstimatedCostTable, null);
    } else {
      this.updateTripleObject(this.estimatedCostTableSubject, validEstimatedCostTable, true);
    }
  }

  @action
    updateCost(entry){
      entry.cost.errors = [];

      if (!this.isPositiveInteger(Number(entry.cost.value))) {
        entry.cost.errors.pushObject({
          message: 'Kosten moet groter of gelijk aan 0 zijn'
        });
        this.updateTripleObject(this.estimatedCostTableSubject, validEstimatedCostTable, null);
      } else {
        this.updateTripleObject(this.estimatedCostTableSubject, validEstimatedCostTable, true);
      }

      this.updateTripleObject(entry.estimatedCostEntrySubject, entry['cost'].predicate, entry['cost'].value);
      this.validate();
    }

  @action
    updateShare(entry){
      entry.share.errors = [];

      if (this.isEmpty(entry.share.value)) {
        entry.share.errors.pushObject({
          message: 'Gemeentelijk aandeel in kosten is verplicht.'
        });
        this.updateTripleObject(this.estimatedCostTableSubject, validEstimatedCostTable, null);
      }
      else if (!this.isPositiveInteger(Number(entry.share.value))) {
        entry.share.errors.pushObject({
          message: 'Het gemeentelijke aandeel in kosten moet groter of gelijk aan 0 zijn'
        });
        this.updateTripleObject(this.estimatedCostTableSubject, validEstimatedCostTable, null);
      }
      else if (!this.isSmallerThan(Number(entry.share.value), 100)) {
        entry.share.errors.pushObject({
          message: 'Het gemeentelijke aandeel in kosten mag niet hoger liggen dan 100%'
        });
        this.updateTripleObject(this.estimatedCostTableSubject, validEstimatedCostTable, null);
      }
      else {
        this.updateTripleObject(this.estimatedCostTableSubject, validEstimatedCostTable, true);
      }

      this.updateTripleObject(entry.estimatedCostEntrySubject, entry['share'].predicate, entry['share'].value);
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
