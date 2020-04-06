import { RDF, FORM, SHACL } from './namespaces';
import { check, checkTriples } from './constraints';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
// const uuidv4 = () => {};
debugger;

const URI_TEMPLATE = 'http://data.lblod.info/form-data/nodes/';

function importTriplesForForm(form, {store, formGraph, sourceGraph, sourceNode, metaGraph}) {
  let datasetTriples = [];
  for (let field of fieldsForForm(form, {store, formGraph, sourceGraph, sourceNode, metaGraph})) {
    let path = store.any(field, SHACL("path"), undefined, formGraph);
    triplesForPath({path, store, formGraph, sourceNode, sourceGraph})
      .triples
      .forEach((item) => datasetTriples.push(item));
  }

  return datasetTriples;
}

function fieldsForForm(form, options) {
  let {store, formGraph, sourceGraph, sourceNode, metaGraph} = options;

  // get field groups
  let fieldGroups = store.match(form, FORM("hasFieldGroup"), undefined, formGraph);
  console.log(`Getting fields for ${fieldGroups.length} field groups`);
  fieldGroups = [].concat(...fieldGroups);
  fieldGroups = fieldGroups.map(({object}) => object);

  // get all fields recursively
  let allFields = [];
  let newFields = [];

  while (fieldGroups.length > 0) {
    // add fields
    newFields = [];
    for (const fieldGroup of fieldGroups)
      newFields.push(...fieldsForFieldGroup(fieldGroup, options));

    allFields.push(...newFields);

    // calculate conditional groups
    let conditionalFieldGroups =
      newFields.map((field) => {
        return store
          .match(field, FORM("hasConditionalFieldGroup"), undefined, formGraph)
          .map(({object}) => object);
      });
    conditionalFieldGroups = [].concat(...conditionalFieldGroups);

    // add matching conditional field groups
    let newFieldGroups =
      conditionalFieldGroups
        .filter((group) => {
          return store
            .match(group, FORM("conditions"), undefined, formGraph)
            .every(({object}) => check(object, {formGraph, sourceNode, sourceGraph, metaGraph, store}).valid);
        })
        .map((group) => {
          return store
            .match(group, FORM("hasFieldGroup"), undefined, formGraph)
            .map(({object}) => object);
        });
    newFieldGroups = [].concat(...newFieldGroups);
    fieldGroups = newFieldGroups;
  }

  console.log(`Found ${allFields.length} fields`);

  return allFields;
}

function fieldsForFieldGroup(fieldGroup, options) {
  const {store, formGraph} = options;

  return store
    .match(fieldGroup, FORM("hasField"), undefined, formGraph)
    .map(({object}) => object);
}

function triplesForPath(options, createMissingNodes = false) {
  const {store, path, formGraph, sourceNode, sourceGraph} = options;
  let solutions = {};
  if (path && path.termType === "Collection") {
    return triplesForComplexPath(options, createMissingNodes);
  } else {
    return triplesForSimplePath(options, createMissingNodes);
  }
}

function triplesForSimplePath(options, createMissingNodes = false) {
  const {store, path, formGraph, sourceNode, sourceGraph} = options;
  let datasetTriples = [];

  if (path) {
    const triples = store.match(sourceNode, path, undefined, sourceGraph);
    if (createMissingNodes && triples.length == 0) {
      triples.push(new rdflib.Statement(
        sourceNode,
        path,
        new rdflib.NamedNode(URI_TEMPLATE + uuidv4()),
        sourceGraph
      ));
    }

    triples.map((item) => {
      datasetTriples.push(item);
    });
  }
  return {triples: datasetTriples, values: datasetTriples.map(({object}) => object)};
}

function triplesForComplexPath(options, createMissingNodes = false) {
  const {store, path, formGraph, sourceNode, sourceGraph} = options;
  let datasetTriples = [];

  // Convert PATH list to comprehensible objects
  const pathElements =
    path
      .elements
      .map((element) => {
        if (element.termType == "NamedNode") {
          return {path: element};
        } else {
          const elementInfo = store.any(element, SHACL("inversePath"), undefined, formGraph);
          return {inversePath: elementInfo};
        }
      });

  // Walk over each part of the path list
  let startingPoints = [sourceNode];
  let nextPathElements = pathElements;
  while (startingPoints && nextPathElements.length) {
    // walk one segment of the path list
    let [currentPathElement, ...restPathElements] = nextPathElements;
    let nextStartingPoints = [];

    for (let startingPoint of startingPoints) {
      if (currentPathElement.inversePath) {

        // inverse path, walk in other direction
        const triples = store.match(undefined, currentPathElement.inversePath, startingPoint, sourceGraph);

        if (createMissingNodes && triples.length == 0) {
          triples.push(new rdflib.Statement(
            new rdflib.NamedNode(URI_TEMPLATE + uuidv4()),
            currentPathElement.inversePath,
            startingPoint,
            sourceGraph
          ));
        }

        triples.map((triple) => {
          datasetTriples.push(triple);
          nextStartingPoints.push(triple.subject);
        });

      } else {

        // regular path, walk in normal direction
        const triples = store.match(startingPoint, currentPathElement.path, undefined, sourceGraph);

        if (createMissingNodes && triples.length == 0) {
          triples.push(new rdflib.Statement(
            startingPoint,
            currentPathElement.path,
            new rdflib.NamedNode(URI_TEMPLATE + uuidv4()),
            sourceGraph
          ));
        }

        triples.map((triple) => {
          datasetTriples.push(triple);
          nextStartingPoints.push(triple.object);
        });
      }
    }

    // update state for next loop
    startingPoints = nextStartingPoints;
    nextPathElements = restPathElements;
  }

  // (this is reduntant, if there are no startingPoints values will
  // always be an array, but it's more obvious ;-)
  if (nextPathElements.length == 0)
    return {triples: datasetTriples, values: startingPoints};
  else
    return {triples: datasetTriples, values: []};
}

