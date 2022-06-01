import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import { tracked } from '@glimmer/tracking';

export default class RichTextComponent extends SimpleInputFieldComponent {
  @tracked editor;
  inputId = 'richtext-' + guidFor(this);
  plugins = [];
  get editorOptions() {
    return (
      this.args.editorOptions ?? {
        showToggleRdfaAnnotations: false,
        showInsertButton: false,
        showRdfa: false,
        showRdfaHighlight: false,
        showRdfaHover: false,
        showPaper: false,
        showSidebar: false,
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
}
