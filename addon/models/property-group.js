import { tracked } from '@glimmer/tracking';

import { SHACL } from '@lblod/submission-form-helpers';

export default class PropertyGroupModel {
  @tracked
  label = "";
  @tracked
  order = "";
  @tracked
  description = "";
  @tracked
  fields = [];

  constructor( uri, options ) {

    const { store, formGraph } = options;

    this.name = store.any( uri, SHACL("name"), undefined, formGraph ).value;
    this.order = parseInt(store.any( uri, SHACL("order"), undefined, formGraph ).value);
    this.description = store.any( uri, SHACL("description"), undefined, formGraph ).value;
  }

  get sortedFields(){
    return this
      .fields
      .sort( (a,b) => a.order > b.order );
  }
}
