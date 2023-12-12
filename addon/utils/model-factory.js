import Field from '@lblod/ember-submission-form-fields/models/field';
import PropertyGroup from '@lblod/ember-submission-form-fields/models/property-group';
import Listing from '@lblod/ember-submission-form-fields/models/listing';
import SubForm from '@lblod/ember-submission-form-fields/models/sub-form';
import {
  SHACL,
  FORM,
  RDF,
  fieldsForForm,
  getFormModelVersion,
} from '@lblod/submission-form-helpers';
import { Section } from './model-transition';

function createPropertyTreeFromFields(
  fields,
  { store, formGraph, sourceGraph, sourceNode }
) {
  let mappedFields = fields.map((field) =>
    Section.forItem(field, { store, formGraph })
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
    let groupUri = Section.forItem(fieldUri, { store, formGraph });
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
export function getTopLevelPropertyGroups({ store, graphs, form }) {
  const formGraph = graphs.formGraph;
  const groups = Section.all({ store, formGraph }).map((t) => t.subject);

  //TODO: this is really not clear this is a belongsToRelation + doubt nesting is really is used.
  const top = groups.filter(
    (group) => !Section.forItem(group, { store, formGraph })
  );

  let filteredGroups = [];

  //TODO: make helpers
  if (
    getFormModelVersion(form, {
      store,
      formGraph: formGraph,
    }).toLowerCase() == 'v2'
  ) {
    const toplevelSubFormGroups = [];
    for (const group of top) {
      const formItems = Section.getItems(group, {
        store,
        formGraph,
      });

      if (
        formItems.find((item) =>
          store.any(form, FORM('includes'), item.subject, formGraph)
        )
      ) {
        toplevelSubFormGroups.push(group);
      }
    }
    filteredGroups = toplevelSubFormGroups;
  } else {
    const toplevelFormGroups = [];
    for (const group of top) {
      const formItems = Section.getItems(group, { store, formGraph });
      if (
        formItems.find(
          (item) =>
            !store.any(undefined, FORM('includes'), item.subject, formGraph)
        )
      ) {
        toplevelFormGroups.push(group);
      }
    }
    filteredGroups = toplevelFormGroups;
  }

  return filteredGroups
    .map((group) => new PropertyGroup(group, { store, formGraph: formGraph }))
    .sort((a, b) => a.order - b.order);
}

export function getRootNodeForm({ store, graphs }) {
  return (
    store.any(undefined, RDF('type'), FORM('TopLevelForm'), graphs.formGraph) ||
    store.any(undefined, RDF('type'), FORM('Form'), graphs.formGraph)
  );
}

export function getSubFormsForNode(
  { store, graphs, node, sourceNode },
  formPath = FORM('each')
) {
  const subForms = store
    .match(undefined, RDF('type'), FORM('SubForm'), graphs.formGraph)
    .map((t) => t.subject);
  const top = subForms.filter((subForm) =>
    store.any(node, formPath, subForm, graphs.formGraph)
  );
  return top.map(
    (subform) =>
      new SubForm(subform, { store, formGraph: graphs.formGraph, sourceNode })
  );
}

/**
 * Returns all the children (fields & property-groups) for the given property-group, in order.
 *
 * @returns list of children for the given property-group, in order.
 */
export function getChildrenForPropertyGroup(
  group,
  { form, store, graphs, node }
) {
  const formGraph = graphs.formGraph;
  const conditionals = fieldsForForm(form, {
    store,
    formGraph,
    sourceGraph: graphs.sourceGraph,
    metaGraph: graphs.metaGraph,
    sourceNode: node,
  });

  // NOTE: contains all children for a property-group (this can include other nested property-groups)
  const children = Section.getItems(group.uri, { store, formGraph }).map(
    (t) => t.subject
  );

  // NOTE: retrieve the property-groups from the children and process them
  let groups = children.filter(
    (child) => !!Section.itemIsSection(child, { store, formGraph })
  );
  if (groups.length) {
    groups = groups
      // NOTE: filter out property-groups that do not contain any fields (conditional)
      .filter(
        (group) =>
          conditionals.filter((field) => {
            const fieldSection = Section.forItem(field, { store, formGraph });
            return fieldSection.value === group.value;
          }).length !== 0
      )
      .map((group) => new PropertyGroup(group, { store, formGraph }));
  }

  const listings = children
    .filter((child) =>
      store.any(child, RDF('type'), FORM('Listing'), graphs.formGraph)
    )
    .filter((child) => conditionals.map((t) => t.value).includes(child.value))
    .map((child) => new Listing(child, { store, formGraph: graphs.formGraph }));

  const fields = children
    .filter((child) =>
      store.any(child, RDF('type'), FORM('Field'), graphs.formGraph)
    )
    .filter((child) => conditionals.map((t) => t.value).includes(child.value))
    .map((child) => new Field(child, { store, formGraph: graphs.formGraph }));

  return [...groups, ...listings, ...fields].sort((a, b) => a.order - b.order);
}

export { createPropertyTreeFromFields };
