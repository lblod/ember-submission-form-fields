import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { getChildrenForPropertyGroup } from '../utils/model-factory';
import { guidFor } from '@ember/object/internals';

export default class SubmissionFormPropertyGroupComponent extends Component {
  @tracked fields = A();

  observerLabel = `property-group-${guidFor(this)}`;

  constructor() {
    super(...arguments);
    this.args.formStore.registerObserver(() => {
      this.update(
        this.args.field,
        {
          form: this.args.form,
          store: this.args.formStore,
          graphs: this.args.graphs,
          node: this.args.sourceNode,
        }
      );
    }, this.observerLabel);

    this.update(
      this.args.field,
      {
        form: this.args.form,
        store: this.args.formStore,
        graphs: this.args.graphs,
        node: this.args.sourceNode,
      }
    );
  }

  willDestroy() {
    this.args.formStore.deregisterObserver(this.observerLabel);
  }

  update(group, {form, store, graphs, node}) {
    const children = getChildrenForPropertyGroup(group, {form, store, graphs, node});
    // this.updateFields(children, store, graphs, sourceNode);

    // NOTE: this is made with the assumption that the following logic will NOT try to tamper with property-groups
    const removed = this.removeObsoleteFields(children);
    this.updateFields(children);
    // TODO: make this optional
    this.removeObsoleteValues(removed, {store, graphs, node})
  }

  removeObsoleteFields(children) {
    let toRemove = this.fields.filter(field => !children.find(uField => uField.uri.equals(field.uri)));
    this.fields.removeObjects(toRemove);
    return toRemove;
  }

  updateFields(children) {
    children.forEach((field, i) => {
      const existingField = this.fields.find(eField => eField.uri.equals(field.uri));
      if (existingField) {
        this.fields.replace(i, 1, [existingField]);
      } else {
        this.fields.replace(i, 1, [field]);
      }
    });
  }

  removeObsoleteValues(removed, {store, graphs, node}) {
    removed.forEach(field => {
      const values = store.match(node, field.rdflibPath, undefined, graphs.sourceGraph);
      store.removeStatements(values);
    });
  }
}
