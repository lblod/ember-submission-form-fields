import InputFieldComponent from '../input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
  triplesForPath,
  validationResultsForFieldPart,
  addSimpleFormValue,
  removeSimpleFormValue
} from '../../../../utils/import-triples-for-form';
import rdflib from 'browser-rdflib';
import { RDF, NIE } from '../../../../utils/namespaces';
import {v4 as uuidv4} from 'uuid';
import { guidFor } from '@ember/object/internals';

const REMOTE_URI_TEMPLATE = 'http://data.lblod.info/remote-url/';

class RemoteUrl {
  @tracked errors = [];

  constructor({ uri, address, errors }) {
    this.uri = uri;
    this.address = address;
    this.errors = errors;
  }

  get isValid() {
    return this.errors.length == 0;
  }

  get isInvalid() {
    return !this.isValid;
  }
}

export default class FormInputFieldsRemoteUrlsEditComponent extends InputFieldComponent {
  @tracked remoteUrls = [];

  observerLabel = `remote-urls-${guidFor(this)}` // Could have used uuidv4, but more consistent accross components

  constructor() {
    super(...arguments);
    this.args.formStore.registerObserver(this.onStoreUpdate.bind(this), this.observerLabel);
  }

  willDestroy(){
    this.storeOptions.store.deregisterObserver(this.observerLabel);
  }

  // The validation of this fields depends on the value of other fields,
  // hence we recalculate the validation on notification of a change in the store
  onStoreUpdate(){
    super.loadValidations();
  }

  get hasInvalidRemoteUrl() {
    return this.remoteUrls.any(url => url.isInvalid);
  }

  @action
  loadData() {
    super.loadData();
    this.loadProvidedValue();
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);

    for (let uri of matches.values) {
      if (this.isRemoteDataObject(uri)) {
        const remoteUrl = this.retrieveRemoteDataObject(uri);
        this.remoteUrls.pushObject(remoteUrl);
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

  retrieveRemoteDataObject(uri) {
    const urlTriples = this.storeOptions.store.match(uri, NIE('url'), undefined, this.storeOptions.sourceGraph);

    if (urlTriples.length) {
      const address = urlTriples[0].object.value;
      const errors = this.validationErrorsForAddress(address).map(e => e.resultMessage);

      if (urlTriples.length > 1)
        errors.push("Veld kan maximaal 1 URL bevatten");

      return new RemoteUrl({ uri, address, errors });
    } else {
      return new RemoteUrl({ uri, address: null, errors: ["Dit veld is verplicht"] });
    }
  }

  removeRemoteDataObject(uri){
    const remoteObjecTs = this.storeOptions.store.match(uri, undefined, undefined, this.storeOptions.sourceGraph);
    if (remoteObjecTs.length) {
      this.storeOptions.store.removeStatements(remoteObjecTs);
    }
    removeSimpleFormValue(new rdflib.NamedNode(uri), this.storeOptions); // remove hasPart
  }

  insertRemoteDataObject({ uri, address } ){
    const triples = [
      { subject: uri,
        predicate: RDF('type'),
        object: new rdflib.NamedNode('http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#RemoteDataObject'),
        graph: this.storeOptions.sourceGraph
      },
      {
        subject: uri,
        predicate: NIE('url'),
        object: address,
        graph: this.storeOptions.sourceGraph
      }
    ];
    this.storeOptions.store.addAll( triples );
    addSimpleFormValue(uri, this.storeOptions); // add hasPart;
  }

  @action
  addUrlField() {
    this.remoteUrls.pushObject(new RemoteUrl({
      uri: new rdflib.namedNode(REMOTE_URI_TEMPLATE + `${uuidv4()}`),
      address: '',
      errors: []
    }));
  }

  @action
  updateRemoteUrl(remoteUrl) {
    const address = remoteUrl.address.trim();
    this.removeRemoteDataObject( remoteUrl.uri );
    this.insertRemoteDataObject({ uri: remoteUrl.uri, address });
    this.hasBeenModified = true;
    const errors = this.validationErrorsForAddress(address).map(e => e.resultMessage);
    remoteUrl.errors = errors; // update validations specific for the address
    super.loadValidations(); // update validations of the form field in general
  }

  @action
  removeRemoteUrl(current) {
    this.removeRemoteDataObject(current.uri);
    this.remoteUrls.removeObject(current);
    this.hasBeenModified = true;
  }

  validationErrorsForAddress(address) {
    return validationResultsForFieldPart(
      { values: [{ value: address }] },
      this.args.field.uri,
      this.storeOptions).filter(r => !r.valid);
  }
}
