import SimpleInputFieldComponent from '../simple-value-input-field';

import { guidFor } from '@ember/object/internals';

export default class FormInputFieldsCaseNumberShowComponent extends SimpleInputFieldComponent {
  id = 'case-number-' + guidFor(this);
}
