import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const bicycleInfrastructureUri = 'http://lblod.data.gift/vocabularies/subsidie/bicycle-infrastructure#';
const objectiveTableBaseUri = `${bicycleInfrastructureUri}ObjectiveTable`;
const ObjectiveTableType = new rdflib.NamedNode(`${bicycleInfrastructureUri}ObjectiveTable`);
const objectiveTablePredicate = new rdflib.NamedNode(`${bicycleInfrastructureUri}ObjectiveTable`);

export default class CustomSubsidyFormFieldsObjectiveTableEditComponent extends InputFieldComponent {
  @tracked objectiveTableSubject = null;

  get hasObjectiveTable() {
    if (!this.objectiveTableSubject)
      return false;
    else
      return this.storeOptions.store.match(this.sourceNode,
                                          objectiveTablePredicate,
                                          this.objectiveTableSubject,
                                          this.storeOptions.sourceGraph).length > 0;
  }

  constructor() {
    super(...arguments);
    this.loadProvidedValue();

    // Create table and entries in the store if not already existing
    next(this, () => {
      this.initializeTable();
    });
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const triples = matches.triples;

    if (triples.length) {
      this.objectiveTableSubject = triples[0].object; // assuming only one per form
    }
  }

  initializeTable() {
    if (!this.hasObjectiveTable) {
      this.createObjectiveTable();
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
}
