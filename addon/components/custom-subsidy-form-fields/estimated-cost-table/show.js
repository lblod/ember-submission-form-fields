import BaseTable from './base-table';

export default class CustomSubsidyFormFieldsEstimatedCostTableShowComponent extends BaseTable {
  constructor() {
    super(...arguments);
    this.entries = this.loadEstimatedCostEntries();
  }
}
