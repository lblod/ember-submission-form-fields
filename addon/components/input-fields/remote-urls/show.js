import AbstractInputFieldComponent from '../abstract-input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { triplesForPath } from '../../../utils/import-triples-for-form';

import { RDF } from '../../../utils/namespaces';
import rdflib from 'browser-rdflib';

export default class FormInputFieldsFilesShowComponent extends AbstractInputFieldComponent {
  @service store

  @tracked remoteUrls = []

  @action
  async loadData() {
    super.loadData();
    await this.loadProvidedValue();
  }

  async loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);

    for (let uri of matches.values) {
      try {
        if(this.isRemoteDataObject(uri)) {
          const record = await this.loadRemoteDataObjectRecord(uri);
          this.remoteUrls.pushObject(record);
        }
      } catch (error) {
        this.errors.pushObject({resultMessage : "Er ging iets fout bij het ophalen van de addressen."});
      }
    }
  }

  isRemoteDataObject(subject){
    const remoteDataObjectType = new rdflib.NamedNode('http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#RemoteDataObject');
    return this.storeOptions.store.match(subject,
                                         RDF('type'),
                                         remoteDataObjectType,
                                         this.storeOptions.sourceGraph).length > 0;
  }

  async loadRemoteDataObjectRecord(remoteObjectUri) {
    const remoteUrls = await this.store.query('remote-url', {
      'filter[:uri:]': remoteObjectUri.value,
      page: { size: 1 }
    });
    if (remoteUrls.length) {
      return remoteUrls.get('firstObject');
    } else {
      throw `No remote-url could be found for ${remoteObjectUri}`;
    }
  }
}
