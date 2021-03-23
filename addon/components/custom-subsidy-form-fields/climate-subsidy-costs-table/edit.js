import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const climateTableBaseUri = 'http://data.lblod.info/climate-tables';
const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';
const climateTableType = new rdflib.NamedNode(`${lblodSubsidieBaseUri}ClimateTable`);
const climateTablePredicate = new rdflib.NamedNode(`${lblodSubsidieBaseUri}climateTable`);


export default class CustomSubsidyFormFieldsClimateSubsidyCostsTableEditComponent extends InputFieldComponent {
  @tracked climateTableSubject = null
  @tracked entries = [];

  get hasClimateTable() {
    if (!this.climateTableSubject)
      return false;
    else
      return this.storeOptions.store.match(this.sourceNode,
        climateTablePredicate,
        this.climateTableSubject,
        this.storeOptions.sourceGraph).length > 0;
  }

  get populationCount() {
    // return { this.storeOptions.store.match(
    //   this.storeOptions.sourceNode,
    //   populationCountPredicate,
    //   undefined,
    //   this.storeOptions.sourceGraph
    // }

    // TODO: Set `Aantal inwoners` input to correct value from DB, then return that value for this getter
    return 90000;
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
      this.climateTableSubject = triples[0].object; // assuming only one per form
    }
  }

  initializeTable() {
    if (!this.hasClimateTable) {
      this.createClimateTable();
      super.updateValidations(); // Updates validation of the table
    }
  }

  createClimateTable() {
    const uuid = uuidv4();
    this.climateTableSubject = new rdflib.NamedNode(`${climateTableBaseUri}/${uuid}`);
    const triples = [{
      subject: this.climateTableSubject,
      predicate: RDF('type'),
      object: climateTableType,
      graph: this.storeOptions.sourceGraph
    },
    {
      subject: this.climateTableSubject,
      predicate: MU('uuid'),
      object: uuid,
      graph: this.storeOptions.sourceGraph
    },
    {
      subject: this.storeOptions.sourceNode,
      predicate: climateTablePredicate,
      object: this.climateTableSubject,
      graph: this.storeOptions.sourceGraph
    }
    ];
    this.storeOptions.store.addAll(triples);
  }


  //TODO some part needs to be moved of the following functions

  // set right amount based on conditions (row 2)
  checkCostForPopulation(index, cost, population) {
    if (index == 2) {
      if (population < 25000) return 15000;
      if (population > 25000 && population < 100000) return 40000;
      if (population > 100000) return 60000;
    } else {
      return cost;
    }
  }

  // set right amount based on calculation (row 1)
  checkActionForPopulation(index, count, population) {
    if (index == 1){
      const calculated = Math.round(0.15 * population);
      if (calculated > 20000) return 20000;
      return calculated;
    } else {
      return count;
    }
  }

  // Check if 'Te realiseren eenheden' is conditional (applies for row 1 & 2)
  checkEenhedenConditions(index, amountPerAction, costPerUnit) {
    if (index == 1 && amountPerAction > 0) {
      return "1 goedgekeurd SECAP2030";
    } else if (index == 2 && amountPerAction > 0) {
      return "1 strategisch vastgoedplan publiek patrimonium";
    } else if (index == 3) {
      return "/";
    } else if (amountPerAction <= 0) {
      return 0;
    } else {
      return (amountPerAction / parseInt(costPerUnit)).toFixed(2);
    }
  }

  isSmallerThan(value, max) {
    return value <= max;
  }
}
