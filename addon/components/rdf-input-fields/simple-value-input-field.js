import { tracked } from '@glimmer/tracking';
import InputFieldComponent from './input-field';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { updateSimpleFormValue } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';
import rdflib from 'browser-rdflib';

export default class SimpleValueInputFieldComponent extends InputFieldComponent {
  @tracked value = null;
  @tracked nodeValue = null;

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
  }

  get isLangStringField() {
    return Boolean(this.args.field.language);
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);

    if (this.isLangStringField) {
      let literals = matches.values.filter((value) => rdflib.isLiteral(value));
      let literal = findLiteralByLanguage(literals, this.args.field.language);

      if (literal) {
        this.nodeValue = literal;
        this.value = literal.value;
      } else {
        // If no literal exists for the current language, we create a new one
        let initialValue = this.defaultValue ?? '';
        this.nodeValue = new rdflib.Literal(
          initialValue,
          this.args.field.language
        );
        this.value = initialValue;
      }
    } else {
      if (matches.values.length > 0) {
        this.nodeValue = matches.values[0];
        this.value = matches.values[0].value;
      } else if (this.defaultValue && this.value == null) {
        this.value = this.defaultValue;
        next(this, () => {
          this.updateValue();
        });
      }
    }
  }

  updateValue(value) {
    if (this.isLangStringField) {
      let literalOrValue;

      if (value && rdflib.isLiteral(value)) {
        literalOrValue = value;
      } else {
        literalOrValue = this.nodeValue?.copy();
        if (literalOrValue) {
          literalOrValue.value = value;
        } else {
          literalOrValue = value;
        }
      }
      updateSimpleFormValue(this.storeOptions, literalOrValue, this.nodeValue);
    } else {
      updateSimpleFormValue(this.storeOptions, value, this.nodeValue);
    }

    this.hasBeenFocused = true;
    this.loadProvidedValue();
    super.updateValidations();
  }
}

/**
 *
 * @param {{}[]} literals Array of Literal instances
 * @param {string} [language] language tag of the literal. If left empty the literal without a language tag will be returned
 * @returns literal instance
 */
function findLiteralByLanguage(literals = [], language = '') {
  return literals.find((literal) => literal.language === language);
}
