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

// TODO
// Add errors support

class ApplicationFormEntry {
  @tracked applicationFormEntrySubject

  @tracked oldActorName
  @tracked oldNumberChildrenForFullDay
  @tracked oldNumberChildrenForHalfDay
  @tracked oldNumberChildrenPerInfrastructure
  @tracked oldTotalAmount

  @tracked actorName
  @tracked numberChildrenForFullDay
  @tracked numberChildrenForHalfDay
  @tracked numberChildrenPerInfrastructure
  @tracked totalAmount

  constructor({
    applicationFormEntrySubject,
    actorName,
    numberChildrenForFullDay,
    numberChildrenForHalfDay,
    numberChildrenPerInfrastructure,
    totalAmount
  }) {
    this.applicationFormEntrySubject = applicationFormEntrySubject;
    this.oldActorName = actorName;
    this.oldNumberChildrenForFullDay = numberChildrenForFullDay;
    this.oldNumberChildrenForHalfDay = numberChildrenForHalfDay;
    this.oldNumberChildrenPerInfrastructure = numberChildrenPerInfrastructure;
    this.oldTotalAmount = totalAmount;

    this.actorName = actorName;
    this.numberChildrenForFullDay = numberChildrenForFullDay;
    this.numberChildrenForHalfDay = numberChildrenForHalfDay;
    this.numberChildrenPerInfrastructure = numberChildrenPerInfrastructure;
    this.totalAmount = totalAmount;
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
      // TODO: the semantics from any in forking-store and rdflibstore are different,
      // that's why we use match. (to easy potential migration)_
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
            totalAmount: entry.totalAmount ? entry.totalAmount.value : 0
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
    const triples = [
      {
        subject: entry.applicationFormEntrySubject,
        predicate: actorNamePredicate,
        object: entry.oldActorName, 
        graph: this.storeOptions.sourceGraph
      },
      {
        subject: this.applicationFormTableSubject,
        predicate: applicationFormEntryPredicate,
        object: entry.applicationFormEntrySubject, 
        graph: this.storeOptions.sourceGraph
      }
    ];
    this.storeOptions.store.removeStatements(triples);
  }

  updateActorNameValueTriple(entry) {
    this.storeOptions.store.removeStatements([
      {
        subject: entry.applicationFormEntrySubject,
        predicate: actorNamePredicate,
        object: entry.oldActorName, 
        graph: this.storeOptions.sourceGraph
      }
    ]);
    if (entry.actorName)
      this.storeOptions.store.addAll([
        {
          subject: entry.applicationFormEntrySubject,
          predicate: actorNamePredicate,
          object: entry.actorName,
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
      totalAmount: 0
    }));
  }

  @action
  updateActorNameValue(entry) {
    entry.actorName = entry.actorName.trim();
    this.updateActorNameValueTriple(entry);
    entry.oldActorName = entry.actorName;
    this.hasBeenFocused = true;
    super.updateValidations(); // update validation of the general field
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
