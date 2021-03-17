import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import rdflib from 'browser-rdflib';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');
const engagementTableBaseUri = 'http://data.lblod.info/climate-tables';
const climateEntryBaseUri = 'http://data.lblod.info/climate-entries';
const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';
const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';

const rows = [
  {
    description: { type: 'Algemene beleidsdoelstellingen:', label: 'Ondersteuning Burgemeestersconvenant2030' },
    cost: '15ct per inwoner met een maximum plafond van 20.000 €',
    index: 1
  },
  {
    description: { type: 'Algemene beleidsdoelstellingen:', label: 'Ondersteuning Strategisch Vastgoedplan' },
    cost: 'Gemeente < 25.000 | inwoners: 15.000 € | Gemeente 25.000-100.000 | inwoners: 40.000 € | Gemeente >100.000 | inwoners: 60.000 €',
    index: 2
  },
  {
    description: { type: 'Algemene beleidsdoelstellingen:', label: 'Technische assistentie aanbestedingen publiek patrimonium of klimaatwijken met hefboom 1:10' },
    cost: 'nvt',
    index: 3
  },
  {
    description: { type: 'Werf 1 - Vergroening:', label: 'Investeringssteun voor het planten van bomen op publiek domein' },
    cost: '€ 150,00',
    index: 4
  },
  {
    description: { type: 'Werf 1 - Vergroening:', label: 'Investeringssteun voor het planten van bomen op privaat domein (door particulieren, verenigingen, KMO"s)' },
    cost: '€ 50,00',
    index: 5
  },
  {
    description: { type: 'Werf 1 - Vergroening:', label: 'Investeringssteun voor het planten van hagen (per meter) op publiek domein' },
    cost: '€ 13,50',
    index: 6
  },
  {
    description: { type: 'Werf 1 - Vergroening:', label: 'Investeringssteun voor het planten van hagen (per meter) op privaat domein (door particulieren, verenigingen, KMO"s)' },
    cost: '€ 5,00',
    index: 7
  },
  {
    description: { type: 'Werf 1 - Vergroening:', label: 'Investeringssteun geveltuinbeplanting (type geveltuin, per meter) door particulieren' },
    cost: '€ 38,50',
    index: 8
  },
  {
    description: { type: 'Werf 1 - Vergroening:', label: 'Investeringssteun aanleg natuurgroenperk van minimaal 10m2 op openbaar toegankelijk domein' },
    cost: '€ 540,00',
    index: 9
  },
  {
    description: { type: 'Werf 2 - Verrijk je wijk:', label: 'Ondersteuning traject collectieve renovaties (per wooneenheid)' },
    cost: '€ 75,00',
    index: 10
  },
  {
    description: { type: 'Werf 2 - Verrijk je wijk:', label: 'Aanbesteding participatieve hernieuwbare energie (per 18kWp)' },
    cost: '€ 990,00',
    index: 11
  },
  {
    description: { type: 'Werf 2 - Verrijk je wijk:', label: 'Opstarttraject lokale energiegemeenschap' },
    cost: '€ 20.000,00',
    index: 12
  },
  {
    description: { type: 'Werf 3 - Iedere buurt deelt:', label: 'Jaar 1 afname garantie per jaar per toegangspunt voor koolstofvrije deelsystemen (1 toegangspunt leidt tot 2 deelwagens)' },
    cost: '€ 12.000,00',
    index: 13
  },
  {
    description: { type: 'Werf 3 - Iedere buurt deelt:', label: 'Jaar 2 afname garantie per jaar per toegangspunt voor koolstofvrije deelsystemen (1 toegangspunt leidt tot 2 deelwagens)' },
    cost: '€ 8.400,00',
    index: 14
  },
  {
    description: { type: 'Werf 3 - Iedere buurt deelt:', label: 'Jaar 3 afname garantie per jaar per toegangspunt voor koolstofvrije deelsystemen (1 toegangspunt leidt tot 2 deelwagens)' },
    cost: '€ 4.800,00',
    index: 15
  },
  {
    description: { type: 'Werf 3 - Iedere buurt deelt:', label: 'Promotiecampagne per 2 nieuwe toegangspunten' },
    cost: '€ 7.500,00',
    index: 16
  },
  {
    description: { type: 'Werf 4 - Water het nieuwe goud:', label: 'Investeringssteun per 1 m² ontharding publiek domein' },
    cost: '€ 50,00',
    index: 17
  },
  {
    description: { type: 'Werf 4 - Water het nieuwe goud:', label: 'investeringssteun per 1 m² ontharding privaat domein' },
    cost: '€ 35,00',
    index: 18
  },
  {
    description: { type: 'Werf 4 - Water het nieuwe goud:', label: 'investeringssteun per 1 m³ hemelwaterput + infiltratievoorziening in de bebouwde omgeving' },
    cost: '€ 500,00',
    index: 19
  },
  {
    description: { type: 'Werf 4 - Water het nieuwe goud:', label: 'investeringssteun per 1 m³ hemelwaterbuffer op openbaar toegankelijk domein' },
    cost: '€ 1.000,00',
    index: 20
  },

];

export default class CustomSubsidyFormFieldsClimateSubsidyCostsTableEditComponent extends Component {
  @tracked entries = rows;
}
