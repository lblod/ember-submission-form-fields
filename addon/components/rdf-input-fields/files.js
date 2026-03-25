import { A } from '@ember/array';
import { warn } from '@ember/debug';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import HelpText from '@lblod/ember-submission-form-fields/components/private/help-text';
import {
  addSimpleFormValue,
  FORM,
  triplesForPath,
  RDF,
  removeDatasetForSimpleFormValue,
} from '@lblod/submission-form-helpers';
import { downloadZip } from 'client-zip';
import { task, dropTask } from 'ember-concurrency';
import { NamedNode } from 'rdflib';
import { triggerZipDownload } from '../../-private/utils/download';

class FileField {
  @tracked errors = [];

  constructor({ record, errors }) {
    this.record = record;
    this.errors = errors;
  }

  get isValid() {
    return this.errors.length == 0;
  }

  get isInvalid() {
    return !this.isValid;
  }
}

export default class RdfInputFieldsFilesComponent extends InputFieldComponent {
  @service store;
  @service toaster;
  @tracked files = A();
  inputId = `files-${guidFor(this)}`; // TODO for now this doesn't work on the <AuFileUpload /> component.
  HelpText = HelpText;

  constructor() {
    super(...arguments);
    this.loadProvidedValue.perform();
    this.args.formStore.registerObserver(
      this.onStoreUpdate.bind(this),
      this.inputId,
    );
  }

  get canDownloadZip() {
    if (!this.args.show || this.loadProvidedValue.isRunning) {
      return false;
    }

    return this.files.length > 1;
  }

  get containsRemoteUrls() {
    return (
      this.storeOptions.store.match(
        undefined,
        FORM('displayType'),
        new NamedNode('http://lblod.data.gift/display-types/remoteUrls'),
        this.storeOptions.formGraph,
      ).length > 0
    );
  }

  willDestroy() {
    this.storeOptions.store.deregisterObserver(this.inputId);
  }

  // The validation of this fields depends on the value of other fields,
  // hence we recalculate the validation on notification of a change in the store
  onStoreUpdate() {
    super.updateValidations();
  }

  loadProvidedValue = task(async () => {
    const matches = triplesForPath(this.storeOptions);

    for (let uri of matches.values) {
      if (this.isFileDataObject(uri)) {
        const file = await this.retrieveFileField(uri);
        this.files.pushObject(file);
      }
    }
  });

  isFileDataObject(subject) {
    const fileDataObjectType = new NamedNode(
      'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#FileDataObject',
    );
    return (
      this.storeOptions.store.match(
        subject,
        RDF('type'),
        fileDataObjectType,
        this.storeOptions.sourceGraph,
      ).length > 0
    );
  }

  async retrieveFileField(uri) {
    try {
      const files = await this.store.query('file', {
        'filter[:uri:]': uri.value,
        page: { size: 1 },
      });
      const file = files[0];
      if (file) return new FileField({ record: file, errors: [] });
      else
        return new FileField({
          record: null,
          errors: ['Geen bestand gevonden'],
        });
    } catch (error) {
      warn(`Failed to retrieve file with URI ${uri}: ${JSON.stringify(error)}`);
      return new FileField({
        record: null,
        errors: ['Ophalen van het bestand is mislukt'],
      });
    }
  }

  insertFileDataObject(fileUri) {
    const fileDataObjectType = new NamedNode(
      'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#FileDataObject',
    );
    const typeT = {
      subject: new NamedNode(fileUri),
      predicate: RDF('type'),
      object: fileDataObjectType,
      graph: this.storeOptions.sourceGraph,
    };
    this.storeOptions.store.addAll([typeT]);
    addSimpleFormValue(new NamedNode(fileUri), this.storeOptions);
  }

  removeFileDataObject(fileUri) {
    const fileDataObjectType = new NamedNode(
      'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#FileDataObject',
    );
    const typeT = {
      subject: new NamedNode(fileUri),
      predicate: RDF('type'),
      object: fileDataObjectType,
      graph: this.storeOptions.sourceGraph,
    };
    this.storeOptions.store.removeStatements([typeT]);
    removeDatasetForSimpleFormValue(new NamedNode(fileUri), this.storeOptions);
  }

  @action
  async addFile(fileId) {
    let file = await this.store.findRecord('file', fileId);
    this.insertFileDataObject(file.uri);
    this.files.pushObject(new FileField({ record: file, errors: [] }));
    this.hasBeenFocused = true;
    // general validation of the field is handled by onStoreUpdate()
  }

  @action
  async removeFile(file) {
    const fileField = this.files.find(
      (f) => f.record && f.record.uri == file.uri,
    );
    this.removeFileDataObject(file.uri);
    try {
      // Remove the uploaded file metadata
      await file.destroyRecord();
    } catch (error) {
      // should probably be silently logged in later implementations
    }
    this.hasBeenFocused = true;
    this.files.removeObject(fileField);
    // general validation of the field is handled by onStoreUpdate()
  }

  downloadAsZip = dropTask(async () => {
    const promises = this.files.map((file) => {
      return fetch(file.record.downloadLink).then((response) => {
        if (!response.ok) {
          throw new Error(
            `Something went wrong while trying to download '${file.record.downloadLink}': ${response.status} ${response.statusText}`,
          );
        }

        return response;
      });
    });

    try {
      const files = await Promise.all(promises);
      const zipBlob = await downloadZip(files).blob();
      triggerZipDownload(zipBlob, 'gebundelde-bestanden.zip');
    } catch (error) {
      console.error(error);
      this.toaster.error(
        'Het .zip bestand kon niet gegenereerd worden. Probeer later opnieuw.',
      );
    }
  });
}
