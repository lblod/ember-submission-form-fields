import {tracked} from '@glimmer/tracking';

import {SHACL} from '@lblod/submission-form-helpers';

export default class PropertyGroupModel {

  @tracked
  uri = '';
  @tracked
  label = "";
  @tracked
  order = "";
  @tracked
  description = "";
  @tracked
  fields = [];

  constructor(uri, options) {
    this.uri = uri;
    const {store, formGraph} = options;
    this.rdflibName = store.any(this.uri, SHACL("name"), undefined, formGraph);
    this.order = parseInt(store.any(uri, SHACL("order"), undefined, formGraph).value);
    this.description = store.any(uri, SHACL("description"), undefined, formGraph).value;
  }

  @tracked
  rdflibName = null;
  get name() {
    return this.rdflibName && this.rdflibName.value;
  }

  get sortedFields() {
    return this
      .fields
      .sort((a, b) => a.order > b.order);
  }
}
