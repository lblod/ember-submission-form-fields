import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const climateTableBaseUri = 'http://data.lblod.info/climate-tables';
const climateEntryBaseUri = 'http://data.lblod.info/climate-entries';
const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';
const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';


const climateTableType = new rdflib.NamedNode(`${lblodSubsidieBaseUri}climateTable`);
const ClimateEntryType = new rdflib.NamedNode(`${extBaseUri}EngagementEntry`);
const climateTablePredicate = new rdflib.NamedNode(`${lblodSubsidieBaseUri}climateTable`);
const climateEntryPredicate = new rdflib.NamedNode(`${extBaseUri}climateEntry`);
const actionDescriptionPredicate = new rdflib.NamedNode(`${extBaseUri}actionDescription`);
const costPerUnitPredicate = new rdflib.NamedNode(`${extBaseUri}costPerUnit`);
const inputAmountPerActionPredicate = new rdflib.NamedNode(`${extBaseUri}inputAmountPerAction`);
const restitutionPredicate = new rdflib.NamedNode(`${extBaseUri}restitution`);
const toRealiseUnitsPredicate = new rdflib.NamedNode(`${extBaseUri}toRealiseUnits`);
const indexPredicate = new rdflib.NamedNode('http://mu.semte.ch/vocabularies/ext/index');

