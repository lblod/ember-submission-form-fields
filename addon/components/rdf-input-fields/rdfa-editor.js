import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';

export default class RdfaEditorComponent extends SimpleInputFieldComponent {
  editor;
  inputId = 'richtext-' + guidFor(this);
  plugins = ['citaten-plugin', 'standard-template'];
  @action
  handleRdfaEditorInit(editor) {
    this.editor = editor;
    editor.setHtmlContent(this.value ? this.value : '');
  }

  @action
  updateValue(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const editorValue = this.editor.htmlContent;
    super.updateValue(editorValue);
  }
  get editorOptions() {
    return (
      this.args.editorOptions ?? {
        showToggleRdfaAnnotations: Boolean(this.args.showToggleRdfaAnnotations),
        showInsertButton: false,
        showRdfa: true,
        showRdfaHighlight: true,
        showRdfaHover: true,
        showPaper: true,
        showSidebar: true,
      }
    );
  }

  get toolbarOptions() {
    return (
      this.args.toolbarOptions ?? {
        showTextStyleButtons: true,
        showListButtons: true,
        showIndentButtons: true,
      }
    );
  }

  get documentContext() {
    if (this.args.editorDocument) {
      try {
        return JSON.parse(this.args.editorDocument.context);
      } catch (e) {
        console.warn(
          'Error encountered during parsing of document context. ' +
            'Reverting to default context.',
          e
        );
      }
    }
    return {
      prefix: this.args.prefix ?? '',
      typeof: '',
      vocab: '',
    };
  }

  get vocab() {
    return this.documentContext['vocab'];
  }

  get plugins() {
    return this.args.plugins ? this.args.plugins : [];
  }

  /**
   * this is a workaround because emberjs does not allow us to assign the prefix attribute in the template
   * see https://github.com/emberjs/ember.js/issues/19369
   */
  @action
  setPrefix(element) {
    element.setAttribute(
      'prefix',
      this.prefixToAttrString(this.documentContext.prefix)
    );
  }

  prefixToAttrString(prefix) {
    let attrString = '';
    Object.keys(prefix).forEach((key) => {
      let uri = prefix[key];
      attrString += `${key}: ${uri} `;
    });
    return attrString;
  }
}
