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

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);

    if (matches.values.length > 0) {
      let literal = findLiteralByLanguage(
        matches.values,
        this.args.field.language
      );

      if (literal) {
        this.nodeValue = literal;
        this.value = literal.value;
      }
    }

    if (!this.nodeValue && this.args.field.language) {
      this.nodeValue = new rdflib.Literal('', this.args.field.language);
    }

    if (this.defaultValue && this.value == null) {
      this.value = this.defaultValue;
      next(this, () => {
        this.updateValue();
      });
    }
  }

  updateValue(value) {
    let literalOrValue;

    if (rdflib.isLiteral(value)) {
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
