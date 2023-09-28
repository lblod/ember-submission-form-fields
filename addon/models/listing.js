import { tracked } from '@glimmer/tracking';
import { SHACL, FORM, RDF } from '@lblod/submission-form-helpers';
import { Literal } from 'rdflib';

export const LISTING_TYPE = 'http://lblod.data.gift/vocabularies/forms/Listing';

export default class ListingModel {
  @tracked
  uri = '';

  constructor(uri, options) {
    const { store, formGraph } = options;

    this.uri = uri;
    this.store = store;
    this.formGraph = formGraph;

    this.rdflibLabel = store.any(uri, SHACL('name'), undefined, formGraph);
    this.rdflibOrder = store.any(uri, SHACL('order'), undefined, formGraph);
    this.rdflibPath = store.any(uri, SHACL('path'), undefined, formGraph);
    this.rdflibScope = store.any(uri, FORM('scope'), undefined, formGraph);
    this.rdflibOptions = store.any(uri, FORM('options'), undefined, formGraph);
    this.rdflibCanAdd = store.any(uri, FORM('canAdd'), undefined, formGraph);

    let rdflibMinCount = store.any(
      uri,
      SHACL('minCount'),
      undefined,
      formGraph
    );
    if (rdflibMinCount) {
      this.minCount = Literal.toJS(rdflibMinCount);
    }
    this.rdflibMaxCount = store.any(
      uri,
      SHACL('maxCount'),
      undefined,
      formGraph
    );
    this.rdflibCanRemove = store.any(
      uri,
      FORM('canRemove'),
      undefined,
      formGraph
    );
    this.rdflibAddLabel = store.any(
      uri,
      FORM('addLabel'),
      undefined,
      formGraph
    );

    this.removeLabel =
      store.any(uri, FORM('removeLabel'), undefined, formGraph)?.value ||
      'Remove item';

    this.noDataMessage =
      store.any(uri, FORM('noDataMessage'), undefined, formGraph)?.value ||
      'No items';

    this.isTable =
      store.match(uri, RDF('type'), FORM('ListingTable'), formGraph).length > 0;
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

  @tracked
  rdflibCanAdd = null;
  get canAdd() {
    return this.rdflibCanAdd && this.rdflibCanAdd.value == 1;
  }

  @tracked
  rdflibMaxCount = null;
  get maxCount() {
    return this.rdflibMaxCount && parseInt(this.rdflibMaxCount.value);
  }

  @tracked
  rdflibCanRemove = null;
  get canRemove() {
    return this.rdflibCanRemove && this.rdflibCanRemove.value == 1;
  }

  get canChangeOrder() {
    let literal = this.store.any(
      this.uri,
      FORM('canChangeOrder'),
      undefined,
      this.formGraph
    );

    return literal ? Literal.toJS(literal) : false;
  }

  @tracked
  rdflibAddLabel = null;
  get addLabel() {
    return (this.rdflibAddLabel && this.rdflibAddLabel.value) || 'Add item';
  }

  //TODO: revise the name of property
  get displayType() {
    return LISTING_TYPE;
  }
}
