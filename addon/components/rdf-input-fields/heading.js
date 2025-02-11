import Component from '@glimmer/component';
import HelpText from '@lblod/ember-submission-form-fields/components/private/help-text';

export default class RdfHeadingComponent extends Component {
  HelpText = HelpText;

  get skin() {
    return this.args.field.options.skin;
  }

  get level() {
    return this.args.field.options.level;
  }
}
