import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import {A} from '@ember/array';
import {fieldsForForm} from "@lblod/submission-form-helpers";
import {createPropertyTreeFromFields} from "../../utils/model-factory";
import {guidFor} from '@ember/object/internals';

export default class SubmissionFormPropertyGroupComponent extends Component {
  @tracked fields = A();

  observerLabel = `property-group-${guidFor(this)}`

  constructor() {
    super(...arguments);
    this.args.formStore.registerObserver(() => {
      this.update(
        this.args.group,
        this.args.formStore,
        this.args.graphs,
        this.args.sourceNode
      );
    }, this.observerLabel);

    this.update(
      this.args.group,
      this.args.formStore,
      this.args.graphs,
      this.args.sourceNode
    );
  }

  willDestroy() {
    this.args.formStore.deregisterObserver(this.observerLabel);
  }

  update(group, store, graphs, sourceNode) {
    let fieldUris = fieldsForForm(this.args.form, {
      store,
      formGraph: graphs.formGraph,
      sourceGraph: graphs.sourceGraph,
      metaGraph: graphs.metaGraph,
      sourceNode
    });

    const updated = createPropertyTreeFromFields(fieldUris, {
      store,
      formGraph: graphs.formGraph,
      sourceGraph: graphs.sourceGraph,
      sourceNode
    }).find(g => g.uri.equals(group.uri));
    this.updateFields(updated, store, graphs, sourceNode);
  }

  updateFields(group, store, graphs, sourceNode) {

    // Remove obsolete fields
    let toRemove = this.fields.filter(field => !group.fields.find(uField => uField.uri.equals(field.uri)));
    this.fields.removeObjects(toRemove);

    // Add the new fields, keep the existing ones
    group.fields.forEach((field, i) => {
      const existingField = this.fields.find(eField => eField.uri.equals(field.uri));
      if (existingField) {
        this.fields.replace(i, 1, [existingField]);
      } else {
        this.fields.replace(i, 1, [field]);
      }
    });

    // Delete source-data of removed field.
    toRemove.forEach(field => {
      const values = store.match(sourceNode, field.rdflibPath, undefined, graphs.sourceGraph);
      store.removeStatements(values);
    })
  }
}
