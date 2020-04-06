import rdflib from 'browser-rdflib';

const { namedNode } = rdflib;

export default function validateExtraTaxRateOrAmount(value, options) {
  const { store, sourceNode, sourceGraph } = options;
  const lblodBesluit = `http://lblod.data.gift/vocabularies/besluit`;
  const hasAdditionalTaxRate = namedNode(`${lblodBesluit}/hasAdditionalTaxRate`);
  const schemaPrice = namedNode(`http://schema.org/amount`);
  const taxRate = namedNode(`${lblodBesluit}/taxRate`);
  const extraTaxRateTriples = store.match(sourceNode, hasAdditionalTaxRate, undefined, sourceGraph);

  if(!extraTaxRateTriples.length) return true;

  const extraTaxRateValue = extraTaxRateTriples[0].object.value == "true"; //data type validation should occur somehere else

  const taxRateTriples = store.match(sourceNode, taxRate, undefined, sourceGraph);
  if(!taxRateTriples.length) return true;


  const taxRateSubject = taxRateTriples[0].object; //We assume only one TaxRate instance has been inserted. Another validator should take care of this.
  const amountTriples = store.match(taxRateSubject, schemaPrice, undefined, sourceGraph);

  if(!amountTriples.length) return true; //If no amount has been inserted, we consider this to be ok here

  if(extraTaxRateValue && amountTriples.length) return false;

  return true;
}
