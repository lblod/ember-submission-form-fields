import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';

const applicationFormTableBaseUri = 'http://data.lblod.info/application-form-tables';
const applicationFormEntryBaseUri = 'http://data.lblod.info/application-form-entries';
const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';
const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';

const ApplicationFormTableType = new rdflib.NamedNode(`${lblodSubsidieBaseUri}ApplicationFormTable`);
const ApplicationFormEntryType = new rdflib.NamedNode(`${extBaseUri}ApplicationFormEntry`);
const applicationFormTablePredicate = new rdflib.NamedNode(`${lblodSubsidieBaseUri}applicationFormTable`);
const applicationFormEntryPredicate = new rdflib.NamedNode(`${extBaseUri}applicationFormEntry`);
const actorNamePredicate = new rdflib.NamedNode(`http://mu.semte.ch/vocabularies/ext/actorName`);
const numberChildrenForFullDayPredicate = new rdflib.NamedNode(`http://mu.semte.ch/vocabularies/ext/numberChildrenForFullDay`);
const numberChildrenForHalfDayPredicate = new rdflib.NamedNode(`http://mu.semte.ch/vocabularies/ext/numberChildrenForHalfDay`);
const numberChildrenPerInfrastructurePredicate = new rdflib.NamedNode(`http://mu.semte.ch/vocabularies/ext/numberChildrenPerInfrastructure`);
const totalAmountPredicate = new rdflib.NamedNode(`http://mu.semte.ch/vocabularies/ext/totalAmount`);

// TODO
// Update the triples related to the total amount when a number gets updated

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
  @tracked inputFieldNames
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

    this.inputFieldNames = [
      "actorName",
      "numberChildrenForFullDay",
      "numberChildrenForHalfDay",
      "numberChildrenPerInfrastructure"
    ];

    this.errors = errors;
  }
}

