import Component from '@glimmer/component';
import { getTopLevelPropertyGroups } from '../utils/model-factory';
import isLast from '@lblod/ember-submission-form-fields/-private/helpers/is-last';

export default class SubFormComponent extends Component {
  propertyGroups = []; // NOTE don't think this needs to be an ember array as it will never change
  isLast = isLast;

  constructor() {
    super(...arguments);
    this.propertyGroups = getTopLevelPropertyGroups({
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
