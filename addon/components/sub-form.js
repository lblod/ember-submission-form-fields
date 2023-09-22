import Component from '@glimmer/component';
import { getTopLevelPropertyGroups } from '../utils/model-factory';
import isLast from '@lblod/ember-submission-form-fields/-private/helpers/is-last';
import OrderButtonGroup from '@lblod/ember-submission-form-fields/components/listing/order-button-group';
import { FORM, SHACL } from '@lblod/submission-form-helpers';

export default class SubFormComponent extends Component {
  propertyGroups = []; // NOTE don't think this needs to be an ember array as it will never change
  isLast = isLast;
  OrderButtonGroup = OrderButtonGroup;

  constructor() {
    super(...arguments);
    this.propertyGroups = getTopLevelPropertyGroups({
      store: this.args.formStore,
      graphs: this.args.graphs,
      form: this.args.subForm.uri,
      node: this.args.sourceNode,
    });
  }

  get name() {
    let name = this.args.formStore
    .any(this.args.sourceNode, 
        SHACL('name'), 
        undefined, 
        this.args.graphs.sourceGraph);

    return name;
  }

  get collapsible() {
    let propertyGroup = this.args.formStore
    .any(undefined, 
        FORM('each'), 
        this.args.subForm.uri, 
        this.args.graphs.formGraph);

    let canCollapse = this.args.formStore
    .any(propertyGroup,
        FORM('canCollapse'),
        undefined,
        this.args.graphs.formGraph);

    if(!canCollapse){
      return false;
    }

    if(canCollapse.value === '1'){
      return true;
      
    }else{
      return false;
    }
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
