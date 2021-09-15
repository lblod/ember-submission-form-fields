import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';

const bicycleInfrastructureUri = 'http://lblod.data.gift/vocabularies/subsidie/bicycle-infrastructure#';
const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';

const estimatedCostTablePredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}estimatedCostTable`);
const estimatedCostEntryPredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}estimatedCostEntry`);

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


export default class CustomSubsidyFormFieldsEstimatedCostTableShowComponent extends InputFieldComponent {
  @tracked estimatedCostTableSubject = null;
  @tracked entries = [];
  @tracked errors = [];

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
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
}
