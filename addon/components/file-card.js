import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class FileCardComponent extends Component {
  get isRemovable() {
    return typeof this.args.onDelete === 'function';
  }

  get isDownloadable() {
    return typeof this.args.downloadLink === 'string';
  }

  @action
  delete(event) {
    event.preventDefault();
    this.args.onDelete(this.args.fileName);
  }
}
