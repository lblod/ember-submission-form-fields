import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { getChildrenForSection } from '../utils/model-factory';
import { guidFor } from '@ember/object/internals';
import { validationResultsForField } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';
import isLast from '@lblod/ember-submission-form-fields/-private/helpers/is-last';
import {
  PROPERTY_GROUP_DISPLAY_TYPE,
  SECTION_DISPLAY_TYPE,
} from '../models/section';
import { LISTING_TYPE } from '../models/listing';
import { helper } from '@ember/component/helper';

const childIsSection = helper(function ([child]) {
  return (
    child &&
    [SECTION_DISPLAY_TYPE, PROPERTY_GROUP_DISPLAY_TYPE].includes(
      child.displayType
    )
  );
});

const childIsListing = helper(function ([child]) {
  return child && child.displayType === LISTING_TYPE;
});

export default class SubmissionFormSectionComponent extends Component {
  @tracked children = A();
  @tracked validations = [];
  isLast = isLast;

  observerLabel = `section-${guidFor(this)}`;

  childIsSection = childIsSection;
  childIsListing = childIsListing;

  constructor() {
    super(...arguments);

    next(this, () => {
      this.update(this.args.section, {
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
    return this.args.section.options.level || this.args.level || 1;
  }

  get titleLevel() {
    return `${this.level}`;
  }

  get titleSkin() {
    return this.args.section.options.skin || `${this.level + 1}`;
  }

  get nextLevel() {
    return this.level + 1;
  }

  get showTitleBlock() {
    return Boolean(this.args.section.name) || Boolean(this.args.section.help);
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
      path: this.args.section.rdflibPath,
    };
  }

  register() {
    this.args.formStore.registerObserver(() => {
      this.update(this.args.section, {
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

  update(section, { form, store, graphs, node }) {
    this.deregister(); // NOTE: to prevent calling ourself up again with changes

    // If the component is being destroyed we don't need to update our children since those are being destroyed as well
    // This prevents an observer loop where children remove triples which causes all observers to get notified.
    if (this.isDestroying) {
      return;
    }

    // 1) retrieve the to be rendered children (!!could be nested sections or fields) for this section
    const children = getChildrenForSection(section, {
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
    this.validations = validationResultsForField(
      section.uri,
      this.storeOptions
    );

    this.register(); // NOTE: to make sure we get notified on user input
  }
}