function validateForm(form, options) {
  const {store, formGraph, sourceGraph, sourceNode, metaGraph} = options;
  const fields = fieldsForForm(form, options);
  const fieldValidations = fields.map(field => validateField(field, options));
  return fieldValidations.reduce((acc, value) => acc && value, true);
}

function validateField(fieldUri, options) {
  return validationResultsForField(fieldUri, options).reduce((acc, value) => acc && value.valid, true);
}

function validationResultsForField(fieldUri, options) {
  const {store, formGraph, sourceGraph, sourceNode, metaGraph} = options;
  const validationConstraints = store
    .match(fieldUri, FORM("validations"), undefined, formGraph)
    .map(t => t.object);

  const validationResults = [];
  for (const constraintUri of validationConstraints) {
    const validationResult = check(constraintUri, options);
    validationResults.push(validationResult);
  }
  return validationResults;
}

function validationResultsForFieldPart(triplesData, fieldUri, options){
  const {store, formGraph, sourceGraph, sourceNode, metaGraph} = options;
  const validationConstraints = store
    .match(fieldUri, FORM("validations"), undefined, formGraph)
    .map(t => t.object);

  const validationResults = [];
  for (const constraintUri of validationConstraints) {
    const validationResult = checkTriples(constraintUri, triplesData, options);
    validationResults.push(validationResult);
  }
  return validationResults;
}
function updateSimpleFormValue(options, newValue = null, oldValue = null) {

  /* This might be tricky.We need to find a subject and predicate to attach the object to.
* The path might contain several hops, and some of them don't necessarly exist. Consider:
*
*  Suppose our path is
*  sh:path ( [ sh:inversePath besluit:heeftBesluitenlijst ] prov:startedAtTime )
*
*  and we only have
*
*  <besluitenlijst> a <Besluitenlijst>
*
*  A path will then be constructed with
*   <customUri> <prov:startedAtTime> "datum".
*   <customUri> <heeftBesluitenlijst> <besluitenlijst>.
*
* TODO: this is for now a best guess. And further tweaking will be needed. If this needs to be our model:
*  <zitting> a <Zitting>
*  <zitting> <prov:startedAtTime> "datum".
*  <zitting> <heeftBesluitenlijst> <besluitenlijst>.
*  <besluitenlijst> a <Besluitenlijst>
*
* And suppose the data store does not have:
*  <zitting> <prov:startedAtTime> "datum".
*  <zitting> <heeftBesluitenlijst> <besluitenlijst>.
*
* Then the above described solution will not work. Because our <customUri> is not linked to a <Zitting>.
*/

  if(oldValue)
    removeDatasetForSimpleFormValue(oldValue, options);
  if(newValue)
    addSimpleFormValue(newValue, options);
}

function removeDatasetForSimpleFormValue(value, options) {
  const { store } = options;

  //This returns the complete chain of triples for the path, if there something missing, new nodes are added.
  const dataset = triplesForPath(options, true);
  const triplesToRemove = dataset.triples.filter(t => t.object.equals(value));
  store.removeStatements(triplesToRemove);
}

/**
 * Removes all triples for the given options
 * HARD RESET
 */
function removeTriples(options) {
  const { store } = options;

  const dataset = triplesForPath(options, true);
  store.removeStatements(dataset.triples);
}

function removeSimpleFormValue(value, options) {
  const { store } = options;

  //This returns the complete chain of triples for the path, if there something missing, new nodes are added.
  const dataset = triplesForPath(options, true);

  let triplesToRemove = [];
  // The reason why it is more complicated. If we encounter > 1 values for a path, the I expect this form
  // to be broken. This is a way for ther user to correct and remove both values.
  if (dataset.values.length > 0) {
    triplesToRemove = dataset.triples.filter(t => !dataset.values.find(v => t.object.equals(v)));
  }

  if (value) {
    const newTriple = dataset.triples.slice(-1)[0];
    newTriple.object = value;
    triplesToRemove.push(newTriple);
  }

  store.removeStatements(triplesToRemove);
}

function addSimpleFormValue(value, options) {
  const {store, formGraph, sourceGraph, sourceNode, metaGraph} = options;

  //This returns the complete chain of triples for the path, if there something missing, new nodes are added.
  const dataset = triplesForPath(options, true);

  let triplesToAdd = [];
  // The reason why it is more complicated. If we encounter > 1 values for a path, the I expect this form
  // to be broken. This is a way for ther user to correct and remove both values.
  if (dataset.values.length > 0) {
    triplesToAdd = dataset.triples.filter(t => !dataset.values.find(v => t.object.equals(v)));
  }

  if (value) {
    const newTriple = dataset.triples.slice(-1)[0];
    newTriple.object = value;
    triplesToAdd.push(newTriple);
  }

  store.addAll(triplesToAdd);
}

export default importTriplesForForm;
export {
  triplesForPath,
  fieldsForForm,
  validateForm,
  validateField,
  validationResultsForField,
  validationResultsForFieldPart,
  updateSimpleFormValue,
  addSimpleFormValue,
  removeSimpleFormValue,
  removeDatasetForSimpleFormValue,
  removeTriples,
  importTriplesForForm
};
