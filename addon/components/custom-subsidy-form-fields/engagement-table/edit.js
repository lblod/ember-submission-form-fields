import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const engagementTableBaseUri = 'http://data.lblod.info/engagement-tables';
const engagementEntryBaseUri = 'http://data.lblod.info/engagement-entries';
const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';
const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';

const EngagementTableType = new rdflib.NamedNode(`${lblodSubsidieBaseUri}EngagementTable`);
const EngagementEntryType = new rdflib.NamedNode(`${extBaseUri}EngagementEntry`);
const engagementTablePredicate = new rdflib.NamedNode(`${lblodSubsidieBaseUri}engagementTable`);
const engagementEntryPredicate = new rdflib.NamedNode(`${extBaseUri}engagementEntry`);
const targetPredicate = new rdflib.NamedNode('http://mu.semte.ch/vocabularies/ext/target');
const existingStaffPredicate = new rdflib.NamedNode('http://mu.semte.ch/vocabularies/ext/existingStaff');
const additionalStaffPredicate = new rdflib.NamedNode('http://mu.semte.ch/vocabularies/ext/additionalStaff');
const volunteersPredicate = new rdflib.NamedNode('http://mu.semte.ch/vocabularies/ext/volunteers');
const estimatedCostPredicate = new rdflib.NamedNode('http://mu.semte.ch/vocabularies/ext/estimatedCost');
const indexPredicate = new rdflib.NamedNode('http://mu.semte.ch/vocabularies/ext/index');

const targets = [
  { label: 'Sensibilisering en preventie', index: 1 },
  { label: 'Bronopsporing',                index: 2 },
  { label: 'Quarantaine coaching',         index: 3 },
  { label: 'Hulp aan kwetsbare personen',  index: 4 },
  { label: 'Contactopsporing',             index: 5 }
];

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

export default class CustomSubsidyFormFieldsEngagementTableEditComponent extends InputFieldComponent {
  @tracked engagementTableSubject = null
  @tracked entries = [];

  constructor() {
    super(...arguments);
    this.loadProvidedValue();

    // Create table and entries in the store if not already existing
    next(this, () => {
      this.initializeTable();
    });
  }

  get hasEngagementTable() {
    if (!this.engagementTableSubject)
      return false;
    else
      return this.storeOptions.store.match(this.sourceNode,
                                           engagementTablePredicate,
                                           this.engagementTableSubject,
                                           this.storeOptions.sourceGraph).length > 0;
  }

