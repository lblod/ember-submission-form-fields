import InputFieldComponent from '../input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
  triplesForPath,
  validationResultsForFieldPart,
  addSimpleFormValue,
  removeSimpleFormValue,
} from '@lblod/submission-form-helpers';
import { RDF, NIE } from '@lblod/submission-form-helpers';
import { NamedNode, Namespace } from 'rdflib';
import { v4 as uuidv4 } from 'uuid';
import { guidFor } from '@ember/object/internals';
import { autofocus } from '../../../-private/modifiers/autofocus';
import HelpText from '@lblod/ember-submission-form-fields/components/private/help-text';

const REMOTE_URI_TEMPLATE = 'http://data.lblod.info/remote-url/';
const REQUEST_HEADER = new NamedNode(
  'http://data.lblod.info/request-headers/29b14d06-e584-45d6-828a-ce1f0c018a8e',
);

const RPIO_HTTP = new Namespace(
  'http://redpencil.data.gift/vocabularies/http/',
);
const MU = new Namespace('http://mu.semte.ch/vocabularies/core/');

class RemoteUrl {
  @tracked errors = [];
  @tracked address;

  constructor({ uuid, uri, address, errors }) {
    this.uuid = uuid;
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
  autofocus = autofocus;
  HelpText = HelpText;

  get inputFor() {
    if (this.remoteUrls.length) {
      return `${this.inputId}-${this.remoteUrls.length - 1}`;
    }
    return this.inputId;
  }

  @tracked remoteUrls = [];
  @tracked remoteUrlToFocus = null;

  observerLabel = `remote-urls-${guidFor(this)}`; // Could have used uuidv4, but more consistent accross components

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
    this.args.formStore.registerObserver(
      this.onStoreUpdate.bind(this),
      this.observerLabel,
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
    return this.remoteUrls.some((url) => url.isInvalid);
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    let persistedUrls = [];

    for (let uri of matches.values) {
      if (this.isRemoteDataObject(uri)) {
        const remoteUrl = this.retrieveRemoteDataObject(uri);
        persistedUrls.push(remoteUrl);
      }
    }

    this.remoteUrls = persistedUrls;
  }

  isRemoteDataObject(subject) {
    const remoteDataObjectType = new NamedNode(
      'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#RemoteDataObject',
    );
    return (
      this.storeOptions.store.match(
        subject,
        RDF('type'),
        remoteDataObjectType,
        this.storeOptions.sourceGraph,
      ).length > 0
    );
  }

  retrieveRemoteDataObject(uri) {
    const urlTriples = this.storeOptions.store.match(
      uri,
      NIE('url'),
      undefined,
      this.storeOptions.sourceGraph,
    );

    if (urlTriples.length) {
      const address = urlTriples[0].object.value;
      const errors = this.validationErrorsForAddress(address).map(
        (e) => e.resultMessage,
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
      this.storeOptions.sourceGraph,
    );
    if (remoteObjecTs.length) {
      this.storeOptions.store.removeStatements(remoteObjecTs);
    }
    removeSimpleFormValue(new NamedNode(uri), this.storeOptions); // remove hasPart
  }

  insertRemoteDataObject({ uuid, uri, address }) {
    const triples = [
      {
        subject: uri,
        predicate: RDF('type'),
        object: new NamedNode(
          'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#RemoteDataObject',
        ),
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: uri,
        predicate: MU('uuid'),
        object: uuid,
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
    const uuid = uuidv4();
    const remoteUrl = new RemoteUrl({
      uuid,
      uri: new NamedNode(REMOTE_URI_TEMPLATE + `${uuid}`),
      address: '',
      errors: [],
    });

    this.remoteUrlToFocus = remoteUrl;
    this.remoteUrls = [...this.remoteUrls, remoteUrl];
  }

  @action
  updateRemoteUrl(remoteUrl, event) {
    remoteUrl.address = event.target.value.trim();
    const address = remoteUrl.address;
    this.removeRemoteDataObject(remoteUrl.uri);
    this.insertRemoteDataObject({
      uuid: remoteUrl.uuid,
      uri: remoteUrl.uri,
      address,
    });
    this.hasBeenFocused = true;
    const errors = this.validationErrorsForAddress(address).map(
      (e) => e.resultMessage,
    );
    remoteUrl.errors = errors; // update validations specific for the address
    // general validation of the field is handled by onStoreUpdate()
  }

  @action
  removeRemoteUrl(remoteUrlToRemove) {
    this.removeRemoteDataObject(remoteUrlToRemove.uri);
    this.remoteUrls = this.remoteUrls.filter(
      (remoteUrl) => remoteUrl !== remoteUrlToRemove,
    );
    this.hasBeenFocused = true;
    // general validation of the field is handled by onStoreUpdate()
  }

  validationErrorsForAddress(address) {
    return validationResultsForFieldPart(
      { values: [{ value: address }] },
      this.args.field.uri,
      this.storeOptions,
    ).filter((r) => !r.valid);
  }
}
