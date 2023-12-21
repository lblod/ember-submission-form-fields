import Field from '@lblod/ember-submission-form-fields/models/field';
import Section from '@lblod/ember-submission-form-fields/models/section';
import Listing from '@lblod/ember-submission-form-fields/models/listing';
import SubForm from '@lblod/ember-submission-form-fields/models/sub-form';
import {
  FORM,
  RDF,
  fieldsForForm,
  getFormModelVersion,
} from '@lblod/submission-form-helpers';
import { SectionHelpers } from './model-transition';
import { V2 } from './constants';

function createPropertyTreeFromFields(
  fields,
  { store, formGraph, sourceGraph, sourceNode }
) {
  let mappedFields = fields.map((field) =>
    SectionHelpers.containingItem(field, { store, formGraph })
  );

  const sections = mappedFields.reduce((acc, item) => {
    acc[item.value] = new Section(item, { store, formGraph });
    return acc;
  }, {});

  for (let fieldUri of fields) {
    const field = new Field(fieldUri, {
      store,
      formGraph,
      sourceGraph,
      sourceNode,
    });
    let sectionUri = SectionHelpers.containingItem(fieldUri, {
      store,
      formGraph,
    });
    const group = sections[sectionUri.value];
    group.fields.push(field);
  }

  const sortedSections = Object.values(sections).sort(
    (a, b) => a.order - b.order
  );

  let sortedFields = sortedSections;

  sortedSections.forEach(function (e, i) {
    sortedFields[i].fields = e.fields.sort((a, b) => a.order - b.order);
  });

  return sortedFields;
}

/**
 * Returns the top-level property-groups that are defined within the form, in order.
 * @deprecated use getTopLevelSections instead
 *
 * @returns list of top-level property-groups, in order.
 */
export function getTopLevelPropertyGroups({ store, graphs, form }) {
  return getTopLevelSections({ store, graphs, form });
}

/**
 * Returns the top-level sections that are defined within the form, in order.
 *
 * @returns list of top-level sections, in order.
 */
export function getTopLevelSections({ store, graphs, form }) {
  const formGraph = graphs.formGraph;
  const sections = SectionHelpers.all({ store, formGraph }).map(
    (t) => t.subject
  );

  //TODO: this is really not clear this is a belongsToRelation + doubt nesting is really is used.
  const top = sections.filter(
    (section) => !SectionHelpers.containingItem(section, { store, formGraph })
  );

  let filteredGroups = [];

  //TODO: make helpers
  if (
    getFormModelVersion(form, {
      store,
      formGraph: formGraph,
    }).toLowerCase() == V2
  ) {
    const toplevelSubFormGroups = [];
    for (const group of top) {
      const formItems = SectionHelpers.getChildren(group, {
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
      const formItems = SectionHelpers.getChildren(group, { store, formGraph });
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
    .map((group) => new Section(group, { store, formGraph: formGraph }))
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
 * @deprecated use #getChildrenForSection instead
 *
 * @returns list of children for the given property-group, in order.
 */
export function getChildrenForPropertyGroup(
  group,
  { form, store, graphs, node }
) {
  return getChildrenForSection(group, { form, store, graphs, node });
}

/**
 * Returns all the children (fields & sections) for the given section, in order.
 *
 * @returns list of children for the given section, in order.
 */
export function getChildrenForSection(section, { form, store, graphs, node }) {
  const formGraph = graphs.formGraph;
  const conditionals = fieldsForForm(form, {
    store,
    formGraph,
    sourceGraph: graphs.sourceGraph,
    metaGraph: graphs.metaGraph,
    sourceNode: node,
  });

  // NOTE: contains all children for a section (this can include other nested sections)
  const children = SectionHelpers.getChildren(section.uri, {
    store,
    formGraph,
  }).map((t) => t.subject);

  // NOTE: retrieve the sections from the children and process them
  let sections = children.filter(
    (child) => !!SectionHelpers.itemIsSection(child, { store, formGraph })
  );
  if (sections.length) {
    sections = sections
      // NOTE: filter out sections that do not contain any fields (conditional)
      .filter(
        (section) =>
          conditionals.filter((field) => {
            const fieldSection = SectionHelpers.containingItem(field, {
              store,
              formGraph,
            });
            return fieldSection.value === section.value;
          }).length !== 0
      )
      .map((section) => new Section(section, { store, formGraph }));
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

  return [...sections, ...listings, ...fields].sort(
    (a, b) => a.order - b.order
  );
}

export { createPropertyTreeFromFields };
