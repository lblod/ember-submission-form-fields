import { A } from '@ember/array';
import { warn } from '@ember/debug';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { RDF, FORM, triplesForPath } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';
import InputFieldComponent from '../input-field';

export default class FormInputFieldsFilesShowComponent extends InputFieldComponent {
  @service store;
  @tracked files = A();

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
  }

  get containsRemoteUrls() {
    return (
      this.storeOptions.store.match(
        undefined,
        FORM('displayType'),
        new rdflib.NamedNode('http://lblod.data.gift/display-types/remoteUrls'),
        this.storeOptions.formGraph
      ).length > 0
    );
  }

  async loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);

    for (let uri of matches.values) {
      if (this.isFileDataObject(uri)) {
        const file = await this.retrieveFileField(uri);
        if (file) this.files.pushObject(file);
      }
    }
  }

  isFileDataObject(subject) {
    const fileDataObjectType = new rdflib.NamedNode(
      'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#FileDataObject'
    );
    return (
      this.storeOptions.store.match(
        subject,
        RDF('type'),
        fileDataObjectType,
        this.storeOptions.sourceGraph
      ).length > 0
    );
  }

  async retrieveFileField(uri) {
    try {
      const files = await this.store.query('file', {
        'filter[:uri:]': uri.value,
        page: { size: 1 },
      });
      const file = files.get('firstObject');
      if (file) return file;
      else return null;
    } catch (error) {
      warn(`Failed to retrieve file with URI ${uri}: ${JSON.stringify(error)}`);
      return null;
    }
  }
}
