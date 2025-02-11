import Component from '@glimmer/component';
import HelpText from '@lblod/ember-submission-form-fields/components/private/help-text';

export default class AlertComponent extends Component {
  HelpText = HelpText;
  get options() {
    return this.args.field.options;
  }
}
