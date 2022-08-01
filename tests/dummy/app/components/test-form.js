import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { NamedNode } from 'rdflib';

const FORM_GRAPHS = {
  formGraph: new NamedNode('http://data.lblod.info/form'),
  metaGraph: new NamedNode('http://data.lblod.info/metagraph'),
  sourceGraph: new NamedNode(`http://data.lblod.info/sourcegraph`),
};

const SOURCE_NODE = new NamedNode(
  'http://ember-submission-form-fields/source-node'
);

export default class TestFormComponent extends Component {
  @service formConfig;

  graphs = FORM_GRAPHS;
  sourceNode = SOURCE_NODE;
}
