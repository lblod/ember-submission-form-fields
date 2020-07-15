import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';

import SimpleInputFieldComponent from '../simple-value-input-field';

// TODO: the components this wraps does not have a "disabled" styling
export default class FormInputFieldsSwitchShowComponent extends SimpleInputFieldComponent {
  inputId = 'switch-' + guidFor(this);

  @tracked checked = false;
}
