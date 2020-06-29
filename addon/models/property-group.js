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

    this.setName(options);

    const {store, formGraph} = options;
    this.order = parseInt(store.any(uri, SHACL("order"), undefined, formGraph).value);
    this.description = store.any(uri, SHACL("description"), undefined, formGraph).value;
  }

  setName(options) {
    const {store, formGraph} = options;
    const t = store.any(this.uri, SHACL("name"), undefined, formGraph);
    if (t) {
      this.name = t.value;
    }
  }

  get sortedFields() {
    return this
      .fields
      .sort((a, b) => a.order > b.order);
  }
}
