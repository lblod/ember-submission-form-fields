import Component from '@glimmer/component';
import { SHACL, FORM, fieldsForForm } from '@lblod/submission-form-helpers';
import ListingTableRow from './table/row';
import Field from '@lblod/ember-submission-form-fields/models/field';

export default class ListingTableComponent extends Component {
  ListingTableRow = ListingTableRow;

  constructor() {
    super(...arguments);

    let store = this.args.formStore;
    let graphs = this.args.graphs;
    let listingTableNode = this.args.listing.uri;

    const tableSubForm = store.any(
      listingTableNode,
      FORM('each'),
      undefined,
      graphs.formGraph
    );

    this.title = this.getTableTitle(tableSubForm);

    let fields = fieldsForForm(tableSubForm, {
      store,
      formGraph: graphs.formGraph,
      sourceGraph: graphs.sourceGraph,
      metaGraph: graphs.metaGraph,
      sourceNode: listingTableNode,
    });
    this.tableHeaders = this.getTableHeaders(fields);

    this.showRowIndex =
      store.any(
        listingTableNode,
        FORM('showTableRowIndex'),
        undefined,
        graphs.formGraph
      )?.value || false;

    if (this.showRowIndex) {
      this.indexLabel = store.any(
        listingTableNode,
        FORM('tableIndexLabel'),
        undefined,
        graphs.formGraph
      )?.value;
    }
  }

  getTableTitle(tableForm) {
    let formTitleTriple = this.args.formStore.any(
      tableForm,
      SHACL('name', undefined, this.args.graphs.formGraph)
    );

    return formTitleTriple?.value;
  }

  getTableHeaders(tableFields) {
    return tableFields
      .map((fieldUri) => {
        return new Field(fieldUri, {
          store: this.args.formStore,
          formGraph: this.args.graphs.formGraph,
        });
      })
      .map((field) => {
        return {
          label: field.label,
          help: field.help,
          order: field.order,
        };
      })
      .sort(sortByOrder);
  }

  get canRemove() {
    return this.args.canRemove && this.args.subForms.length > 0;
  }
}

function sortByOrder(fieldA, fieldB) {
  return fieldA.order - fieldB.order;
}
