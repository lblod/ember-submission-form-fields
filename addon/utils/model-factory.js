import Field from '@lblod/ember-submission-form-fields/models/field';
import PropertyGroup from '@lblod/ember-submission-form-fields/models/property-group';
import { SHACL } from '@lblod/submission-form-helpers';

function createPropertyTreeFromFields( fields, { store, formGraph } ) {
  let mappedFields =
      fields
      .map( (field) => store.any( field, SHACL("group"), undefined, formGraph ) );

  const groups =
      mappedFields
      // .filter( (fieldGroup) => fieldGroup )
      .reduce( (acc, item) => {
        const pg = new PropertyGroup( item, { store, formGraph } );
        acc[item.value] = pg;
        return acc;
      }, {} );

  for( let fieldUri of fields ) {
    const field = new Field( fieldUri, { store, formGraph } );
    let groupUri = store.any( fieldUri, SHACL("group"), undefined, formGraph );
    const group = groups[groupUri.value];
    group.fields.push( field );
  }

  const sortedGroups =
        Object.values(groups).sort( (a,b) => a.order - b.order );

  let sortedFields=sortedGroups;

  sortedGroups.forEach(function(e, i){
    sortedFields[i].fields=e.fields.sort( (a,b) => a.order - b.order );
  });

  //return Object.values(groups);
  return sortedFields;
}

export { createPropertyTreeFromFields };