const staticRows = [
  {
    description: 'Algemene beleidsdoelstellingen: Ondersteuning Burgemeestersconvenant2030' ,
    cost: '15ct per inwoner met een maximum plafond van 20.000 €',
    index: 1
  },
  {
    description: 'Algemene beleidsdoelstellingen: Ondersteuning Strategisch Vastgoedplan' ,
    cost: 'Gemeente < 25.000 | inwoners: 15.000 € | Gemeente 25.000-100.000 | inwoners: 40.000 € | Gemeente >100.000 | inwoners: 60.000 €',
    index: 2
  },
  {
    description: 'Algemene beleidsdoelstellingen: Technische assistentie aanbestedingen publiek patrimonium of klimaatwijken met hefboom 1:10' ,
    cost: 'nvt',
    index: 3
  },
  {
    description: 'Werf 1 - Vergroening: Investeringssteun voor het planten van bomen op publiek domein' ,
    cost: '€ 150,00',
    index: 4
  },
  {
    description: 'Werf 1 - Vergroening: Investeringssteun voor het planten van bomen op privaat domein (door particulieren, verenigingen, KMO"s)' ,
    cost: '€ 50,00',
    index: 5
  },
  {
    description: 'Werf 1 - Vergroening: Investeringssteun voor het planten van hagen (per meter) op publiek domein' ,
    cost: '€ 13,50',
    index: 6
  },
  {
    description: 'Werf 1 - Vergroening: Investeringssteun voor het planten van hagen (per meter) op privaat domein (door particulieren, verenigingen, KMO"s)' ,
    cost: '€ 5,00',
    index: 7
  },
  {
    description: 'Werf 1 - Vergroening: Investeringssteun geveltuinbeplanting (type geveltuin, per meter) door particulieren' ,
    cost: '€ 38,50',
    index: 8
  },
  {
    description: 'Werf 1 - Vergroening: Investeringssteun aanleg natuurgroenperk van minimaal 10m2 op openbaar toegankelijk domein' ,
    cost: '€ 540,00',
    index: 9
  },
  {
    description: 'Werf 2 - Verrijk je wijk: Ondersteuning traject collectieve renovaties (per wooneenheid)' ,
    cost: '€ 75,00',
    index: 10
  },
  {
    description: 'Werf 2 - Verrijk je wijk: Aanbesteding participatieve hernieuwbare energie (per 18kWp)' ,
    cost: '€ 990,00',
    index: 11
  },
  {
    description: 'Werf 2 - Verrijk je wijk: Opstarttraject lokale energiegemeenschap' ,
    cost: '€ 20.000,00',
    index: 12
  },
  {
    description: 'Werf 3 - Iedere buurt deelt: Jaar 1 afname garantie per jaar per toegangspunt voor koolstofvrije deelsystemen (1 toegangspunt leidt tot 2 deelwagens)' ,
    cost: '€ 12.000,00',
    index: 13
  },
  {
    description: 'Werf 3 - Iedere buurt deelt: Jaar 2 afname garantie per jaar per toegangspunt voor koolstofvrije deelsystemen (1 toegangspunt leidt tot 2 deelwagens)' ,
    cost: '€ 8.400,00',
    index: 14
  },
  {
    description: 'Werf 3 - Iedere buurt deelt: Jaar 3 afname garantie per jaar per toegangspunt voor koolstofvrije deelsystemen (1 toegangspunt leidt tot 2 deelwagens)' ,
    cost: '€ 4.800,00',
    index: 15
  },
  {
    description: 'Werf 3 - Iedere buurt deelt: Promotiecampagne per 2 nieuwe toegangspunten' ,
    cost: '€ 7.500,00',
    index: 16
  },
  {
    description: 'Werf 4 - Water het nieuwe goud: Investeringssteun per 1 m² ontharding publiek domein' ,
    cost: '€ 50,00',
    index: 17
  },
  {
    description: 'Werf 4 - Water het nieuwe goud: investeringssteun per 1 m² ontharding privaat domein' ,
    cost: '€ 35,00',
    index: 18
  },
  {
    description: 'Werf 4 - Water het nieuwe goud: investeringssteun per 1 m³ hemelwaterput + infiltratievoorziening in de bebouwde omgeving' ,
    cost: '€ 500,00',
    index: 19
  },
  {
    description: 'Werf 4 - Water het nieuwe goud: investeringssteun per 1 m³ hemelwaterbuffer op openbaar toegankelijk domein' ,
    cost: '€ 1.000,00',
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
    inputAmountPerAction,
    restitution,
    toRealiseUnits,
    index
  }) {
    this.climateEntrySubject = climateEntrySubject;

    this.actionDescription = new EntryProperties(actionDescription, actionDescriptionPredicate);
    this.costPerUnit = new EntryProperties(costPerUnit, costPerUnitPredicate);
    this.inputAmountPerAction = new EntryProperties(inputAmountPerAction, inputAmountPerActionPredicate);
    this.restitution = new EntryProperties(restitution, restitutionPredicate);
    this.toRealiseUnits = new EntryProperties(toRealiseUnits, toRealiseUnitsPredicate);
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
    const triples =  matches.triples;

    if (triples.length) {
      this.climateTableSubject = triples[0].object; // assuming only one per form

      const entriesMatches = triplesForPath({
        store: this.storeOptions.store,
        path: climateTablePredicate,
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
            engagementEntrySubject: entry.object,
            actionDescription: parsedEntry.actionDescription,
            costPerUnit: parsedEntry.costPerUnit,
            climateTable: parsedEntry.climateTable,
            inputAmountPerAction: parsedEntry.inputAmountPerAction,
            restitution: parsedEntry.restitution,
            toRealiseUnits: parsedEntry.toRealiseUnits,
            index: parseInt(parsedEntry.index)
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
      if (entryProperties.find(entry => entry.predicate.value == actionDescriptionPredicate.value))
      entry.actionDescription = entryProperties.find(
        entry => entry.predicate.value == actionDescriptionPredicate.value
      ).object.value;
      if (entryProperties.find(entry => entry.predicate.value == costPerUnitPredicate.value))
      entry.costPerUnit = entryProperties.find(
        entry => entry.predicate.value == costPerUnitPredicate.value
      ).object.value;
      if (entryProperties.find(entry => entry.predicate.value == inputAmountPerActionPredicate.value))
        entry.inputAmountPerAction = entryProperties.find(
          entry => entry.predicate.value == inputAmountPerActionPredicate.value
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
    const triples = [ { subject: this.climateTableSubject,
                        predicate: RDF('type'),
                        object: climateTableType,
                        graph: this.storeOptions.sourceGraph
                      },
                      { subject: this.climateTableSubject,
                        predicate: MU('uuid'),
                        object: uuid,
                        graph: this.storeOptions.sourceGraph
                      },
                      { subject: this.storeOptions.sourceNode,
                        predicate: climateTablePredicate,
                        object: this.climateTableSubject,
                        graph: this.storeOptions.sourceGraph }
                    ];
    this.storeOptions.store.addAll(triples);
  }

  createEntries() {
    let entries = [];
    const climateEntriesDetails = this.createClimateEntries();
    climateEntriesDetails.forEach(detail => {

      const newEntry = new ClimateEntry({
        climateEntrySubject: detail.subject,
        actionDescription: detail.description,
        costPerUnit: detail.cost,
        inputAmountPerAction: 0,
        restitution: 0,
        toRealiseUnits: 0,
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
    staticRows.forEach(target => {
      const uuid = uuidv4();
      const climateEntrySubject = new rdflib.NamedNode(`${climateEntryBaseUri}/${uuid}`);
      climateEntriesDetails.push({
        subject: climateEntrySubject,
        description: target.description,
        cost: target.cost,
        index: target.index
      });
      triples.push({ subject: climateEntrySubject,
                    predicate: RDF('type'),
                    object: ClimateEntryType,
                    graph: this.storeOptions.sourceGraph
                  },
                  { subject: climateEntrySubject,
                    predicate: MU('uuid'),
                    object: uuid,
                    graph: this.storeOptions.sourceGraph
                  },
                  { subject: climateEntrySubject,
                    predicate: climateEntryPredicate,
                    object: climateEntrySubject,
                    graph: this.storeOptions.sourceGraph }
        );
    });
    return climateEntriesDetails;
  }

  initializeEntriesFields(entries) {
    let triples = [];
    console.log(entries)
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
          predicate: entry['inputAmountPerAction'].predicate,
          object: entry['inputAmountPerAction'].value,
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
}
