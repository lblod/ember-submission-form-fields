import { tracked } from '@glimmer/tracking';

import { FORM, SHACL } from '@lblod/submission-form-helpers';

export default class PropertyGroupModel {

  @tracked
  uri = '';
  @tracked
  label = '';
  @tracked
  fields = [];

  constructor(uri, options) {
    this.uri = uri;
    const {store, formGraph} = options;
    this.rdflibName = store.any(this.uri, SHACL('name'), undefined, formGraph);
    this.rdflibOrder = store.any(uri, SHACL('order'), undefined, formGraph);
    this.rdflibDescription = store.any(uri, SHACL('description'), undefined, formGraph);
    this.rdflibHelp = store.any( uri, FORM("help"), undefined, formGraph );
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

  @tracked
  rdflibHelp = null;
  get help() {
    return this.rdflibHelp && this.rdflibHelp.value;
  }

  get description() {
    return this.rdflibDescription && this.rdflibDescription.value;
  }

  get sortedFields() {
    return this.fields.sort((a, b) => a.order > b.order);
  }

  get displayType() {
    return 'http://lblod.data.gift/display-types/property-group';
  }
}
