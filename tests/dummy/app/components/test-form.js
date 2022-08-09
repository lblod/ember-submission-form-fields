import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import rdflib from 'browser-rdflib';

const FORM_GRAPHS = {
  formGraph: new rdflib.NamedNode('http://data.lblod.info/form'),
  metaGraph: new rdflib.NamedNode('http://data.lblod.info/metagraph'),
  sourceGraph: new rdflib.NamedNode(`http://data.lblod.info/sourcegraph`),
};

const SOURCE_NODE = new rdflib.NamedNode(
  'http://ember-submission-form-fields/source-node'
);

export default class TestFormComponent extends Component {
  @service formConfig;

  graphs = FORM_GRAPHS;
  sourceNode = SOURCE_NODE;
}
