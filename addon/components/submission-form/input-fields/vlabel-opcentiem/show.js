import InputFieldComponent from '../input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { triplesForPath } from '../../../../utils/import-triples-for-form';
import rdflib from 'browser-rdflib';

const lblodBesluit = `http://lblod.data.gift/vocabularies/besluit`;

const hasAdditionalTaxRate = new rdflib.NamedNode(`${lblodBesluit}/hasAdditionalTaxRate`);
const taxRate = new rdflib.NamedNode(`${lblodBesluit}/taxRate`);

export default class FormInputFieldsVlabelOpcentiemShowComponent extends InputFieldComponent  {
  inputId = 'checkbox-' + guidFor(this);

  @tracked taxRateSubject = null
  @tracked fields = []
  @tracked differentiatie = false

  get isTaxRatesEmpty() {
    return this.fields.length == 0;
  }

  get showTable() {
    return !this.differentiatie || this.errors.length > 0;
  }

  get showDifferentiatie() {
    return this.isTaxRatesEmpty || this.errors.length > 0;
  }

  get hasTaxRate() {
    if (!this.taxRateSubject)
      return false;
    else
      // TODO: the semantics from any in forking-store and rdflibstore are different,
      // that's why we use match. (to easy potential migration)_
      return this.storeOptions.store.match(this.sourceNode,
                                           taxRate,
                                           this.taxRateSubject,
                                           this.storeOptions.sourceGraph).length > 0;
  }

  @action
  loadData() {
    super.loadData();
    this.loadProvidedValue();
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const triples =  matches.triples;

    if (triples.length) {
      this.taxRateSubject = triples[0].object; // assuming only one per form

      const prices = matches.values;
      for (let price of prices) {
        this.fields.pushObject({ value: price.value });
      }
    }

    const statements = this.storeOptions.store.match(this.storeOptions.sourceNode,
                                                     hasAdditionalTaxRate,
                                                     undefined,
                                                     this.storeOptions.sourceGraph);
    if (statements.length > 0) {
      this.differentiatie = statements[0].object.value == "1"; // There is a bug in conversion from rdflib
    }
  }

}
