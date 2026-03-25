import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import {
  triplesForPath,
  updateSimpleFormValue,
} from '@lblod/submission-form-helpers';
import { SKOS } from '@lblod/submission-form-helpers';
import { NamedNode, Namespace } from 'rdflib';
import { byLabel } from '../../../-private/utils/sort';

export default class CustomSubmissionFormFieldsBestuursorgaanSelectorEditComponent extends InputFieldComponent {
  inputId = 'select-' + guidFor(this);

  @tracked selected = null;
  @tracked options = [];

  constructor() {
    super(...arguments);
    this.loadOptions();
    this.loadProvidedValue();
  }

  loadOptions() {
    const metaGraph = this.args.graphs.metaGraph;
    const fieldOptions = this.args.field.options;
    const conceptScheme = new NamedNode(fieldOptions.conceptScheme);

    this.options = this.args.formStore
      .match(undefined, SKOS('inScheme'), conceptScheme, metaGraph)
      .map((t) => {
        const label = this.args.formStore.any(
          t.subject,
          SKOS('prefLabel'),
          undefined,
          metaGraph,
        );
        return { subject: t.subject, label: label && label.value };
      });
    this.options.sort(byLabel);
  }

  loadProvidedValue() {
    if (this.isValid) {
      // Assumes valid input
      // This means even though we can have multiple values for one path (e.g. rdf:type)
      // this selector will only accept one value, and we take the first value from the matches.
      // The validation makes sure the matching value is the sole one.
      const matches = triplesForPath(this.storeOptions, true).values;
      this.selected = this.options.find((opt) =>
        matches.find((m) => m.equals(opt.subject)),
      );
    }
  }

  @action
  updateSelection(option) {
    const metaGraph = this.args.graphs.metaGraph;
    this.selected = option;

    // Cleanup old value(s) in the store
    const matches = triplesForPath(this.storeOptions, true).values;
    const matchingOptions = matches.filter((m) =>
      this.options.find((opt) => m.equals(opt.subject)),
    );
    matchingOptions.forEach((m) =>
      updateSimpleFormValue(this.storeOptions, undefined, m),
    );
    matchingOptions.forEach((m) => {
      const [bestuursorgaanToDelete, orgaanClassificationToDelete] =
        this.getPathToOrgaanClassification(
          m.subject,
          this.storeOptions.sourceGraph,
        );
      const [bestuurseenheidToDelete, eenheidClassificationToDelete] =
        this.getPathToEenheidClassification(
          bestuursorgaanToDelete.object,
          this.storeOptions.sourceGraph,
        );

      this.storeOptions.store.removeStatements([
        bestuursorgaanToDelete,
        orgaanClassificationToDelete,
        bestuurseenheidToDelete,
        eenheidClassificationToDelete,
      ]);
    });

    // Insert new value in the store
    if (option) {
      updateSimpleFormValue(this.storeOptions, option.subject);

      const [bestuursorgaan, orgaanClassification] =
        this.getPathToOrgaanClassification(option.subject, metaGraph);
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

    this.hasBeenFocused = true;
    super.updateValidations();
  }

  getPathToOrgaanClassification(bestuursorgaanInTimeUri, graph) {
    const MANDAAT = new Namespace('http://data.vlaanderen.be/ns/mandaat#');
    const BESLUIT = new Namespace('http://data.vlaanderen.be/ns/besluit#');

    const bestuursorgaan = this.args.formStore.match(
      bestuursorgaanInTimeUri,
      MANDAAT('isTijdspecialisatieVan'),
      undefined,
      graph,
    )[0];

    let orgaanClassification = undefined;
    if (bestuursorgaan) {
      orgaanClassification = this.args.formStore.match(
        bestuursorgaan.object,
        BESLUIT('classificatie'),
        undefined,
        graph,
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
      graph,
    )[0];

    let eenheidClassification = undefined;
    if (bestuurseenheid) {
      eenheidClassification = this.args.formStore.match(
        bestuurseenheid.object,
        BESLUIT('classificatie'),
        undefined,
        undefined,
      )[0];
    }

    return [bestuurseenheid, eenheidClassification];
  }
}