  get sortedEntries() {
    return this.entries.sort((a,b) => (a.index.value < b.index.value));
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

  initializeTable() {
    if (!this.hasEngagementTable) {
      this.createEngagementTable();
      this.entries = this.createEntries();
      super.updateValidations(); // Updates validation of the table
    }
  }

  createEngagementTable() {
    const uuid = uuidv4();
    this.engagementTableSubject = new rdflib.NamedNode(`${engagementTableBaseUri}/${uuid}`);
    const triples = [ { subject: this.engagementTableSubject,
                        predicate: RDF('type'),
                        object: EngagementTableType,
                        graph: this.storeOptions.sourceGraph
                      },
                      { subject: this.engagementTableSubject,
                        predicate: MU('uuid'),
                        object: uuid,
                        graph: this.storeOptions.sourceGraph
                      },
                      { subject: this.storeOptions.sourceNode,
                        predicate: engagementTablePredicate,
                        object: this.engagementTableSubject,
                        graph: this.storeOptions.sourceGraph }
                    ];
    this.storeOptions.store.addAll(triples);
  }

  createEntries() {
    let entries = [];
    targets.forEach(target => {
      const engagementEntrySubject = this.createEngagementEntry();
      const newEntry = new EngagementEntry({
        engagementEntrySubject,
        target: target.label,
        existingStaff: 0,
        additionalStaff: 0,
        volunteers: 0,
        estimatedCost: 0,
        index: target.index
      });

      entries.pushObject(newEntry);

      this.updateEntryFields(newEntry);
    });
    return entries;
  }

  createEngagementEntry() {
    const uuid = uuidv4();
    const engagementEntrySubject = new rdflib.NamedNode(`${engagementEntryBaseUri}/${uuid}`);
    const triples = [ { subject: engagementEntrySubject,
                        predicate: RDF('type'),
                        object: EngagementEntryType,
                        graph: this.storeOptions.sourceGraph
                      },
                      { subject: engagementEntrySubject,
                        predicate: MU('uuid'),
                        object: uuid,
                        graph: this.storeOptions.sourceGraph
                      },
                      { subject: this.engagementTableSubject,
                        predicate: engagementEntryPredicate,
                        object: engagementEntrySubject,
                        graph: this.storeOptions.sourceGraph }
                    ];
    this.storeOptions.store.addAll(triples);
    return engagementEntrySubject;
  }

  updateFieldValueTriple(entry, field) {
    const fieldValueTriples = this.storeOptions.store.match(
      entry.engagementEntrySubject,
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
          subject: entry.engagementEntrySubject,
          predicate: entry[field].predicate,
          object: entry[field].value,
          graph: this.storeOptions.sourceGraph
        }
      ]);
    }
  }

  updateTargetValue(entry) {
    entry.target.errors = [];
    this.updateFieldValueTriple(entry, 'target');

    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  @action
  updateExistingStaffValue(entry) {
    entry.existingStaff.errors = [];
    const parsedValue = parseInt(entry.existingStaff.value);
    entry.existingStaff.value = !isNaN(parsedValue) ? parsedValue : entry.existingStaff.value;
    this.updateFieldValueTriple(entry, 'existingStaff');

    if (this.isEmpty(entry.existingStaff.value)) {
      entry.existingStaff.errors.pushObject({
        message: 'Bestaand personeelskader is verplicht.'
      });
    } else if (!this.isPositiveInteger(entry.existingStaff.value)) {
      entry.existingStaff.errors.pushObject({
        message: 'Bestaand personeelskader is niet een positief nummer.'
      });
    }
    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  @action
  updateAdditionalStaffValue(entry) {
    entry.additionalStaff.errors = [];
    const parsedValue = parseInt(entry.additionalStaff.value);
    entry.additionalStaff.value = !isNaN(parsedValue) ? parsedValue : entry.additionalStaff.value;
    this.updateFieldValueTriple(entry, 'additionalStaff');

    if (this.isEmpty(entry.additionalStaff.value)) {
      entry.additionalStaff.errors.pushObject({
        message: 'Extra aangetrokken betaald personeel is verplicht.'
      });
    } else if (!this.isPositiveInteger(entry.additionalStaff.value)) {
      entry.additionalStaff.errors.pushObject({
        message: 'Extra aangetrokken betaald personeel is niet een positief nummer.'
      });
    }
    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  @action
  updateVolunteersValue(entry) {
    entry.volunteers.errors = [];
    const parsedValue = parseInt(entry.volunteers.value);
    entry.volunteers.value = !isNaN(parsedValue) ? parsedValue : entry.volunteers.value;
    this.updateFieldValueTriple(entry, 'volunteers');

    if (this.isEmpty(entry.volunteers.value)) {
      entry.volunteers.errors.pushObject({
        message: 'Ingezette vrijwilligers is verplicht.'
      });
    } else if (!this.isPositiveInteger(entry.volunteers.value)) {
      entry.volunteers.errors.pushObject({
        message: 'Ingezette vrijwilligers is niet een positief nummer.'
      });
    }
    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  @action
  updateEstimatedCostValue(entry) {
    entry.estimatedCost.errors = [];
    const parsedValue = parseInt(entry.estimatedCost.value);
    entry.estimatedCost.value = !isNaN(parsedValue) ? parsedValue : entry.estimatedCost.value;
    this.updateFieldValueTriple(entry, 'estimatedCost');

    if (this.isEmpty(entry.estimatedCost.value)) {
      entry.estimatedCost.errors.pushObject({
        message: 'Raming inzet werkingsmiddelen is verplicht.'
      });
    } else if (!this.isPositiveInteger(entry.estimatedCost.value)) {
      entry.estimatedCost.errors.pushObject({
        message: 'Raming inzet werkingsmiddelen is niet een positief nummer.'
      });
    } else if (!this.hasMaxLength(entry.estimatedCost.value, 6)) {
      entry.estimatedCost.errors.pushObject({
        message: 'Raming inzet werkingsmiddelen is is langer dan 6 cijfers.'
      });
    }
    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table  }
  }

  updateIndexValue(entry) {
    this.updateFieldValueTriple(entry, 'index');

    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

// FIELDS VALIDATIONS

  isEmpty(value) {
    return value.toString().length == 0;
  }

  isPositiveInteger(value) {
    return (value === parseInt(value)) && (value >= 0);
  }

  hasMaxLength(value, maxLengh) {
    return value.toString().length <= maxLengh;
  }

  /**
  * Update entry fields in the store.
  */
  updateEntryFields(entry) {
    this.updateTargetValue(entry);
    this.updateExistingStaffValue(entry);
    this.updateAdditionalStaffValue(entry);
    this.updateVolunteersValue(entry);
    this.updateEstimatedCostValue(entry);
    this.updateIndexValue(entry);
  }
}
