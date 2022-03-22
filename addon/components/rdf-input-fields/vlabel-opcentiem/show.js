import { A } from '@ember/array';
import InputFieldComponent from '../input-field';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { triplesForPath } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';

const lblodBesluit = `http://lblod.data.gift/vocabularies/besluit`;

const hasAdditionalTaxRate = new rdflib.NamedNode(
  `${lblodBesluit}/hasAdditionalTaxRate`
);
const taxRate = new rdflib.NamedNode(`${lblodBesluit}/taxRate`);

export default class FormInputFieldsVlabelOpcentiemShowComponent extends InputFieldComponent {
  amountColumnId = 'amount-column-' + guidFor(this);

  @tracked taxRateSubject = null;
  @tracked fields = A();
  @tracked differentiatie = false;

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
  }

  get isTaxRatesEmpty() {
    return this.fields.length === 0;
  }

  get showTable() {
    return !this.differentiatie || !this.isTaxRatesEmpty;
  }

  get showDifferentiatie() {
    return this.isTaxRatesEmpty;
  }

  // TODO: I think this isn't used?
  get hasTaxRate() {
    if (!this.taxRateSubject) return false;
    // TODO: the semantics from any in forking-store and rdflibstore are different,
    // that's why we use match. (to easy potential migration)_
    else
      return (
        this.storeOptions.store.match(
          this.sourceNode,
          taxRate,
          this.taxRateSubject,
          this.storeOptions.sourceGraph
        ).length > 0
      );
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const triples = matches.triples;

    if (triples.length) {
      this.taxRateSubject = triples[0].object; // assuming only one per form

      const prices = matches.values;
      for (let price of prices) {
        this.fields.pushObject({ value: price.value });
      }
    }

    const statements = this.storeOptions.store.match(
      this.storeOptions.sourceNode,
      hasAdditionalTaxRate,
      undefined,
      this.storeOptions.sourceGraph
    );
    if (statements.length > 0) {
      this.differentiatie = statements[0].object.value == '1'; // There is a bug in conversion from rdflib
    }
  }
}
