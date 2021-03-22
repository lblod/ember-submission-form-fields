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
const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';
const subsidyRulesUri = 'http://data.lblod.info/id/subsidies/rules/';


const climateTableType = new rdflib.NamedNode(`${lblodSubsidieBaseUri}ClimateTable`);
const ClimateEntryType = new rdflib.NamedNode(`${extBaseUri}ClimateEntry`);
const climateTablePredicate = new rdflib.NamedNode(`${lblodSubsidieBaseUri}climateTable`);
const climateEntryPredicate = new rdflib.NamedNode(`${extBaseUri}climateEntry`);
const actionDescriptionPredicate = new rdflib.NamedNode(`${extBaseUri}actionDescription`);
const costPerUnitPredicate = new rdflib.NamedNode(`${extBaseUri}costPerUnit`);
const amountPerActionPredicate = new rdflib.NamedNode(`${extBaseUri}amountPerAction`);
const restitutionPredicate = new rdflib.NamedNode(`${extBaseUri}restitution`);
const toRealiseUnitsPredicate = new rdflib.NamedNode(`${extBaseUri}toRealiseUnits`);
const indexPredicate = new rdflib.NamedNode(`${extBaseUri}index`);

const tableRows = [
  {
    uuid: "0f4e3cff-4fb8-4892-9dca-1d582a433c77",
    description: 'Algemene beleidsdoelstellingen: Ondersteuning Burgemeestersconvenant2030',
    cost: '15ct per inwoner met een maximum plafond van 20.000 €',
    amountPerAction: 0,
    index: 1
  },
  {
    uuid: "6469df9c-b933-45c3-9457-4958c33935ca",
    description: 'Algemene beleidsdoelstellingen: Ondersteuning Strategisch Vastgoedplan',
    cost: 0,
    amountPerAction: 0,
    index: 2
  },
  {
    uuid: "286c35b3-4817-4b33-9ad5-828747610b2a",
    description: 'Algemene beleidsdoelstellingen: Technische assistentie aanbestedingen publiek patrimonium of klimaatwijken met hefboom 1:10',
    cost: 'nvt',
    amountPerAction: 0,
    index: 3
  },
  {
    uuid: "384b2567-ab54-4b6f-b19c-a438829b3666",
    description: 'Werf 1 - Vergroening: Investeringssteun voor het planten van bomen op publiek domein',
    cost: 150.00,
    amountPerAction: 0,
    index: 4
  },
  {
    uuid: "e6339d50-0969-4911-924c-bb0c629c7b00",
    description: 'Werf 1 - Vergroening: Investeringssteun voor het planten van bomen op privaat domein (door particulieren, verenigingen, KMO\'s)',
    cost: 50.00,
    amountPerAction: 0,
    index: 5
  },
  {
    uuid: "396fe1bd-0a13-4823-8824-05ea3a527337",
    description: 'Werf 1 - Vergroening: Investeringssteun voor het planten van hagen (per meter) op publiek domein',
    cost: 13.50,
    amountPerAction: 0,
    index: 6
  },
  {
    uuid: "75ad483c-b7cb-411c-b9b1-07af31bfc0e6",
    description: 'Werf 1 - Vergroening: Investeringssteun voor het planten van hagen (per meter) op privaat domein (door particulieren, verenigingen, KMO\'s)',
    cost: 5.00,
    amountPerAction: 0,
    index: 7
  },
  {
    uuid: "75b3a2d2-bf33-49e7-9ced-c166213970bb",
    description: 'Werf 1 - Vergroening: Investeringssteun geveltuinbeplanting (type geveltuin, per meter) door particulieren',
    cost: 38.50,
    amountPerAction: 0,
    index: 8
  },
  {
    uuid: "567c8492-c587-4876-b910-f6bbcd25c971",
    description: 'Werf 1 - Vergroening: Investeringssteun aanleg natuurgroenperk van minimaal 10m2 op openbaar toegankelijk domein',
    cost: 540.00,
    amountPerAction: 0,
    index: 9
  },
  {
    uuid: "0eb27f0d-bbe3-41c1-8793-b1b13b1b8715",
    description: 'Werf 2 - Verrijk je wijk: Ondersteuning traject collectieve renovaties (per wooneenheid)',
    cost: 75.00,
    amountPerAction: 0,
    index: 10
  },
  {
    uuid: "23e94ba7-57cf-4ad4-8f5e-b4a8dcc6f816",
    description: 'Werf 2 - Verrijk je wijk: Aanbesteding participatieve hernieuwbare energie (per 18kWp)',
    cost: 990.00,
    amountPerAction: 0,
    index: 11
  },
  {
    uuid: "38d6d2bd-e42b-4d7e-8fea-9a371d9cf22f",
    description: 'Werf 2 - Verrijk je wijk: Opstarttraject lokale energiegemeenschap',
    cost: 20000.00,
    amountPerAction: 0,
    index: 12
  },
  {
    uuid: "3b939085-ea60-468e-9fb8-ee0b54f1d73c",
    description: 'Werf 3 - Iedere buurt deelt: Jaar 1 afname garantie per jaar per toegangspunt voor koolstofvrije deelsystemen (1 toegangspunt leidt tot 2 deelwagens)',
    cost: 12000.00,
    amountPerAction: 0,
    index: 13
  },
  {
    uuid: "e460d281-8b5b-445e-a34d-2a6cb9c10675",
    description: 'Werf 3 - Iedere buurt deelt: Jaar 2 afname garantie per jaar per toegangspunt voor koolstofvrije deelsystemen (1 toegangspunt leidt tot 2 deelwagens)',
    cost: 8400.00,
    amountPerAction: 0,
    index: 14
  },
  {
    uuid: "49150951-e112-4649-a573-475fd3f22e99",
    description: 'Werf 3 - Iedere buurt deelt: Jaar 3 afname garantie per jaar per toegangspunt voor koolstofvrije deelsystemen (1 toegangspunt leidt tot 2 deelwagens)',
    cost: 4800.00,
    amountPerAction: 0,
    index: 15
  },
  {
    uuid: "d66a5dbc-8913-4ccf-92bf-a4b62f3d5c58",
    description: 'Werf 3 - Iedere buurt deelt: Promotiecampagne per 2 nieuwe toegangspunten',
    cost: 7500.00,
    amountPerAction: 0,
    index: 16
  },
  {
    uuid: "f4956772-fd3e-48f5-b546-e5298fff78ad",
    description: 'Werf 4 - Water het nieuwe goud: Investeringssteun per 1 m² ontharding publiek domein',
    cost: 50.00,
    amountPerAction: 0,
    index: 17
  },
  {
    uuid: "0efb6b57-2ab4-4526-b71e-ec3568f01d1b",
    description: 'Werf 4 - Water het nieuwe goud: investeringssteun per 1 m² ontharding privaat domein',
    cost: 35.00,
    amountPerAction: 0,
    index: 18
  },
  {
    uuid: "1c4fbee8-1b18-4c1a-9a05-a3b20a5eae94",
    description: 'Werf 4 - Water het nieuwe goud: investeringssteun per 1 m³ hemelwaterput + infiltratievoorziening in de bebouwde omgeving',
    cost: 500.00,
    amountPerAction: 0,
    index: 19
  },
  {
    uuid: "5d485edc-3352-4bbe-a74c-e50cc0e22dec",
    description: 'Werf 4 - Water het nieuwe goud: investeringssteun per 1 m³ hemelwaterbuffer op openbaar toegankelijk domein',
    cost: 1000.00,
    amountPerAction: 0,
    index: 20
  },

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


class ClimateEntry {
  @tracked climateEntrySubject;

  constructor({
    climateEntrySubject,
    actionDescription,
    costPerUnit,
    amountPerAction,
    restitution,
    toRealiseUnits,
    index
  }) {
    this.climateEntrySubject = climateEntrySubject;

    this.actionDescription = new EntryProperties(actionDescription, actionDescriptionPredicate);
    this.costPerUnit = new EntryProperties(costPerUnit, costPerUnitPredicate);
    this.amountPerAction = new EntryProperties(amountPerAction, amountPerActionPredicate);
    this.restitution = new EntryProperties(restitution, restitutionPredicate);
    this.toRealiseUnits = new EntryProperties(toRealiseUnits, toRealiseUnitsPredicate);
    // this.requiresValidation = new EntryProperties(toRealiseUnits, toRealiseUnitsPredicate);
    this.index = new EntryProperties(index, indexPredicate);
  }
}


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

      const entriesMatches = triplesForPath({
        store: this.storeOptions.store,
        path: climateEntryPredicate,
        formGraph: this.storeOptions.formGraph,
        sourceNode: this.climateTableSubject,
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

          this.entries.pushObject(new ClimateEntry({
            climateEntrySubject: entry.object,
            actionDescription: parsedEntry.actionDescription,
            costPerUnit: parsedEntry.costPerUnit,
            amountPerAction: parsedEntry.amountPerAction,
            restitution: parsedEntry.restitution,
            toRealiseUnits: parsedEntry.toRealiseUnits,
            index: parseInt(parsedEntry.index)
          }));

          // sort the entries by their index. Otherwhise chaos
          this.entries.sort((a, b) => a.index.value - b.index.value);
        }
      }
    }
  }

  /**
  * Parse entry properties from triples to a simple object with the triple values
  */
  parseEntryProperties(entryProperties) {
    let entry = {};
    if (entryProperties.find(entry => entry.predicate.value == actionDescriptionPredicate.value))
      entry.actionDescription = entryProperties.find(
        entry => entry.predicate.value == actionDescriptionPredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == costPerUnitPredicate.value))
      entry.costPerUnit = entryProperties.find(
        entry => entry.predicate.value == costPerUnitPredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == amountPerActionPredicate.value))
      entry.amountPerAction = entryProperties.find(
        entry => entry.predicate.value == amountPerActionPredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == restitutionPredicate.value))
      entry.restitution = entryProperties.find(
        entry => entry.predicate.value == restitutionPredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == toRealiseUnitsPredicate.value))
      entry.toRealiseUnits = entryProperties.find(
        entry => entry.predicate.value == toRealiseUnitsPredicate.value
      ).object.value;
    if (entryProperties.find(entry => entry.predicate.value == indexPredicate.value))
      entry.index = entryProperties.find(
        entry => entry.predicate.value == indexPredicate.value
      ).object.value;
    return entry;
  }

  initializeTable() {
    if (!this.hasClimateTable) {
      this.createClimateTable();
      this.entries = this.createEntries();
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

  // Create entries to be used in HBS and saved in DB. Apply logic
  createEntries() {
    let entries = [];
    const climateEntriesDetails = this.createClimateEntries();
    climateEntriesDetails.forEach(detail => {
      const newEntry = new ClimateEntry({
        climateEntrySubject: detail.subject,
        actionDescription: detail.description,
        costPerUnit: this.checkCostForPopulation(detail.index, detail.cost, this.populationCount),
        amountPerAction: this.checkActionForPopulation(detail.index, detail.amountPerAction, this.populationCount) ,
        restitution: (detail.amountPerAction / 2).toFixed(2),
        toRealiseUnits: this.checkEenhedenConditions(detail.index, detail.amountPerAction, detail.cost),
        index: detail.index
      });
      entries.pushObject(newEntry);
    });

    this.initializeEntriesFields(entries);
    return entries;
  }

  createClimateEntries() {
    let triples = [];
    let climateEntriesDetails = [];
    tableRows.forEach(target => {

      const climateEntrySubject = () => {
        return new rdflib.NamedNode(`${subsidyRulesUri}/${target.uuid}`);
      };

      climateEntriesDetails.push({
        subject: climateEntrySubject(),
        description: target.description,
        amountPerAction: target.amountPerAction,
        cost: target.cost,
        index: target.index
      });
      triples.push({
        subject: climateEntrySubject(),
        predicate: RDF('type'),
        object: ClimateEntryType,
        graph: this.storeOptions.sourceGraph
      },
        {
          subject: climateEntrySubject(),
          predicate: MU('uuid'),
          object: target.uuid,
          graph: this.storeOptions.sourceGraph
        },
        {
          subject: this.climateTableSubject,
          predicate: climateEntryPredicate,
          object: climateEntrySubject(),
          graph: this.storeOptions.sourceGraph
        }
      );
    });
    this.storeOptions.store.addAll(triples);
    return climateEntriesDetails;
  }

  updateFieldValueTriple(entry, field) {
    const fieldValueTriples = this.storeOptions.store.match(
      entry.climateEntrySubject,
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
          subject: entry.climateEntrySubject,
          predicate: entry[field].predicate,
          object: entry[field].value,
          graph: this.storeOptions.sourceGraph
        }
      ]);
    }
  }

  initializeEntriesFields(entries) {
    let triples = [];
    entries.forEach(entry => {
      triples.push(
        {
          subject: entry.climateEntrySubject,
          predicate: entry['actionDescription'].predicate,
          object: entry['actionDescription'].value,
          graph: this.storeOptions.sourceGraph
        },
        {
          subject: entry.climateEntrySubject,
          predicate: entry['costPerUnit'].predicate,
          object: entry['costPerUnit'].value,
          graph: this.storeOptions.sourceGraph
        },
        {
          subject: entry.climateEntrySubject,
          predicate: entry['amountPerAction'].predicate,
          object: entry['amountPerAction'].value,
          graph: this.storeOptions.sourceGraph
        },
        {
          subject: entry.climateEntrySubject,
          predicate: entry['restitution'].predicate,
          object: entry['restitution'].value,
          graph: this.storeOptions.sourceGraph
        },
        {
          subject: entry.climateEntrySubject,
          predicate: entry['toRealiseUnits'].predicate,
          object: entry['toRealiseUnits'].value,
          graph: this.storeOptions.sourceGraph
        },
        {
          subject: entry.climateEntrySubject,
          predicate: entry['index'].predicate,
          object: entry['index'].value,
          graph: this.storeOptions.sourceGraph
        },
      );
    });

    this.storeOptions.store.addAll(triples);
  }

  @action
  updateAmountPerActionValue(entry) {
    const parsedValue = parseInt(entry.amountPerAction.value);
    entry.amountPerAction.errors = [];

    if (!this.isPositiveInteger(parsedValue)){
      entry.amountPerAction.errors.pushObject({
        message: 'Ingezet bedrag per actie is geen positief getal'
      });
    }

    entry.amountPerAction.value = !isNaN(parsedValue) ? parsedValue : entry.amountPerAction.value;
    entry.restitution.value = entry.amountPerAction.value / 2;
    entry.toRealiseUnits.value = this.checkEenhedenConditions(entry.index.value, entry.amountPerAction.value, entry.costPerUnit.value);

    this.updateFieldValueTriple(entry, 'amountPerAction');
    this.updateFieldValueTriple(entry, 'restitution');
    this.updateFieldValueTriple(entry, 'toRealiseUnits');

    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  // ------------------
  // FIELDS VALIDATIONS

  isPositiveInteger(value) {
    return (value === parseInt(value)) && (value >= 0);
  }

  isSmallerThan(value, max) {
    return value <= max;
  }
}
