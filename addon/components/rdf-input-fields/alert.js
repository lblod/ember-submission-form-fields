import Component from '@glimmer/component';

export default class AlertComponent extends Component {
  get options() {
    return this.args.field.options;
  }
}
