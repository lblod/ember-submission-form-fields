import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { task } from 'ember-concurrency';
import { downloadZip } from 'client-zip';

import { RDF } from '@lblod/submission-form-helpers';
import { NamedNode } from 'rdflib';
import { triggerZipDownload } from '../../../-private/utils/download';

export default class FormInputFieldsRemoteUrlsShowComponent extends Component {
  @service store;
  @service toaster;

  @tracked remoteUrls;
  @tracked hasRemoteUrlErrors = false;

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

    for (let uri of matches.values) {
      try {
        if (this.isRemoteDataObject(uri)) {
          const record = await this.loadRemoteDataObjectRecord(uri);
          this.remoteUrls = [...this.remoteUrls, record];
        }
      } catch (error) {
        console.error(error);
        this.hasRemoteUrlErrors = true;
      }
    }

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
    const remoteUrls = await this.store.query('remote-url', {
      'filter[:uri:]': remoteObjectUri.value,
      page: { size: 1 },
    });
    if (remoteUrls.length) {
      return remoteUrls[0];
    } else {
      throw `No remote-url could be found for ${remoteObjectUri}`;
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
