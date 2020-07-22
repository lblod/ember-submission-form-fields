import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { getChildrenForPropertyGroup } from '../utils/model-factory';
import { guidFor } from '@ember/object/internals';
import { isPropertyGroup } from '../helpers/is-property-group';

export default class SubmissionFormPropertyGroupComponent extends Component {

  @tracked children = A();

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
        },
        {
          cacheConditionals: this.args.cacheConditionals,
        },
      );
    }, this.observerLabel);

    this.update(
      this.args.field,
      {
        form: this.args.form,
        store: this.args.formStore,
        graphs: this.args.graphs,
        node: this.args.sourceNode,
      },
      {
        cacheConditionals: this.args.cacheConditionals,
      },
    );
  }

  willDestroy() {
    this.args.formStore.deregisterObserver(this.observerLabel);
  }

  update(group, {form, store, graphs, node}, options) {
    const children = getChildrenForPropertyGroup(group, {form, store, graphs, node});

    // NOTE: this is made with the assumption that the following logic will NOT try to tamper with property-groups
    const fields = children.filter((child) => !isPropertyGroup(child.displayType))
    const removed = this.removeObsoleteFields(fields);
    this.updateFields(fields);
    if (!options.cacheConditionals) {
      this.removeObsoleteValues(removed, {store, graphs, node});
    }
  }

  removeObsoleteFields(children) {
    let toRemove = this.children.filter(field => !children.find(uField => uField.uri.equals(field.uri)));
    this.children.removeObjects(toRemove);
    return toRemove;
  }

  updateFields(children) {
    children.forEach((field, i) => {
      const existingField = this.children.find(eField => eField.uri.equals(field.uri));
      if (existingField) {
        this.children.replace(i, 1, [existingField]);
      } else {
        this.children.replace(i, 1, [field]);
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
