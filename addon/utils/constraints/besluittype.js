import { FORM, SKOS } from '../namespaces';

/**
 * Custom validator to check if there is a exaclty one triple matching the pattern:
 * ?s <http://www.w3.org/2004/02/skos/core#inScheme> <https://data.vlaanderen.be/id/conceptscheme/BesluitDocumentType>.
 */

export default function besluitTypeValidation(values, options) {

  const { constraintUri, store, metaGraph } = options;
  const conceptSchemeUri = store.any( constraintUri, FORM("conceptScheme"), undefined );
  const matchingValues =
        values
        .filter( (value) => {
          const matchCount =
                store
                .match( value, SKOS("inScheme"), conceptSchemeUri, metaGraph )
                .length;
          return matchCount >= 1;
        });

  return matchingValues.length == 1;
}
