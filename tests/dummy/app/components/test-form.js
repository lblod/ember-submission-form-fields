import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { ForkingStore } from '@lblod/ember-submission-form-fields';
import rdflib from 'browser-rdflib';
import { task } from 'ember-concurrency';

const FORM_GRAPHS = {
  formGraph: new rdflib.NamedNode('http://data.lblod.info/form'),
  metaGraph: new rdflib.NamedNode('http://data.lblod.info/metagraph'),
  sourceGraph: new rdflib.NamedNode(`http://data.lblod.info/sourcegraph`),
};

const SOURCE_NODE = new rdflib.NamedNode(
  'http://ember-submission-form-fields/source-node'
);

const FORM = new rdflib.Namespace('http://lblod.data.gift/vocabularies/forms/');
const RDF = new rdflib.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

export default class TestFormComponent extends Component {
  @tracked form;
  @tracked formStore;
  graphs = FORM_GRAPHS;
  sourceNode = SOURCE_NODE;

  constructor() {
    super(...arguments);

    this.loadFormData.perform();
  }

  @task
  *loadFormData() {
    let formName = this.args.name;

    let [formTtl, metaTtl] = yield Promise.all([
      fetchForm(formName),
      fetchFormMeta(formName),
    ]);

    let formStore = new ForkingStore();
    formStore.parse(formTtl, FORM_GRAPHS.formGraph, 'text/turtle');
    formStore.parse(metaTtl, FORM_GRAPHS.metaGraph, 'text/turtle');

    let form = formStore.any(
      undefined,
      RDF('type'),
      FORM('Form'),
      FORM_GRAPHS.formGraph
    );

    this.form = form;
    this.formStore = formStore;
  }
}

async function fetchForm(formName) {
  let response = await fetch(getFormDataPath(formName, 'form.ttl'));
  let ttl = await response.text();

  return ttl;
}

async function fetchFormMeta(formName) {
  let response = await fetch(getFormDataPath(formName, 'meta.ttl'));
  let ttl = await response.text();

  return ttl;
}

function getFormDataPath(formName, fileName) {
  return `/test-forms/${formName}/${fileName}`;
}
