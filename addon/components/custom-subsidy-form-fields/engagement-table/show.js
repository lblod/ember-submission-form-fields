import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';

const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';
const engagementEntryPredicate = new rdflib.NamedNode(`${extBaseUri}engagementEntry`);
const targetPredicate = new rdflib.NamedNode('http://mu.semte.ch/vocabularies/ext/target');
const existingStaffPredicate = new rdflib.NamedNode('http://mu.semte.ch/vocabularies/ext/existingStaff');
const additionalStaffPredicate = new rdflib.NamedNode('http://mu.semte.ch/vocabularies/ext/additionalStaff');
const volunteersPredicate = new rdflib.NamedNode('http://mu.semte.ch/vocabularies/ext/volunteers');
const estimatedCostPredicate = new rdflib.NamedNode('http://mu.semte.ch/vocabularies/ext/estimatedCost');
const indexPredicate = new rdflib.NamedNode('http://mu.semte.ch/vocabularies/ext/index');
const correctOption = new rdflib.NamedNode('http://lblod.data.gift/concepts/2e0b5013-8c7e-4d3d-9f2b-2460c0095e38'); // Sensibilisering, preventie, bronopsporing, quarantaine coaching en contactonderzoek

class EntryProperties {
  @tracked value;
  @tracked errors = [];

  constructor(value, predicate) {
    this.value = value;
    this.predicate = predicate;
    this.errors = [];
  }
}

class EngagementEntry {
  @tracked engagementEntrySubject;

  constructor({
    engagementEntrySubject,
    target,
    existingStaff,
    additionalStaff,
    volunteers,
    estimatedCost,
    index
  }) {
    this.engagementEntrySubject = engagementEntrySubject;

    this.target = new EntryProperties(target, targetPredicate);
    this.existingStaff = new EntryProperties(existingStaff, existingStaffPredicate);
    this.additionalStaff = new EntryProperties(additionalStaff, additionalStaffPredicate);
    this.volunteers = new EntryProperties(volunteers, volunteersPredicate);
    this.estimatedCost = new EntryProperties(estimatedCost, estimatedCostPredicate);
    this.index = new EntryProperties(index, indexPredicate);
  }
}

export default class CustomSubsidyFormFieldsEngagementTableShowComponent extends InputFieldComponent {
  @tracked engagementTableSubject = null
  @tracked entries = [];

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
    this.showContactopsporingRow = this.hasCorrectOption;
  }

  get sortedEntries() {
    return this.entries.sort((a,b) => (a.index.value > b.index.value));
  }

  get hasCorrectOption() {
    const correctOptionTriples = this.storeOptions.store.match(
      this.storeOptions.sourceNode,
      undefined,
      correctOption,
      this.storeOptions.sourceGraph
    );
    const triples = [
      ...correctOptionTriples
    ];

    if (triples.length > 0)
      return true;

    return false;
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const triples =  matches.triples;

    if (triples.length) {
      this.engagementTableSubject = triples[0].object; // assuming only one per form

      const entriesMatches = triplesForPath({
        store: this.storeOptions.store,
        path: engagementEntryPredicate,
        formGraph: this.storeOptions.formGraph,
        sourceNode: this.engagementTableSubject,
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

          this.entries.pushObject(new EngagementEntry({
            engagementEntrySubject: entry.object,
            target: parsedEntry.target,
            existingStaff: parsedEntry.existingStaff,
            additionalStaff: parsedEntry.additionalStaff,
            volunteers: parsedEntry.volunteers,
            estimatedCost: parsedEntry.estimatedCost,
            index: parsedEntry.index
          }));
        }
      }
    }
  }

  /**
  * Parse entry properties from triples to a simple object with the triple values
  */
  parseEntryProperties(entryProperties) {
    let entry = {};
    if (entryProperties.find(entry => entry.predicate.value == targetPredicate.value))
      entry.target = entryProperties.find(
        entry => entry.predicate.value == targetPredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == existingStaffPredicate.value))
      entry.existingStaff = entryProperties.find(
        entry => entry.predicate.value == existingStaffPredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == additionalStaffPredicate.value))
      entry.additionalStaff = entryProperties.find(
        entry => entry.predicate.value == additionalStaffPredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == volunteersPredicate.value))
      entry.volunteers = entryProperties.find(
        entry => entry.predicate.value == volunteersPredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == estimatedCostPredicate.value))
      entry.estimatedCost = entryProperties.find(
        entry => entry.predicate.value == estimatedCostPredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == indexPredicate.value))
      entry.index = entryProperties.find(
        entry => entry.predicate.value == indexPredicate.value
      ).object.value;
    return entry;
  }
}
