import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { XSD } from '@lblod/submission-form-helpers';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import HelpText from '@lblod/ember-submission-form-fields/components/private/help-text';
import { literal } from 'rdflib';

export default class RdfInputFieldsDateComponent extends SimpleInputFieldComponent {
  inputId = 'date-' + guidFor(this);
  HelpText = HelpText;

  @action
  updateValue(isoDate) {
    const newDate = isoDate ? literal(isoDate, XSD('date')) : null;
    super.updateValue(newDate);
  }
}
