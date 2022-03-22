import InputFieldComponent from '../input-field';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { guidFor } from '@ember/object/internals';
import { A } from '@ember/array';

import { RDF } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';

export default class FormInputFieldsRemoteUrlsShowComponent extends InputFieldComponent {
  inputId = 'remote-urls-' + guidFor(this);

  @service store;

  @tracked remoteUrls = A();
  @tracked hasRemoteUrlErrors = false;

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
  }

  async loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);

    for (let uri of matches.values) {
      try {
        if (this.isRemoteDataObject(uri)) {
          const record = await this.loadRemoteDataObjectRecord(uri);
          this.remoteUrls.pushObject(record);
        }
      } catch (error) {
        this.hasRemoteUrlErrors = true;
      }
    }
  }

  isRemoteDataObject(subject) {
    const remoteDataObjectType = new rdflib.NamedNode(
      'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#RemoteDataObject'
    );
    return (
      this.storeOptions.store.match(
        subject,
        RDF('type'),
        remoteDataObjectType,
        this.storeOptions.sourceGraph
      ).length > 0
    );
  }

  async loadRemoteDataObjectRecord(remoteObjectUri) {
    const remoteUrls = await this.store.query('remote-url', {
      'filter[:uri:]': remoteObjectUri.value,
      page: { size: 1 },
    });
    if (remoteUrls.length) {
      return remoteUrls.firstObject;
    } else {
      throw `No remote-url could be found for ${remoteObjectUri}`;
    }
  }
}
