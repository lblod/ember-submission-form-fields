import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { SKOS } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';
import { namedNode, Namespace } from 'rdflib';

export default class CustomSubmissionFormFieldsBestuursorgaanSelectorShowComponent extends InputFieldComponent {
  inputId = 'select-' + guidFor(this);

  @tracked selected = null;
  @tracked options = [];
  noop = () => {};

  constructor() {
    super(...arguments);
    this.loadOptions();
    this.loadProvidedValue();

    next(this, () => {
      this.loadClassificationsInStore();
    });
  }

  loadOptions() {
    const metaGraph = this.args.graphs.metaGraph;
    const fieldOptions = this.args.field.options;
    const conceptScheme = new namedNode(fieldOptions.conceptScheme);

    this.options = this.args.formStore
      .match(undefined, SKOS('inScheme'), conceptScheme, metaGraph)
      .map((t) => {
        const label = this.args.formStore.any(
          t.subject,
          SKOS('prefLabel'),
          undefined,
          metaGraph
        );
        return { subject: t.subject, label: label && label.value };
      });
  }

  loadProvidedValue() {
    if (this.isValid) {
      // Assumes valid input
      // This means even though we can have multiple values for one path (e.g. rdf:type)
      // this selector will only accept one value, and we take the first value from the matches.
      // The validation makes sure the matching value is the sole one.
      const matches = triplesForPath(this.storeOptions, true).values;
      this.selected = this.options.find((opt) =>
        matches.find((m) => m.equals(opt.subject))
      );
    }
  }

  loadClassificationsInStore() {
    const metaGraph = this.args.graphs.metaGraph;
    const [bestuursorgaan, orgaanClassification] =
      this.getPathToOrgaanClassification(this.selected.subject, metaGraph);
    const [bestuurseenheid, eenheidClassification] =
      this.getPathToEenheidClassification(bestuursorgaan.object, metaGraph);

    const bestuursorgaanInSourceGraph = {
      subject: bestuursorgaan.subject,
      predicate: bestuursorgaan.predicate,
      object: bestuursorgaan.object,
      graph: this.storeOptions.sourceGraph,
    };
    const orgaanClassificationInSourceGraph = {
      subject: orgaanClassification.subject,
      predicate: orgaanClassification.predicate,
      object: orgaanClassification.object,
      graph: this.storeOptions.sourceGraph,
    };
    const bestuurseenheidInSourceGraph = {
      subject: bestuurseenheid.subject,
      predicate: bestuurseenheid.predicate,
      object: bestuurseenheid.object,
      graph: this.storeOptions.sourceGraph,
    };
    const eenheidClassificationInSourceGraph = {
      subject: eenheidClassification.subject,
      predicate: eenheidClassification.predicate,
      object: eenheidClassification.object,
      graph: this.storeOptions.sourceGraph,
    };

    this.storeOptions.store.addAll([
      bestuursorgaanInSourceGraph,
      orgaanClassificationInSourceGraph,
      bestuurseenheidInSourceGraph,
      eenheidClassificationInSourceGraph,
    ]);
  }

  getPathToOrgaanClassification(bestuursorgaanInTimeUri, graph) {
    const MANDAAT = new Namespace('http://data.vlaanderen.be/ns/mandaat#');
    const BESLUIT = new Namespace('http://data.vlaanderen.be/ns/besluit#');

    const bestuursorgaan = this.args.formStore.match(
      bestuursorgaanInTimeUri,
      MANDAAT('isTijdspecialisatieVan'),
      undefined,
      graph
    )[0];

    let orgaanClassification = undefined;
    if (bestuursorgaan) {
      orgaanClassification = this.args.formStore.match(
        bestuursorgaan.object,
        BESLUIT('classificatie'),
        undefined,
        graph
      )[0];
    }

    return [bestuursorgaan, orgaanClassification];
  }

  getPathToEenheidClassification(bestuursorgaanUri, graph) {
    const BESLUIT = new Namespace('http://data.vlaanderen.be/ns/besluit#');

    const bestuurseenheid = this.args.formStore.match(
      bestuursorgaanUri,
      BESLUIT('bestuurt'),
      undefined,
      graph
    )[0];

    let eenheidClassification = undefined;
    if (bestuurseenheid) {
      eenheidClassification = this.args.formStore.match(
        bestuurseenheid.object,
        BESLUIT('classificatie'),
        undefined,
        undefined
      )[0];
    }

    return [bestuurseenheid, eenheidClassification];
  }
}
