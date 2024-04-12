import Component from '@glimmer/component';

export default class AlertComponent extends Component {
  get options() {
    // Not changin this to findFieldOption() See input-field.js
    return this.args.field.options;
  }
}
