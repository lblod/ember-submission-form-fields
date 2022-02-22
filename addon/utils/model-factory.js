import Field from '@lblod/ember-submission-form-fields/models/field';
import PropertyGroup from '@lblod/ember-submission-form-fields/models/property-group';
import {
  SHACL,
  FORM,
  RDF,
  fieldsForForm,
} from '@lblod/submission-form-helpers';

function createPropertyTreeFromFields(
  fields,
  { store, formGraph, sourceGraph, sourceNode }
) {
  let mappedFields = fields.map((field) =>
    store.any(field, SHACL('group'), undefined, formGraph)
  );

  const groups = mappedFields
    // .filter( (fieldGroup) => fieldGroup )
    .reduce((acc, item) => {
      const pg = new PropertyGroup(item, { store, formGraph });
      acc[item.value] = pg;
      return acc;
    }, {});

  for (let fieldUri of fields) {
    const field = new Field(fieldUri, {
      store,
      formGraph,
      sourceGraph,
      sourceNode,
    });
    let groupUri = store.any(fieldUri, SHACL('group'), undefined, formGraph);
    const group = groups[groupUri.value];
    group.fields.push(field);
  }

  const sortedGroups = Object.values(groups).sort((a, b) => a.order - b.order);

  let sortedFields = sortedGroups;

  sortedGroups.forEach(function (e, i) {
    sortedFields[i].fields = e.fields.sort((a, b) => a.order - b.order);
  });

  //return Object.values(groups);
  return sortedFields;
}

/**
 * Returns the top-level property-groups that are defined within the form, in order.
 *
 * @returns list of top-level property-groups, in order.
 */
export function getTopLevelPropertyGroups({ store, graphs }) {
  const groups = store
    .match(undefined, RDF('type'), FORM('PropertyGroup'), graphs.formGraph)
    .map((t) => t.subject);
  const top = groups.filter(
    (group) => !store.any(group, SHACL('group'), undefined, graphs.formGraph)
  );
  return top
    .map(
      (group) =>
        new PropertyGroup(group, { store, formGraph: graphs.formGraph })
    )
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns all the children (fields & property-groups) for the given property-group, in order.
 *
 * @returns list of children for the given property-group, in order.
 */
export function getChildrenForPropertyGroup(
  group,
  { form, store, graphs, node },
  conditionals = fieldsForForm(form, {
    store,
    formGraph: graphs.formGraph,
    sourceGraph: graphs.sourceGraph,
    metaGraph: graphs.metaGraph,
    sourceNode: node,
  })
) {
  // NOTE: contains all children for a property-group (this can include other nested property-groups)
  const children = store
    .match(undefined, SHACL('group'), group.uri, graphs.formGraph)
    .map((t) => t.subject);

  // NOTE: retrieve the property-groups from the children and process them
  let groups = children.filter(
    (child) =>
      !!store.any(child, RDF('type'), FORM('PropertyGroup'), graphs.formGraph)
  );
  if (groups.length) {
    groups = groups
      // NOTE: filter out property-groups that do not contain any fields (conditional)
      .filter(
        (group) =>
          conditionals.filter((field) => {
            const fg = store.any(field, SHACL('group'), undefined);
            return fg.value === group.value;
          }).length !== 0
      )
      .map(
        (group) =>
          new PropertyGroup(group, { store, formGraph: graphs.formGraph })
      );
  }

  // NOTE: retrieve fields from the children and process them
  let fields = children.filter(
    (child) => !!store.any(child, RDF('type'), FORM('Field'), graphs.formGraph)
  );
  if (fields.length) {
    fields = fields
      .filter((field) => conditionals.map((t) => t.value).includes(field.value))
      .map((field) => new Field(field, { store, formGraph: graphs.formGraph }));
  }

  return [...groups, ...fields].sort((a, b) => a.order - b.order);
}

export { createPropertyTreeFromFields };
