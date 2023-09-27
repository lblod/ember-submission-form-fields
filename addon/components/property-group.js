import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { getChildrenForPropertyGroup } from '../utils/model-factory';
import { guidFor } from '@ember/object/internals';
import {
  validationResultsForField,
  FORM,
  SHACL,
} from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';
import isLast from '@lblod/ember-submission-form-fields/-private/helpers/is-last';

export default class SubmissionFormPropertyGroupComponent extends Component {
  @tracked children = A();
  @tracked validations = [];
  isLast = isLast;

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
    return this.args.group.options.level || this.args.level || 1;
  }

  get titleLevel() {
    return `${this.level}`;
  }

  get titleSkin() {
    return this.args.group.options.skin || `${this.level + 1}`;
  }

  get nextLevel() {
    return this.level + 1;
  }

  get showTitleBlock() {
    return Boolean(this.args.group.name) || Boolean(this.args.group.help);
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

  get collapsible() {
    let propertyGroup = this.args.formStore.any(
      undefined,
      FORM('each'),
      this.args.form,
      this.args.graphs.formGraph
    );

    let canCollapse = this.args.formStore.any(
      propertyGroup,
      FORM('canCollapse'),
      undefined,
      this.args.graphs.formGraph
    );

    if (!canCollapse) {
      return false;
    }

    if (canCollapse.value === '1') {
      return true;
    } else {
      return false;
    }
  }

  get name() {
    let name = this.args.formStore.any(
      this.args.sourceNode,
      SHACL('name'),
      undefined,
      this.args.graphs.sourceGraph
    );

    return name;
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

    // If the component is being destroyed we don't need to update our children since those are being destroyed as well
    // This prevents an observer loop where children remove triples which causes all observers to get notified.
    if (this.isDestroying) {
      return;
    }

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
