import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { getChildrenForPropertyGroup } from '../utils/model-factory';
import { guidFor } from '@ember/object/internals';
import { validationResultsForField } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';

export default class SubmissionFormPropertyGroupComponent extends Component {
  @tracked children = A();
  @tracked validations = [];

  observerLabel = `property-group-${guidFor(this)}`;

  constructor() {
    super(...arguments);

    next(this, () => {
      this.update(this.args.group, {
        form: this.args.form,
        store: this.args.formStore,
        graphs: this.args.graphs,
        node: this.args.sourceNode,
      });
    });
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.deregister();
  }

  get level() {
    return this.args.level || 1;
  }

  get errors() {
    return this.validations.filter((r) => !r.valid);
  }

  get storeOptions() {
    return {
      formGraph: this.args.graphs.formGraph,
      sourceGraph: this.args.graphs.sourceGraph,
      metaGraph: this.args.graphs.metaGraph,
      sourceNode: this.args.sourceNode,
      store: this.args.formStore,
      path: this.args.group.rdflibPath,
    };
  }

  register() {
    this.args.formStore.registerObserver(() => {
      this.update(this.args.group, {
        form: this.args.form,
        store: this.args.formStore,
        graphs: this.args.graphs,
        node: this.args.sourceNode,
      });
    }, this.observerLabel);
  }

  deregister() {
    this.args.formStore.deregisterObserver(this.observerLabel);
  }

  update(group, { form, store, graphs, node }) {
    this.deregister(); // NOTE: to prevent calling ourself up again with changes

    // 1) retrieve the to be rendered children (!!could be nested property-groups or fields) for this property-group
    const children = getChildrenForPropertyGroup(group, {
      form,
      store,
      graphs,
      node,
    });

    // 2) calculate to be removed
    const deletes = this.children.filter(
      (rendered) => !children.find((child) => child.uri.equals(rendered.uri))
    );

    // 4) remove the "unwanted" children
    if (deletes.length) {
      this.children.removeObjects(deletes);
    }

    // 5. create a new list to render, merging already (rendered) children, with new children.
    // We don't want to re-render components, to avoid flickering behaviour and state loss.
    const mergedChildren = A();

    for (const child of children) {
      const existingField = this.children.find((eField) =>
        eField.uri.equals(child.uri)
      );
      if (existingField) {
        mergedChildren.pushObject(existingField);
      } else {
        mergedChildren.pushObject(child);
      }
    }

    this.children = mergedChildren;

    // 6) update the validation
    this.validations = validationResultsForField(group.uri, this.storeOptions);

    this.register(); // NOTE: to make sure we get notified on user input
  }
}
