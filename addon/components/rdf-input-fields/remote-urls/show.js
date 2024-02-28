import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { guidFor } from '@ember/object/internals';

import { RDF } from '@lblod/submission-form-helpers';
import { NamedNode } from 'rdflib';

export default class FormInputFieldsRemoteUrlsShowComponent extends Component {
  inputId = 'remote-urls-' + guidFor(this);

  @service store;

  @tracked remoteUrls;
  @tracked hasRemoteUrlErrors = false;

  constructor() {
    super(...arguments);
    this.loadRemoteUrls();
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

  async loadRemoteUrls() {
    const matches = triplesForPath(this.storeOptions);
    const remoteUrls = [];

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

    this.remoteUrls = remoteUrls;
  }

  isRemoteDataObject(subject) {
    const remoteDataObjectType = new NamedNode(
      'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#RemoteDataObject'
    );
    return (
      this.args.formStore.match(
        subject,
        RDF('type'),
        remoteDataObjectType,
        this.args.sourceGraph
      ).length > 0
    );
  }

  async loadRemoteDataObjectRecord(remoteObjectUri) {
    const remoteUrls = await this.store.query('remote-url', {
      'filter[:uri:]': remoteObjectUri.value,
      page: { size: 1 },
    });
    if (remoteUrls.length) {
      return remoteUrls.slice()[0]; // TODO: remove .slice once we support only Ember Data 4.8+
    } else {
      throw `No remote-url could be found for ${remoteObjectUri}`;
    }
  }
}
