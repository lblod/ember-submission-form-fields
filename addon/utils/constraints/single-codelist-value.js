import { FORM, SKOS } from '../namespaces';

/**
 * Checks if there is only a single value coming from the supplied codelist
 */

export default function constraintsSingleCodelistValue(values, options) {
  const { constraintUri, store, metaGraph } = options;
  const conceptSchemeUri = store.any( constraintUri, FORM("conceptScheme"), undefined );
  const concept = store.any( constraintUri, FORM("customValue"), undefined );
  const matchingValues =
        values
        .filter( (value) => {
          const matchCount =
                store
                .match( value, SKOS("inScheme"), conceptSchemeUri, metaGraph )
                .length;
          return matchCount >= 1;
        });

  return matchingValues.length == 1 && matchingValues[0].value == concept.value;
}
