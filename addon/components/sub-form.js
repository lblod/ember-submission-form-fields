import Component from '@glimmer/component';
import { getTopLevelSections } from '../utils/model-factory';
import isLast from '@lblod/ember-submission-form-fields/-private/helpers/is-last';
import OrderButtonGroup from '@lblod/ember-submission-form-fields/components/listing/order-button-group';

export default class SubFormComponent extends Component {
  sections = []; // NOTE don't think this needs to be an ember array as it will never change
  isLast = isLast;
  OrderButtonGroup = OrderButtonGroup;

  constructor() {
    super(...arguments);
    this.sections = getTopLevelSections({
      store: this.args.formStore,
      graphs: this.args.graphs,
      form: this.args.subForm.uri,
    });
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
}
