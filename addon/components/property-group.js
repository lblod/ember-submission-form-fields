import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { fieldsForForm } from '@lblod/submission-form-helpers';
import { createPropertyTreeFromFields, getChildrenForPropertyGroup } from '../utils/model-factory';
import { guidFor } from '@ember/object/internals';

export default class SubmissionFormPropertyGroupComponent extends Component {
  @tracked fields = A();

  observerLabel = `property-group-${guidFor(this)}`;

  constructor() {
    super(...arguments);
    this.args.formStore.registerObserver(() => {
      this.update(
        this.args.field,
        this.args.formStore,
        this.args.graphs,
        this.args.sourceNode,
      );
    }, this.observerLabel);

    this.update(
      this.args.field,
      this.args.formStore,
      this.args.graphs,
      this.args.sourceNode,
    );
  }

  willDestroy() {
    this.args.formStore.deregisterObserver(this.observerLabel);
  }

  update(group, store, graphs, sourceNode) {
    const updated = getChildrenForPropertyGroup(group, {form: this.args.form, store, graphs, node: sourceNode});
    this.updateFields(updated, store, graphs, sourceNode);
  }

  updateFields(children, store, graphs, sourceNode) {
    // NOTE: this is made with the assumtiomn that the following logic will NOT try to tamper with property-groups
    // Remove obsolete fields
    let toRemove = this.fields.filter(field => !children.find(uField => uField.uri.equals(field.uri)));
    this.fields.removeObjects(toRemove);

    // Add the new fields, keep the existing ones
    children.forEach((field, i) => {
      const existingField = this.fields.find(eField => eField.uri.equals(field.uri));
      if (existingField) {
        this.fields.replace(i, 1, [existingField]);
      } else {
        this.fields.replace(i, 1, [field]);
      }
    });

    // Delete source-data of removed field.
    // TODO: make this optional
    toRemove.forEach(field => {
      const values = store.match(sourceNode, field.rdflibPath, undefined, graphs.sourceGraph);
      store.removeStatements(values);
    });
  }
}
