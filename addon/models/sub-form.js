import { tracked } from '@glimmer/tracking';
import { SHACL, FORM } from '@lblod/submission-form-helpers';
export default class SubFormModel {
  @tracked
  uri = '';

  constructor(uri, options) {
    const { store, formGraph } = options;
    this.uri = uri;
    this.sourceNode = options.sourceNode;
    this.rdfItemLabel = store.any(this.uri, SHACL('name'), undefined, formGraph);
  }

  @tracked
  rdfItemLabel = null;
  get itemLabel() {
    return this.rdfItemLabel && this.rdfItemLabel.value;
  }

}
