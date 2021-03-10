import SimpleInputFieldComponent from '../simple-value-input-field';

import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';

import clipboardy from 'clipboardy';

export default class FormInputFieldsCaseNumberShowComponent extends SimpleInputFieldComponent {
  id = 'case-number-' + guidFor(this);

  @action
  copy() {
    clipboardy.write(this.value);
  }
}
