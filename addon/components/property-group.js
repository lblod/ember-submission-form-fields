import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { getChildrenForPropertyGroup } from '../utils/model-factory';
import { guidFor } from '@ember/object/internals';
import { validationResultsForField } from '@lblod/submission-form-helpers';

export default class SubmissionFormPropertyGroupComponent extends Component {

  @tracked children = A();
  @tracked validations = [];

  observerLabel = `property-group-${guidFor(this)}`;

  constructor() {
    super(...arguments);
    this.update(
      this.args.group,
      {
        form: this.args.form,
        store: this.args.formStore,
        graphs: this.args.graphs,
        node: this.args.sourceNode,
      },
    );
  }

  willDestroy() {
    this.deregister();
  }

  get level() {
    return this.args.level || 1;
  }

  get errors() {
    return this.validations.filter(r => !r.valid);
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
      this.update(
        this.args.group,
        {
          form: this.args.form,
          store: this.args.formStore,
          graphs: this.args.graphs,
          node: this.args.sourceNode,
        },
      );
    }, this.observerLabel);
  }

  deregister() {
    this.args.formStore.deregisterObserver(this.observerLabel);
  }

  update(group, {form, store, graphs, node}) {
    this.deregister(); // NOTE: to prevent calling ourself up again with changes

    // 1) retrieve the to be rendered children (!!could be nested property-groups or fields) for this property-group
    const children = getChildrenForPropertyGroup(group, {form, store, graphs, node});

    // 2) calculate to be removed
    const deletes = this.children.filter(rendered => !children.find(child => child.uri.equals(rendered.uri)));

    // 4) remove the "unwanted" children
    if (deletes.length) {
      this.children.removeObjects(deletes);
    }

    // 5) insert new fields or move old fields accordingly
    children.forEach((field, i) => {
      const existingField = this.children.find(eField => eField.uri.equals(field.uri));
      if (existingField) {
        this.children.replace(i, 1, [existingField]);
      } else {
        this.children.replace(i, 1, [field]);
      }
    });

    // 6) update the validation
    this.validations = validationResultsForField(group.uri, this.storeOptions);

    this.register(); // NOTE: to make sure we get notified on user input
  }
}
