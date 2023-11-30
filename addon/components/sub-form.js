import Component from '@glimmer/component';
import { getTopLevelPropertyGroups } from '../utils/model-factory';
import isLast from '@lblod/ember-submission-form-fields/-private/helpers/is-last';
import OrderButtonGroup from '@lblod/ember-submission-form-fields/components/listing/order-button-group';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { FORM, triplesForPath } from '@lblod/submission-form-helpers';

export default class SubFormComponent extends Component {
  propertyGroups = []; // NOTE don't think this needs to be an ember array as it will never change
  isLast = isLast;
  OrderButtonGroup = OrderButtonGroup;

  @tracked
  collapsed = false;
  @tracked
  collapsedLabel = '';

  constructor() {
    super(...arguments);
    this.propertyGroups = getTopLevelPropertyGroups({
      store: this.args.formStore,
      graphs: this.args.graphs,
      form: this.args.subForm.uri,
    });
    this.collapsedLabelPath = this.args.formStore.any(
      this.args.subForm.uri,
      FORM('collapsedLabelPath'),
      undefined,
      this.args.graphs.formGraph
    );
    this.computeCollapsedLabel();
  }

  get level() {
    return this.args.level || 2;
  }

  get nextLevel() {
    // We only want to increase the level of the nested titles if we display a title ourselves
    return this.args.subForm.itemLabel ? this.level + 1 : this.level;
  }

  get titleLevel() {
    return `${this.level}`;
  }

  get titleSkin() {
    return `${this.level + 1}`;
  }

  computeCollapsedLabel() {
    if (!this.collapsedLabelPath) {
      this.collapsedLabel = '';
      return;
    }
    const label = triplesForPath({
      store: this.args.formStore,
      sourceGraph: this.args.graphs.sourceGraph,
      sourceNode: this.args.sourceNode,
      path: this.collapsedLabelPath,
    });
    if (label.values.length) {
      this.collapsedLabel = label.values[0].value;
    } else {
      this.collapsedLabel = '';
    }
  }

  @action
  toggleCollapsed() {
    if (!this.args.subForm.isCollapsible) return;
    this.collapsed = !this.collapsed;
    this.computeCollapsedLabel();
  }
}
