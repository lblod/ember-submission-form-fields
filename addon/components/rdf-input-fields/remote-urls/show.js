import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { task } from 'ember-concurrency';
import { downloadZip } from 'client-zip';

import { RDF } from '@lblod/submission-form-helpers';
import { NamedNode } from 'rdflib';
import { triggerZipDownload } from '../../../-private/utils/download';
import RemoteDataObjectInfoCard from './remote-data-object-info-card';

export default class FormInputFieldsRemoteUrlsShowComponent extends Component {
  @service store;
  @service toaster;

  @tracked remoteUrls;
  @tracked sourceDocumentUrls;
  @tracked attachmentUrls;
  @tracked hasRemoteUrlErrors = false;

  RemoteDataObjectInfoCard = RemoteDataObjectInfoCard;

  constructor() {
    super(...arguments);
    this.loadRemoteUrls.perform();
  }

  get storeOptions() {
    return {
      formGraph: this.args.graphs.formGraph,
      sourceGraph: this.args.graphs.sourceGraph,
      metaGraph: this.args.graphs.metaGraph,
      sourceNode: this.args.sourceNode,
      store: this.args.formStore,
      path: this.args.field.rdflibPath,
      scope: this.args.field.rdflibScope,
    };
  }

  get canDownloadZip() {
    if (this.loadRemoteUrls.isRunning) {
      return false;
    }

    return this.downloadableRemoteUrls.length > 1;
  }

  get downloadableRemoteUrls() {
    return this.remoteUrls.filter((remoteUrl) => remoteUrl.downloadSuccess);
  }

  loadRemoteUrls = task(async () => {
    const matches = triplesForPath(this.storeOptions);
    const remoteUrls = [];
    const sourceDocumentUrls = [];
    const attachmentUrls = [];

    for (let uri of matches.values) {
      try {
        if (this.isRemoteDataObject(uri)) {
          const record = await this.loadRemoteDataObjectRecord(uri);
          remoteUrls.push(record);
        }
      } catch (error) {
        console.error(error);
        this.hasRemoteUrlErrors = true;
      }
    }

    // Filter the remote data objects by their creator. There are 3 ways a
    // remote data object is linked to a submission:
    // The automatic-submission-service downloads the source document for an
    // automatic submission (= sent it by an external party).
    // The validate-submission-service links the uploaded files to a submission
    // when it is created in Loket.
    // The import-submission-service is responsible for creating attachments to
    // automatic submissions when they are being processed.
    for (const remoteUrl of remoteUrls) {
      const creator = remoteUrl.creator;
      switch (creator) {
        case 'http://lblod.data.gift/services/import-submission-service':
          attachmentUrls.push(remoteUrl);
          break;
        case 'http://lblod.data.gift/services/automatic-submission-service':
        case 'http://lblod.data.gift/services/validate-submission-service':
        default:
          sourceDocumentUrls.push(remoteUrl);
          break;
      }
    }

    this.remoteUrls = remoteUrls;
    this.sourceDocumentUrls = sourceDocumentUrls;
    this.attachmentUrls = attachmentUrls;
  });

  isRemoteDataObject(subject) {
    const remoteDataObjectType = new NamedNode(
      'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#RemoteDataObject',
    );
    return (
      this.args.formStore.match(
        subject,
        RDF('type'),
        remoteDataObjectType,
        this.args.sourceGraph,
      ).length > 0
    );
  }

  async loadRemoteDataObjectRecord(remoteObjectUri) {
    const remoteUrls = await this.store.query('remote-data-object', {
      'filter[:uri:]': remoteObjectUri.value,
      page: { size: 1 },
      include: 'file',
    });
    if (remoteUrls.length) {
      return remoteUrls[0];
    } else {
      throw `No remote-data-object could be found for ${remoteObjectUri}`;
    }
  }

  downloadAsZip = task(async () => {
    const promises = this.downloadableRemoteUrls.map((remoteUrl) => {
      return fetch(remoteUrl.downloadLink).then((response) => {
        if (!response.ok) {
          throw new Error(
            `Something went wrong while trying to download '${remoteUrl.downloadLink}': ${response.status} ${response.statusText}`,
          );
        }

        return response;
      });
    });

    try {
      const files = await Promise.all(promises);
      const zipBlob = await downloadZip(files).blob();
      triggerZipDownload(zipBlob, 'gebundelde-links.zip');
    } catch (error) {
      console.error(error);
      this.toaster.error(
        'Het .zip bestand kon niet gegenereerd worden. Probeer later opnieuw.',
      );
    }
  });
}
