import { tracked } from '@glimmer/tracking';
import InputFieldComponent from './input-field';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { updateSimpleFormValue } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';
import { isLiteral, Literal } from 'rdflib';

export default class SimpleValueInputFieldComponent extends InputFieldComponent {
  @tracked value = null;
  @tracked nodeValue = null;

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const literals = matches.values.filter((value) => isLiteral(value));

    if (literals.length) {
      let literal;

      if (this.args.field.language) {
        literal = findLiteralByLanguage(literals, this.args.field.language);
      } else {
        // First look for the entry with no lang string.
        // This allows us to still have multiple fields where both form:language is and is not specified
        literal = literals.find((m) => !isLangString(m.datatype));

        // For reverse compatibility: we fall back first to first matched literal value
        // i.e. all langStrings are literals, so technically not wrong to display literal
        //   even if it is a langString.
        // Note: it uncovers wonky side effects,
        //  in case we have two different literals for the same predicate.
        //  Updating one of them might result in strange rendering behaviour.
        // This was the case in the previous version too, and might need re-thinking. (TODO)
        // If not clear, try it in the dummy-app
        if (!literal) {
          literal = literals[0];
        }
      }

      if (literal) {
        this.nodeValue = literal;
        this.value = literal.value;
      }
    }

    if (!this.nodeValue && this.args.field.language) {
      this.nodeValue = new Literal('', this.args.field.language);
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

    if (value && isLiteral(value)) {
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
 * @param {Object} Rdflib datatype
 * @returns boolean
 */
function isLangString(datatype) {
  if (
    datatype &&
    datatype.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString'
  ) {
    return true;
  } else return false;
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
