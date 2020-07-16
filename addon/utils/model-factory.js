import Field from '@lblod/ember-submission-form-fields/models/field';
import PropertyGroup from '@lblod/ember-submission-form-fields/models/property-group';
import { SHACL, FORM, RDF, fieldsForForm } from '@lblod/submission-form-helpers';

function createPropertyTreeFromFields(fields, {store, formGraph, sourceGraph, sourceNode}) {
  let mappedFields =
    fields.map((field) => store.any(field, SHACL('group'), undefined, formGraph));

  const groups =
    mappedFields
      // .filter( (fieldGroup) => fieldGroup )
      .reduce((acc, item) => {
        const pg = new PropertyGroup(item, {store, formGraph});
        acc[item.value] = pg;
        return acc;
      }, {});

  for (let fieldUri of fields) {
    const field = new Field(fieldUri, {store, formGraph, sourceGraph, sourceNode});
    let groupUri = store.any(fieldUri, SHACL('group'), undefined, formGraph);
    const group = groups[groupUri.value];
    group.fields.push(field);
  }

  const sortedGroups =
    Object.values(groups).sort((a, b) => a.order - b.order);

  let sortedFields = sortedGroups;

  sortedGroups.forEach(function(e, i) {
    sortedFields[i].fields = e.fields.sort((a, b) => a.order - b.order);
  });

  //return Object.values(groups);
  return sortedFields;
}

export function getTopLevelPropertyGroups({store, graphs}) {
  const groups = store.match(undefined, RDF('type'), FORM('PropertyGroup'), graphs.formGraph).map(t => t.subject);
  const top = groups.filter(group => !store.any(group, SHACL('group'), undefined, graphs.formGraph));
  return top.map(group => new PropertyGroup(group, {store, formGraph: graphs.formGraph})).sort((a, b) => a.order - b.order);
}

// TODO make more efficient & solid
export function getChildrenForPropertyGroup(group, {form, store, graphs, node}) {
  const children = store.match(undefined, SHACL('group'), group.uri, graphs.formGraph).map(t => t.subject);
  const fields = fieldsForForm(form, {
    store,
    formGraph: graphs.formGraph,
    sourceGraph: graphs.sourceGraph,
    metaGraph: graphs.metaGraph,
    sourceNode: node,
  });
  let transformed = children.map((child) => {
    if (!!store.any(child, RDF('type'), FORM('PropertyGroup'), graphs.formGraph)) {
      return new PropertyGroup(child, {store, formGraph: graphs.formGraph});
    } else if (fields.map(t => t.value).includes(child.value)) {
      return new Field(child, {store, formGraph: graphs.formGraph});
    }
  });
  return transformed.filter(e => e !== undefined).sort((a, b) => a.order - b.order);
}

export { createPropertyTreeFromFields };