export default class CustomSubsidyFormFieldsApplicationFormTableEditComponent extends InputFieldComponent {
  @tracked applicationFormTableSubject = null
  @tracked entries = []

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
  }

  get hasApplicationFormTable() {
    if (!this.applicationFormTableSubject)
      return false;
    else
      return this.storeOptions.store.match(this.sourceNode,
                                           applicationFormTablePredicate,
                                           this.applicationFormTableSubject,
                                           this.storeOptions.sourceGraph).length > 0;
  }

  get hasEntries() {
    return this.storeOptions.store.match(this.applicationFormTableSubject,
                                         applicationFormEntryPredicate,
                                         undefined,
                                         this.storeOptions.sourceGraph).length > 0;
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
        let i = 0;
        const entriesValues = entriesMatches.values;
        for (let entry of entriesValues) {
          this.entries.pushObject(new ApplicationFormEntry({
            applicationFormEntrySubject: entriesTriples[i].object,
            actorName: entry.actorName ? entry.actorName.value : "",
            numberChildrenForFullDay: entry.numberChildrenForFullDay ? entry.numberChildrenForFullDay.value : 0,
            numberChildrenForHalfDay: entry.numberChildrenForHalfDay ? entry.numberChildrenForHalfDay.value : 0,
            numberChildrenPerInfrastructure: entry.numberChildrenPerInfrastructure ? entry.numberChildrenPerInfrastructure.value : 0,
            errors: []
          }));
          i++;
        }
      }
    }
  }

  createApplicationFormTable() {
    this.applicationFormTableSubject = new rdflib.NamedNode(`${ applicationFormTableBaseUri}/${uuidv4()}`);
    const triples = [ { subject: this.applicationFormTableSubject,
                        predicate: RDF('type'),
                        object: ApplicationFormTableType,
                        graph: this.storeOptions.sourceGraph
                      },
                      { subject: this.storeOptions.sourceNode,
                        predicate: applicationFormTablePredicate,
                        object: this.applicationFormTableSubject,
                        graph: this.storeOptions.sourceGraph }
                    ];
    this.storeOptions.store.addAll(triples);
  }

  createApplicationFormEntry() {
    const uuid = uuidv4();
    const applicationFormEntrySubject = new rdflib.NamedNode(`${applicationFormEntryBaseUri}/${uuid}`);
    const triples = [ { subject: applicationFormEntrySubject,
                        predicate: RDF('type'),
                        object: ApplicationFormEntryType,
                        graph: this.storeOptions.sourceGraph
                      },
                      { subject: this.applicationFormTableSubject,
                        predicate: applicationFormEntryPredicate,
                        object: applicationFormEntrySubject,
                        graph: this.storeOptions.sourceGraph }
                    ];
    this.storeOptions.store.addAll(triples);
    return applicationFormEntrySubject;
  }

  removeApplicationFormTable() {
    const applicationFormTableTriples = this.storeOptions.store.match(
      this.applicationFormTableSubject,
      undefined,
      undefined,
      this.storeOptions.sourceGraph
    );
    const triples = [
      ...applicationFormTableTriples,
      { subject: this.storeOptions.sourceNode,
        predicate: applicationFormTablePredicate,
        object: this.applicationFormTableSubject,
        graph: this.storeOptions.sourceGraph }
    ];
    this.storeOptions.store.removeStatements(triples);
  }

  removeEntryTriples(entry) {
    entry.inputFieldNames.forEach(key => {
      const propertiesTriples = [
        {
          subject: entry.applicationFormEntrySubject,
          predicate: actorNamePredicate,
          object: entry[key].oldValue,
          graph: this.storeOptions.sourceGraph
        }
      ];
      this.storeOptions.store.removeStatements(propertiesTriples);
    })
    const entryTriples = [
      {
        subject: this.applicationFormTableSubject,
        predicate: applicationFormEntryPredicate,
        object: entry.applicationFormEntrySubject,
        graph: this.storeOptions.sourceGraph
      }
    ];
    this.storeOptions.store.removeStatements(entryTriples);
  }

  updateFieldValueTriple(entry, field) {
    this.storeOptions.store.removeStatements([
      {
        subject: entry.applicationFormEntrySubject,
        predicate: entry[field].predicate,
        object: entry[field].oldValue,
        graph: this.storeOptions.sourceGraph
      }
    ]);
    if (entry[field])
      this.storeOptions.store.addAll([
        {
          subject: entry.applicationFormEntrySubject,
          predicate: entry[field].predicate,
          object: entry[field].value,
          graph: this.storeOptions.sourceGraph
        }
      ]);
  }

  @action
  addEntry() {
    if (!this.hasApplicationFormTable)
      this.createApplicationFormTable();

    const applicationFormEntrySubject = this.createApplicationFormEntry();

    this.entries.pushObject(new ApplicationFormEntry({
      applicationFormEntrySubject,
      actorName: "",
      numberChildrenForFullDay: 0,
      numberChildrenForHalfDay: 0,
      numberChildrenPerInfrastructure: 0,
      errors: []
    }));
  }

  @action
  updateActorNameValue(entry) {
    this.updateFieldValueTriple(entry, 'actorName');
  }

  @action
  updateNumberChildrenForFullDayValue(entry) {
    this.updateFieldValueTriple(entry, 'numberChildrenForFullDay');
  }

  @action
  updateNumberChildrenForHalfDayValue(entry) {
    this.updateFieldValueTriple(entry, 'numberChildrenForHalfDay');
  }

  @action
  updateNumberChildrenPerInfrastructureValue(entry) {
    this.updateFieldValueTriple(entry, 'numberChildrenPerInfrastructure');
  }

  @action
  removeEntry(entry) {
    if (this.applicationFormTableSubject) {
      this.removeEntryTriples(entry);

      if (!this.hasEntries)
        this.removeApplicationFormTable();
    }

    this.entries.removeObject(entry);

    this.hasBeenFocused = true;
    super.updateValidations(); // update validation of the general field
  }
}
