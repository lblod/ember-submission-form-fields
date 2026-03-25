import Route from '@ember/routing/route';
import { ForkingStore } from '@lblod/ember-submission-form-fields';
import { NamedNode, Namespace } from 'rdflib';

const FORM_GRAPHS = {
  formGraph: new NamedNode('http://data.lblod.info/form'),
  metaGraph: new NamedNode('http://data.lblod.info/metagraph'),
  sourceGraph: new NamedNode(`http://data.lblod.info/sourcegraph`),
};

const SOURCE_NODE = new NamedNode(
  'http://ember-submission-form-fields/source-node',
);

const FORM = new Namespace('http://lblod.data.gift/vocabularies/forms/');
const RDF = new Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

const FORM_TITLES = {
  'basic-fields': 'Basic form fields',
  'climate-subsidy-costs-table': 'Climate subsidy costs table',
  'plan-living-together': 'Plan living together table',
  'scoped-fields': 'Scoped fields',
  validations: 'Validation examples',
};

export default class FormRoute extends Route {
  async model({ formName }) {
    let [formTtl, metaTtl, dataTtl] = await Promise.all([
      fetchForm(formName),
      fetchFormMeta(formName),
      fetchFormData(formName),
    ]);

    let formStore = new ForkingStore();
    formStore.parse(formTtl, FORM_GRAPHS.formGraph, 'text/turtle');
    formStore.parse(metaTtl, FORM_GRAPHS.metaGraph, 'text/turtle');
    formStore.parse(dataTtl, FORM_GRAPHS.sourceGraph, 'text/turtle');

    let form = formStore.any(
      undefined,
      RDF('type'),
      FORM('Form'),
      FORM_GRAPHS.formGraph,
    );

    this.form = form;
    this.formStore = formStore;
    return {
      formName,
      form,
      formStore,
      title: FORM_TITLES[formName],
      graphs: FORM_GRAPHS,
      sourceNode: SOURCE_NODE,
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.datasetTriples = [];
    controller.registerObserver();
    controller.setTriplesForTables();
  }
}

async function fetchForm(formName) {
  let response = await fetch(getFormDataPath(formName, 'form.ttl'));
  let ttl = await response.text();

  return ttl;
}

async function fetchFormMeta(formName) {
  let response = await fetch(getFormDataPath(formName, 'meta.ttl'));
  if (response.status >= 200 && response.status < 300) {
    return await response.text();
  }
  return '';
}

async function fetchFormData(formName) {
  let response = await fetch(getFormDataPath(formName, 'data.ttl'));
  if (response.status >= 200 && response.status < 300) {
    return await response.text();
  }
  return '';
}

function getFormDataPath(formName, fileName) {
  return `/test-forms/${formName}/${fileName}`;
}
