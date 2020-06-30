import {tracked} from '@glimmer/tracking';

import {SHACL} from '@lblod/submission-form-helpers';

export default class PropertyGroupModel {

  @tracked
  uri = '';
  @tracked
  label = "";
  @tracked
  fields = [];

  constructor(uri, options) {
    this.uri = uri;
    const {store, formGraph} = options;
    this.rdflibName = store.any(this.uri, SHACL("name"), undefined, formGraph);
    this.rdflibOrder = store.any(uri, SHACL("order"), undefined, formGraph);
    this.rdflibDescription = store.any(uri, SHACL("description"), undefined, formGraph);
  }

  @tracked
  rdflibName = null;
  get name() {
    return this.rdflibName && this.rdflibName.value;
  }

  @tracked
  rdflibOrder = null;
  get order() {
    return this.rdflibOrder && parseInt(this.rdflibOrder.value);
  }

  @tracked
  rdflibDescription = null;
  get description() {
    return this.rdflibDescription && this.rdflibDescription.value;
  }

  get sortedFields() {
    return this
      .fields
      .sort((a, b) => a.order > b.order);
  }
}
