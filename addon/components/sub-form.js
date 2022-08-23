import Component from '@glimmer/component';
import { getTopLevelPropertyGroups } from '../utils/model-factory';

export default class SubFormComponent extends Component {
  propertyGroups = []; // NOTE don't think this needs to be an ember array as it will never change

  constructor() {
    super(...arguments);
    this.propertyGroups = getTopLevelPropertyGroups({
      store: this.args.formStore,
      graphs: this.args.graphs,
      form: this.args.subForm.uri,
    });
  }
  get canRemove(){
    if(this.args.show){
      return false;
    }
    else{
      return this.args.canRemove;
    }
  }
}
