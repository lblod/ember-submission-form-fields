import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { triplesForPath } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';

const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';

const applicationFormEntryPredicate = new rdflib.NamedNode(`${extBaseUri}applicationFormEntry`);
const actorNamePredicate = new rdflib.NamedNode(`http://mu.semte.ch/vocabularies/ext/actorName`);
const numberChildrenForFullDayPredicate = new rdflib.NamedNode(`http://mu.semte.ch/vocabularies/ext/numberChildrenForFullDay`);
const numberChildrenForHalfDayPredicate = new rdflib.NamedNode(`http://mu.semte.ch/vocabularies/ext/numberChildrenForHalfDay`);
const numberChildrenPerInfrastructurePredicate = new rdflib.NamedNode(`http://mu.semte.ch/vocabularies/ext/numberChildrenPerInfrastructure`);

class EntryProperties {
  @tracked value;
  @tracked oldValue;

  constructor(value, predicate) {
    this.value = value;
    this.oldValue = value;
    this.predicate = predicate;
  }
}

class ApplicationFormEntry {
  @tracked applicationFormEntrySubject
  @tracked errors

  get totalAmount() {
    return this.numberChildrenForFullDay.value*20 +
           this.numberChildrenForHalfDay.value*10 +
           this.numberChildrenPerInfrastructure.value*10;
  }

  constructor({
    applicationFormEntrySubject,
    actorName,
    numberChildrenForFullDay,
    numberChildrenForHalfDay,
    numberChildrenPerInfrastructure,
    errors
  }) {
    this.applicationFormEntrySubject = applicationFormEntrySubject;

    this.actorName = new EntryProperties(actorName, actorNamePredicate);
    this.numberChildrenForFullDay = new EntryProperties(numberChildrenForFullDay, numberChildrenForFullDayPredicate);
    this.numberChildrenForHalfDay = new EntryProperties(numberChildrenForHalfDay, numberChildrenForHalfDayPredicate);
    this.numberChildrenPerInfrastructure = new EntryProperties(numberChildrenPerInfrastructure, numberChildrenPerInfrastructurePredicate);

    this.errors = errors;
  }
}

export default class CustomSubsidyFormFieldsApplicationFormTableShowComponent extends InputFieldComponent  {
  @tracked applicationFormTableSubject = null
  @tracked entries = []

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
  }

  get aangevraagdBedrag() {
    let total = 0;
    this.entries.forEach(entry => {
      total += entry.totalAmount;
    });
    return total;
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const triples =  matches.triples;

    if (triples.length) {
      this.applicationFormTableSubject = triples[0].object; // assuming only one per form

      const entriesMatches = triplesForPath({
        store: this.storeOptions.store,
        path: applicationFormEntryPredicate,
        formGraph: this.storeOptions.formGraph,
        sourceNode: this.applicationFormTableSubject,
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

          this.entries.pushObject(new ApplicationFormEntry({
            applicationFormEntrySubject: entry.object,
            actorName: parsedEntry.actorName,
            numberChildrenForFullDay: parsedEntry.numberChildrenForFullDay,
            numberChildrenForHalfDay: parsedEntry.numberChildrenForHalfDay,
            numberChildrenPerInfrastructure: parsedEntry.numberChildrenPerInfrastructure,
            errors: []
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
    if (entryProperties.find(entry => entry.predicate.value == actorNamePredicate.value))
      entry.actorName = entryProperties.find(
        entry => entry.predicate.value == actorNamePredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == numberChildrenForFullDayPredicate.value))
      entry.numberChildrenForFullDay = entryProperties.find(
        entry => entry.predicate.value == numberChildrenForFullDayPredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == numberChildrenForHalfDayPredicate.value))
      entry.numberChildrenForHalfDay = entryProperties.find(
        entry => entry.predicate.value == numberChildrenForHalfDayPredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == numberChildrenPerInfrastructurePredicate.value))
      entry.numberChildrenPerInfrastructure = entryProperties.find(
        entry => entry.predicate.value == numberChildrenPerInfrastructurePredicate.value
      ).object.value;
    return entry;
  }
}
