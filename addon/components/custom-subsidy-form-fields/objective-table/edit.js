import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const objectiveTableBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/bicycle-infrastructure#ObjectiveTable';
const bicycleInfrastructureUri = 'http://lblod.data.gift/vocabularies/subsidie/bicycle-infrastructure#';
const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';
const subsidyRulesUri = 'http://data.lblod.info/id/subsidies/rules/';
const csvw = 'http://www.w3.org/ns/csvw#';

const ObjectiveTableType = new rdflib.NamedNode(`${csvw}Table`);
const ObjectiveEntryType = new rdflib.NamedNode(`${csvw}Row`);
const objectiveTablePredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}ObjectiveTable`);
const objectiveEntryPredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}ObjectiveEntry`);

const approachTypePredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}approachType`);
const directionTypePredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}directionType`);
const bikeLaneTypePredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}bikeLaneType`);
const kilometersPredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}kilometerse`);

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

class ObjectiveEntry {
  @tracked objectiveEntrySubject;

  constructor({
    estimatedCostEntrySubject,
    approachType,
    directionType,
    bikeLaneType,
    kilometers,
    index
  }) {
    this.estimatedCostEntrySubject = estimatedCostEntrySubject;
    this.approachType = new EntryProperties(approachType, approachTypePredicate);
    this.directionType = new EntryProperties(directionType, directionTypePredicate);
    this.bikeLaneType = new EntryProperties(bikeLaneType, bikeLaneTypePredicate);
    this.kilometers = new EntryProperties(kilometers, kilometersPredicate);
    this.index = new EntryProperties(index, indexPredicate);
  }
}

const tableRows = [
  {
    approachType: "Verbeteren",
    bikeLaneType: "Aan- en vrijliggend fietspad langs 1 kant van de weg",
    directionType: "Enkelrichting",
    kilometers: 0,
  },
  {
    approachType: "Verbeteren",
    bikeLaneType: "Aan- en vrijliggend fietspad langs 1 kant van de weg",
    directionType: "Enkelrichting",
    kilometers: 0,
    index: 1
  },
  {
    approachType: "Verbeteren",
    bikeLaneType: "Aan- en vrijliggend fietspad langs 1 kant van de weg",
    directionType: "Enkelrichting",
    kilometers: 0,
    index: 2
  },
  {
    approachType: "Verbeteren",
    bikeLaneType: "Aan- en vrijliggend fietspad langs 1 kant van de weg",
    directionType: "Enkelrichting",
    kilometers: 0,
    index: 3
  }
]

export default class CustomSubsidyFormFieldsObjectiveTableEditComponent extends InputFieldComponent {
  @tracked objectiveTableSubject = null;

  @tracked improveEntries = [];
  @tracked renewEntries = [];

  bikeLaneTypes = [
    "Aan- en vrijliggend fietspad langs 1 kant van de weg",
    "Aan- en vrijliggend fietspad langs beide kanten van de weg",
    "Fietsweg",
    "Fietssugestiestroken",
    "Fietszone"
  ];

  directionTypes = [
    "Enkelrichting",
    "Dubbelrichting"
  ];

  approachTypes = [
    "Verbeteren",
    "Vernieuwen"
  ];

  constructor() {
    super(...arguments);
    // this.loadProvidedValue();

    // Create table and entries in the store if not already existing
    next(this, () => {
      this.initializeTable();
    });
  }

  get hasObjectiveTable() {
    if (!this.objectiveTableSubject)
      return false;
    else
      return this.storeOptions.store.match(this.sourceNode,
                                          objectiveTablePredicate,
                                          this.objectiveTableSubject,
                                          this.storeOptions.sourceGraph).length > 0;
  }

  initializeTable() {
    if (!this.hasObjectiveCostTable) {
      this.createObjectiveTable();
      this.improveEntries = this.createImproveEntries();
      this.renewEntries = this.createRenewEntries();
      super.updateValidations(); // Updates validation of the table
    }
  }

  createObjectiveTable() {
    const uuid = uuidv4();
    this.objectiveTableSubject = new rdflib.NamedNode(`${objectiveTableBaseUri}/${uuid}`);
    const triples = [
      {
        subject: this.objectiveTableSubject,
        predicate: RDF('type'),
        object: ObjectiveTableType,
        graph: this.storeOptions.sourceGraph
      },
      {
        subject: this.objectiveTableSubject,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph
      },
      {
        subject: this.storeOptions.sourceNode,
        predicate: objectiveTablePredicate,
        object: this.objectiveTableSubject,
        graph: this.storeOptions.sourceGraph
      }
    ];
    this.storeOptions.store.addAll(triples);
  }

  createImproveEntries() {
    let entries = [];
    const estimatedCostEntriesDetails = this.createEstimatedCostEntries();
    estimatedCostEntriesDetails.forEach(detail => {
      const newEntry = new ObjectiveEntry({
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

  createTotalObjectiveEntries() {
    let triples = [];



    this.storeOptions.store.addAll(triples);
    return estimatedCostEntriesDetails;
  }




}
