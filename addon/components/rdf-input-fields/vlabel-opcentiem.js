import { A } from '@ember/array';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { RDF, triplesForPath } from '@lblod/submission-form-helpers';
import { NamedNode } from 'rdflib';
import { v4 as uuidv4 } from 'uuid';

const uriTemplate = 'http://data.lblod.info/tax-rates';
const lblodBesluit = `http://lblod.data.gift/vocabularies/besluit`;

const TaxRateType = new NamedNode(`${lblodBesluit}/TaxRate`);
const hasAdditionalTaxRate = new NamedNode(
  `${lblodBesluit}/hasAdditionalTaxRate`
);
const schemaPrice = new NamedNode(`http://schema.org/price`);
const taxRate = new NamedNode(`${lblodBesluit}/taxRate`);

class TaxEntry {
  @tracked oldValue;
  @tracked value;
  @tracked errors;

  constructor({ value, errors }) {
    this.oldValue = value;
    this.value = value;
    this.errors = errors;
  }

  get isValid() {
    return this.errors.length == 0;
  }

  get isInvalid() {
    return !this.isValid;
  }
}

export default class RdfInputFieldsVlabelOpcentiemComponent extends InputFieldComponent {
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
    return this.differentiatie || !this.isTaxRatesEmpty;
  }

  get showDifferentiatie() {
    return this.isTaxRatesEmpty;
  }

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

  get hasPrices() {
    return (
      this.storeOptions.store.match(
        this.taxRateSubject,
        schemaPrice,
        undefined,
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
        this.fields.pushObject(
          new TaxEntry({
            value: price.value,
            errors: [],
          })
        );
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

  updateAdditionalTaxRateTriple(newValue) {
    const statements = this.storeOptions.store.match(
      this.storeOptions.sourceNode,
      hasAdditionalTaxRate,
      undefined,
      this.storeOptions.sourceGraph
    );
    this.storeOptions.store.removeStatements(statements);

    this.storeOptions.store.addAll([
      {
        subject: this.storeOptions.sourceNode,
        predicate: hasAdditionalTaxRate,
        object: newValue,
        graph: this.storeOptions.sourceGraph,
      },
    ]);
  }

  createTaxRate() {
    this.taxRateSubject = new NamedNode(`${uriTemplate}/${uuidv4()}`);
    const triples = [
      {
        subject: this.taxRateSubject,
        predicate: RDF('type'),
        object: TaxRateType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.storeOptions.sourceNode,
        predicate: taxRate,
        object: this.taxRateSubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.addAll(triples);
  }

  removeTaxRate() {
    const taxRateTriples = this.storeOptions.store.match(
      this.taxRateSubject,
      undefined,
      undefined,
      this.storeOptions.sourceGraph
    );
    const triples = [
      ...taxRateTriples,
      {
        subject: this.storeOptions.sourceNode,
        predicate: taxRate,
        object: this.taxRateSubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.removeStatements(triples);
  }

  updatePriceTriple(oldValue, newValue) {
    this.storeOptions.store.removeStatements([
      {
        subject: this.taxRateSubject,
        predicate: schemaPrice,
        object: oldValue,
        graph: this.storeOptions.sourceGraph,
      },
    ]);

    if (newValue)
      this.storeOptions.store.addAll([
        {
          subject: this.taxRateSubject,
          predicate: schemaPrice,
          object: newValue,
          graph: this.storeOptions.sourceGraph,
        },
      ]);
  }

  @action
  addPrice() {
    this.fields.pushObject(new TaxEntry({ value: '', errors: [] }));
  }

  @action
  updatePrice(field) {
    if (!this.hasTaxRate) this.createTaxRate();

    field.value = field.value.trim();
    this.updatePriceTriple(field.oldValue, field.value);
    field.oldValue = field.value;

    this.hasBeenFocused = true;
    super.updateValidations(); // update validation of the general field
  }

  @action
  removePrice(field) {
    if (this.taxRateSubject) {
      this.updatePriceTriple(field.value, null);

      if (!this.hasPrices) this.removeTaxRate();
    }
    this.fields.removeObject(field);

    this.hasBeenFocused = true;
    super.updateValidations(); // update validation of the general field
  }

  @action
  toggleDifferentiatie(isChecked) {
    this.differentiatie = isChecked;

    if (this.differentiatie && this.hasTaxRate) this.removeTaxRate();

    this.updateAdditionalTaxRateTriple(this.differentiatie);

    this.hasBeenFocused = true;
    super.updateValidations(); // update validation of the general field
  }
}
