import { tracked } from '@glimmer/tracking';
import { SHACL, FORM } from '@lblod/submission-form-helpers';

export const LISTING_TYPE = 'http://lblod.data.gift/vocabularies/forms/Listing';

export default class ListingModel {
  @tracked
  uri = '';

  constructor(uri, options) {
    const { store, formGraph } = options;

    this.uri = uri;
    this.rdflibLabel = store.any(uri, SHACL('name'), undefined, formGraph);
    this.rdflibOrder = store.any(uri, SHACL('order'), undefined, formGraph);
    this.rdflibPath = store.any(uri, SHACL('path'), undefined, formGraph);
    this.rdflibScope = store.any(uri, FORM('scope'), undefined, formGraph);
    this.rdflibOptions = store.any(uri, FORM('options'), undefined, formGraph);
  }

  @tracked
  rdflibLabel = null;
  get label() {
    return this.rdflibLabel && this.rdflibLabel.value;
  }
  
  @tracked
  rdflibOrder = null;
  get order() {
    return this.rdflibOrder && parseInt(this.rdflibOrder.value);
  }

  //TODO: revise the name of property
  get displayType() {
    return LISTING_TYPE;
  }
}
