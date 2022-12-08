# @lblod/ember-submission-form-fields

This addon provides form and form-fields components to create and edit submissions.


## Compatibility

* Ember.js v3.28 or above
* Ember CLI v3.28 or above
* Node.js v14 or above
* ember-auto-import v2+


## Installation

```
ember install ember-submission-form-fields
```

Documentation
------------------------------------------------------------------------------
## spec
The spec is in status draft and may be downloaded [here](https://cloud.ruizdearcaute.com/s/dBf36c8XMQJTtrR)

## form model
### version 1
The old version of the form model may be downloaded [here](https://cloud.ruizdearcaute.com/s/XJ55FfzkjQdYKJY)
This is currently still a supported model.

### version 2 (TOBE)
The target model may be downloaded [here](https://cloud.ruizdearcaute.com/s/yz4LExENHLRfcFA)

### current implementation
The supported model is currently in transitory state. Not all new entities are fully implemented.
Where implementation is lacking, we fall back to the implementation of version 1.
This fallback is mainly related to the dynamic form fields.
If you want to have an overview of the blend, see [here](https://cloud.ruizdearcaute.com/s/dmNBPaBbkeFbeZG)

## Usage

### Registering new form field components

If your app wants to support display types that aren't supported by the built-in components you can use the `registerFormFields` util.

The utility accepts an array of objects with the following structure:
```ts
type FormFieldRegistration = {
  displayType: string;
  edit: Component;
  show?: Component;
}
```

The "show" component is optional. If it isn't provided we fall back to the edit component. This allows you to use a single component for both the "edit" and "show" states of the form which is useful when both variants aren't that much different. The custom component receive the same arguments as the built-in components so you can use `@show` if you need to conditional behavior based on the form state.

Registering components can be done wherever you want, as long as it's done before the form is being rendered.

> Note: It's not allowed to register components with a display type that's already handled by one of the built-in components.

#### Usage example

```js
import { registerFormFields } from '@lblod/ember-submission-form-fields';
import SomeFormFieldComponent from 'project/components/some-form-field-component';

registerFormFields([{
  displayType: 'http://some-display-type-uri',
  edit: SomeFormFieldComponent
}]);
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## Releasing a new version
We use [`release-it`](https://github.com/release-it/release-it) to handle our release flow and [`lerna-changelog`](https://github.com/lerna/lerna-changelog) to generate the changelog for that release.

### Prerequisites
- Both `release-it` and `lerna-changelog` require a Github [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to work properly.
- All PRs that need to show up in the changelog need a descriptive title and [correct label](https://github.com/lerna/lerna-changelog).

### Previewing the changelog (optional)
If you want to preview the changelog that will be generated before starting the release flow you can run the following command:

`GITHUB_AUTH=your-access-token npx lerna-changelog`

### Creating a new release
Simply run `GITHUB_AUTH=your-access-token npm run release` and follow the prompts.

After the new tag is created and pushed Drone will take care of publishing the package to npm.


## License

This project is licensed under the [MIT License](LICENSE.md).
