import Component from '@glimmer/component';
import isLast from '@lblod/ember-submission-form-fields/-private/helpers/is-last';
import SubForm from '../sub-form';

export default class List extends Component {
  isLast = isLast;
  SubForm = SubForm;
}
