import { RDF, FORM, SHACL } from '@lblod/submission-form-helpers';
/**
 * sh:group was replaced by form:partOf and form:PropertyGroup was replaced by form:Section
 */
export const sectionContainingItem = (formItem, { store, formGraph }) => {
  const section = store.any(formItem, FORM('partOf'), undefined, formGraph);
  if (section) {
    return section;
  }
  return store.any(formItem, SHACL('group'), undefined, formGraph);
};
export const getChildrenOfSection = (section, { store, formGraph }) => {
  const items = store.match(undefined, FORM('partOf'), section, formGraph);
  if (items.length) {
    return items;
  }
  return store.match(undefined, SHACL('group'), section, formGraph);
};
export const allSections = ({ store, formGraph }) => {
  const items = store.match(undefined, RDF('type'), FORM('Section'), formGraph);
  if (items.length) {
    return items;
  }
  return store.match(undefined, RDF('type'), FORM('PropertyGroup'), formGraph);
};
export const itemIsSection = (item, { store, formGraph }) => {
  return (
    store.any(item, RDF('type'), FORM('Section'), formGraph) ||
    store.any(item, RDF('type'), FORM('PropertyGroup'), formGraph)
  );
};
