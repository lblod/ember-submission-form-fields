import SimpleInputFieldComponent from '../simple-value-input-field';

import fetch from 'fetch';
import clipboardy from 'clipboardy';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';

/**
 *
 * DEVELOPER NOTES:
 *  This component has been build to work in tandem with <a href="https://github.com/lblod/case-number-service">case-number-service</a>.
 *
 *  This means that for this component to work, there needs to be an endpoint `/case-number-generator/generate` exposed on the back-end
 *  that returns a response conform to what is documented <a href="https://github.com/lblod/case-number-service#response">here</a>.
 *
 *  Example TTL:
 *
 *  ```
 *  fields:82e06728-0654-4038-803f-babaa45bf042 a form:Field ;
 *  mu:uuid "82e06728-0654-4038-803f-babaa45bf042";
 *  sh:name "Dossiernummer" ;
 *  sh:order 19 ;
 *  sh:path nie:identifier ;
 *  form:validations
 *    [ a form:RequiredConstraint ;
 *    form:grouping form:Bag ;
 *    sh:resultMessage "Dit veld is verplicht."@nl;
 *    sh:path nie:identifier
 *    ] ;
 *  form:options  """{"prefix" : "S2020-"}""" ;
 *  form:help "Dit nummer werd uniek gegenereerd voor uw dossier" ;
 *  form:displayType displayTypes:caseNumber ;
 *  sh:group fields:d93dfe7a-a668-4a49-a77f-981433f49ba1 .
 *  ```
 *
 */
export default class FormInputFieldsCaseNumberEditComponent extends SimpleInputFieldComponent {
  id = 'case-number-' + guidFor(this);

  @tracked error;

  get showAlert(){
    return this.error && !this.value
  }

  loadProvidedValue() {
    super.loadProvidedValue();
    if (!this.value) {
      this.setRandomCaseNumber();
    }
  }

  setRandomCaseNumber() {
    const options = JSON.parse(this.args.field.options);
    let url = `/case-number-generator/generate?node=${this.storeOptions.sourceNode.value}`;
    if (options.prefix) {
      url = url + `&prefix=${options.prefix}`;
    }
    fetch(url, {method: 'POST'}).then(async response => {
      if (response.ok) {
        this.value = (await response.json())[0];
        this.updateValue(this.value);
      } else {
        /**
         * NOTE: if we get here, we assume something went wrong with the request.
         */
        this.error = response;
      }
    }).catch(error => this.error = error);
  }

  @action
  copy() {
    clipboardy.write(this.value);
  }

}
