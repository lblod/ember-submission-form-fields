import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import Component from '@glimmer/component';
import {
    generatorsForNode,
    triplesForGenerator, triplesForScope
} from '@lblod/submission-form-helpers';
import { getRootNodeForm, getSubFormsForNode } from '../utils/model-factory';
import rdflib from 'browser-rdflib';

export default class ListingComponent extends Component {
  @tracked subForms = A();
  scope = null;

  get formStore() {
    return this.args.formStore;
  }

  get graphs() {
    return this.args.graphs;
  }

  get sourceNode() {
    return this.args.sourceNode;
  }

  get listing() {
    return this.args.listing;
  }

  constructor() {
    super(...arguments);
    this.scope = triplesForScope(
      this.listing.rdflibScope,
      {
        store: this.formStore,
        formGrah: this.graphs.formGraph,
        sourceNode: this.sourceNode,
        sourceGraph: this.graphs.sourceGraph
      }
    );

    this.renderSubForms(this.scope, {
      store: this.formStore,
      graphs: this.graphs,
      listing: this.listing
    });
  }

  renderSubForms(scope, { store, graphs, listing }) {
    let allSubForms = [];
    for (const sourceNode of scope.values) {
      //TODO: we need a way to order subforms. And probably multiple ways
      const subForms = getSubFormsForNode({
        store: store,
        graphs: graphs,
        node: listing.uri,
        sourceNode
      });
      this.subForms.pushObjects(subForms);
    }
  }

  @action
  addEntry() {
    const triples = this.runGenerator();
    this.formStore.addAll(triples);

    this.scope = triplesForScope(
      this.listing.rdflibScope,
      {
        store: this.formStore,
        formGrah: this.graphs.formGraph,
        sourceNode: this.sourceNode,
        sourceGraph: this.graphs.sourceGraph
      }
    );

    this.renderSubForms(this.scope, {
      store: this.formStore,
      graphs: this.graphs,
      listing: this.listing
    });
  }

  runGenerator() {
    const generators = generatorsForNode(this.listing.uri,
                                         { store: this.formStore, formGraph: this.graphs.formGraph });

    let allTriples = [];
    for(const generator of generators.createGenerators) {
      const dataset = triplesForGenerator(generator,
                                          { store: this.formStore, formGraph: this.graphs.formGraph });

      const triples = this.attachGeneratedTriples(dataset);
      allTriples = [ ...allTriples, ...triples ];
    }

    return allTriples;
  }


  attachGeneratedTriples( dataset ){
    //TODO: probably this type of boilerplate should be residing elsewhere
    const allTriples = dataset.triples.map(t => {return {...t, graph: this.graphs.sourceGraph }; });
    const shacl = new rdflib.Namespace('http://www.w3.org/ns/shacl#');
    const path = this.formStore.any(this.listing.rdflibScope, shacl("path"), undefined, this.graphs.formGraph);
    if(path.termType === "Collection"){
      const firstHop = path.elements[0];

    }
    else {
      for(const targetNode of dataset.sourceNodes){
        allTriples.push({
          subject: this.sourceNode,
          predicate: path,
          object: targetNode,
          graph: this.graphs.sourceGraph
        });
      }
    }
    return allTriples;
  }
}
