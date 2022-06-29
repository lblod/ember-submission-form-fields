import { tracked } from '@glimmer/tracking';

import { SHACL, FORM } from '@lblod/submission-form-helpers';

export default class FieldModel {
  @tracked
  uri = '';

  constructor(uri, options) {
    const { store, formGraph } = options;

    this.uri = uri;
    this.rdflibLabel = store.any(uri, SHACL('name'), undefined, formGraph);
    this.rdflibDescription = store.any(
      uri,
      SHACL('description'),
      undefined,
      formGraph
    );
    this.rdflibHelp = store.any(uri, FORM('help'), undefined, formGraph);
    this.rdflibOrder = store.any(uri, SHACL('order'), undefined, formGraph);
    this.rdflibDisplayType = store.any(
      uri,
      FORM('displayType'),
      undefined,
      formGraph
    );
    this.rdflibPath = store.any(uri, SHACL('path'), undefined, formGraph);
    this.rdflibScope = store.any(uri, FORM('scope'), undefined, formGraph);
    this.rdflibOptions = store.any(uri, FORM('options'), undefined, formGraph);
    this.rdflibDefaultValue = store.any(
      uri,
      FORM('defaultValue'),
      undefined,
      formGraph
    );
    if (this.rdflibPath) {
      // this.rdflibValue = store.any(sourceNode, this.rdflibPath, undefined, sourceGraph);
    }
  }

  @tracked
  rdflibLabel = null;
  get label() {
    return this.rdflibLabel && this.rdflibLabel.value;
  }

  @tracked
  rdflibDescription = null;
  get description() {
    return this.rdflibDescription && this.rdflibDescription.value;
  }

  @tracked
  rdflibHelp = null;
  get help() {
    return this.rdflibHelp && this.rdflibHelp.value;
  }

  @tracked
  rdflibOrder = null;
  get order() {
    return this.rdflibOrder && parseInt(this.rdflibOrder.value);
  }

  @tracked
  rdflibDisplayType = null;
  get displayType() {
    return this.rdflibDisplayType && this.rdflibDisplayType.value;
  }

  @tracked
  rdflibPath = null;
  get path() {
    return this.rdflibPath && this.rdflibPath.value;
  }

  @tracked
  rdflibScope = null;
  get scope() {
    return this.rdflibScope && this.rdflibScope.value;
  }

  @tracked
  rdflibOptions = null;
  get options() {
    let options;

    try {
      options = JSON.parse(this.rdflibOptions?.value);
    } catch {
      options = {};
    }

    return options;
  }

  @tracked
  rdflibDefaultValue = null;
  get defaultValue() {
    return this.rdflibDefaultValue && this.rdflibDefaultValue.value;
  }
}
