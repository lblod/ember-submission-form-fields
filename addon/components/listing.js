import { A } from '@ember/array';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import {
    generatorsForNode,
    triplesForGenerator, triplesForScope
} from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';
import { getSubFormsForNode } from '../utils/model-factory';

const SHACL = new rdflib.Namespace('http://www.w3.org/ns/shacl#');

export default class ListingComponent extends Component {
  @tracked subForms = A();
  pathConnection = {};
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
    this.updateScope();
    this.renderSubForms();
    this.setPathConnection();
  }

  @action
  addEntry() {
    const triples = this.runGenerator();
    this.formStore.addAll(triples);
    this.updateScope();
    this.renderSubForms();
  }

  @action
  removeEntry( entrySourceNode ) {
    //TODO: this is a simplified version. We need a spec on how to delete related resources and not to delete too much
    const triples = this.formStore.match(entrySourceNode, undefined, undefined, this.graphs.sourceGraph);
    if(!this.pathConnection.inverse) {
      triples.push({
        subject: this.sourceNode,
        predicate: this.pathConnection.pathSegment,
        object: entrySourceNode,
        graph: this.graphs.sourceGraph
      });
    }
    this.formStore.removeStatements(triples);
    this.updateScope();
    this.renderSubForms();
  }

  setPathConnection() {
    const path = this.formStore.any(this.listing.rdflibScope, SHACL("path"), undefined, this.graphs.formGraph);
    let pathSegment = path;
    if(pathSegment.termType === "Collection") {
      pathSegment = pathSegment.elements[0];
    }

    if (pathSegment.termType == "NamedNode") {
      this.pathConnection = { pathSegment: pathSegment };
    }
    else {
      const inversePath = this.formStore.any(pathSegment, SHACL("inversePath"), undefined, this.graphs.formGraph);
      this.pathConnection = { pathSegment: inversePath, inverse: true };
    }
  }

  updateScope() {
    this.scope = triplesForScope(
      this.listing.rdflibScope,
      {
        store: this.formStore,
        formGrah: this.graphs.formGraph,
        sourceNode: this.sourceNode,
        sourceGraph: this.graphs.sourceGraph
      }
    );
  }

  renderSubForms() {
    let subForms = [];

    //This is a simplified version of rendering the subforms. It misses the following:
    // - TODO: ordering of hasMany
    // - TODO: a listing might have multiple subforms; where different info can be respresented
    // - TODO: there is currently no specific 'create' form
    for (const sourceNode of this.scope.values) {
      //TODO: we need a way to order subforms. And probably multiple ways
      const subForm = getSubFormsForNode({
        store: this.formStore,
        graphs: this.graphs,
        node: this.listing.uri,
        sourceNode
      })[0];

      if(subForm)
        subForms.push(subForm);
    }

    // 2) calculate to be removed
    const deletes = this.subForms.filter(
      (rendered) => !subForms.find((child) => child.sourceNode.equals(rendered.sourceNode))
    );

    // 3) remove the "unwanted" children
    if (deletes.length) {
      this.subForms.removeObjects(deletes);
    }

    // 4) create a new list to render, merging already (rendered) children, with new children.
    // We don't want to re-render components, to avoid flickering behaviour and state loss.
    const mergedChildren = A();

    for (const child of subForms) {
      const existingField = this.subForms.find((eField) =>
        eField.sourceNode.equals(child.sourceNode)
      );
      if (existingField) {
        mergedChildren.pushObject(existingField);
      } else {
        mergedChildren.pushObject(child);
      }
    }

    this.subForms = mergedChildren;
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

  attachGeneratedTriples( dataset ) {
    //TODO: probably this type of boilerplate should be residing elsewhere
    const allTriples = dataset.triples.map(t => { return {...t, graph: this.graphs.sourceGraph }; });

    const { pathSegment, inverse }  = this.pathConnection;
    if(inverse){
      for(const targetNode of dataset.sourceNodes) {
        allTriples.push({
          subject: targetNode,
          predicate: pathSegment,
          object: this.sourceNode,
          graph: this.graphs.sourceGraph
        });
      }
    }
    else {
      for(const targetNode of dataset.sourceNodes) {
        allTriples.push({
          subject: this.sourceNode,
          predicate: pathSegment,
          object: targetNode,
          graph: this.graphs.sourceGraph
        });
      }
    }
    return allTriples;
  }
}
