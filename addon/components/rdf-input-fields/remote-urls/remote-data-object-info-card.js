import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import * as filehelpers from '@lblod/ember-submission-form-fields/-private/helpers/file';
import * as remoteDataObjectHelpers from '@lblod/ember-submission-form-fields/-private/helpers/remoteDataObject';

export default class RemoteDataObjectInfoCard extends Component {
  humanReadableSize = filehelpers.humanReadableSize;
  extensionFormatted = filehelpers.extensionFormatted;
  filenameWithoutExtension = filehelpers.filenameWithoutExtension;
  downloadLink = remoteDataObjectHelpers.downloadLink;
  downloadSuccess = remoteDataObjectHelpers.downloadSuccess;
}
