import InputFieldComponent from '../input-field';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
  triplesForPath,
  validationResultsForFieldPart,
  addSimpleFormValue,
  removeSimpleFormValue,
} from '@lblod/submission-form-helpers';
import { RDF, NIE } from '@lblod/submission-form-helpers';
import { namedNode, NamedNode, Namespace } from 'rdflib';
import { v4 as uuidv4 } from 'uuid';
import { guidFor } from '@ember/object/internals';

const REMOTE_URI_TEMPLATE = 'http://data.lblod.info/remote-url/';
const REQUEST_HEADER = new namedNode(
  'http://data.lblod.info/request-headers/29b14d06-e584-45d6-828a-ce1f0c018a8e'
);

const RPIO_HTTP = new Namespace(
  'http://redpencil.data.gift/vocabularies/http/'
);

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
  inputId = `remote-urls-${guidFor(this)}`;

  get inputFor() {
    if (this.remoteUrls.length) {
      return `${this.inputId}-${this.remoteUrls.length - 1}`;
    }
    return this.inputId;
  }

  get requiredLabel(){
    return this.args.field.options.requiredLabel || "Voorkeur";
  }

  @tracked remoteUrls = A();

  observerLabel = `remote-urls-${guidFor(this)}`; // Could have used uuidv4, but more consistent accross components

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
    this.args.formStore.registerObserver(
      this.onStoreUpdate.bind(this),
      this.observerLabel
    );
  }

  willDestroy() {
    this.storeOptions.store.deregisterObserver(this.observerLabel);
  }

  // The validation of this fields depends on the value of other fields,
  // hence we recalculate the validation on notification of a change in the store
  onStoreUpdate() {
    super.updateValidations();
  }

  get hasInvalidRemoteUrl() {
    return this.remoteUrls.any((url) => url.isInvalid);
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

  isRemoteDataObject(subject) {
    const remoteDataObjectType = new NamedNode(
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

  retrieveRemoteDataObject(uri) {
    const urlTriples = this.storeOptions.store.match(
      uri,
      NIE('url'),
      undefined,
      this.storeOptions.sourceGraph
    );

    if (urlTriples.length) {
      const address = urlTriples[0].object.value;
      const errors = this.validationErrorsForAddress(address).map(
        (e) => e.resultMessage
      );

      if (urlTriples.length > 1)
        errors.push('Veld kan maximaal 1 URL bevatten');

      return new RemoteUrl({ uri, address, errors });
    } else {
      return new RemoteUrl({
        uri,
        address: null,
        errors: ['Dit veld is verplicht'],
      });
    }
  }

  removeRemoteDataObject(uri) {
    const remoteObjecTs = this.storeOptions.store.match(
      uri,
      undefined,
      undefined,
      this.storeOptions.sourceGraph
    );
    if (remoteObjecTs.length) {
      this.storeOptions.store.removeStatements(remoteObjecTs);
    }
    removeSimpleFormValue(new NamedNode(uri), this.storeOptions); // remove hasPart
  }

  insertRemoteDataObject({ uri, address }) {
    const triples = [
      {
        subject: uri,
        predicate: RDF('type'),
        object: new NamedNode(
          'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#RemoteDataObject'
        ),
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: uri,
        predicate: NIE('url'),
        object: address,
        graph: this.storeOptions.sourceGraph,
      },
      // Add request-header(s)
      {
        subject: uri,
        predicate: RPIO_HTTP('requestHeader'),
        object: REQUEST_HEADER,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.addAll(triples);
    addSimpleFormValue(uri, this.storeOptions); // add hasPart;
  }

  @action
  addUrlField() {
    this.remoteUrls.pushObject(
      new RemoteUrl({
        uri: new namedNode(REMOTE_URI_TEMPLATE + `${uuidv4()}`),
        address: '',
        errors: [],
      })
    );
  }

  @action
  updateRemoteUrl(remoteUrl) {
    const address = remoteUrl.address.trim();
    this.removeRemoteDataObject(remoteUrl.uri);
    this.insertRemoteDataObject({ uri: remoteUrl.uri, address });
    this.hasBeenFocused = true;
    const errors = this.validationErrorsForAddress(address).map(
      (e) => e.resultMessage
    );
    remoteUrl.errors = errors; // update validations specific for the address
    // general validation of the field is handled by onStoreUpdate()
  }

  @action
  removeRemoteUrl(current) {
    this.removeRemoteDataObject(current.uri);
    this.remoteUrls.removeObject(current);
    this.hasBeenFocused = true;
    // general validation of the field is handled by onStoreUpdate()
  }

  validationErrorsForAddress(address) {
    return validationResultsForFieldPart(
      { values: [{ value: address }] },
      this.args.field.uri,
      this.storeOptions
    ).filter((r) => !r.valid);
  }
}
