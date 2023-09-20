# @lblod/ember-submission-form-fields

This addon provides form and form-fields components to create and edit submissions.


## Compatibility

* Ember.js v3.28 or above
* Ember CLI v3.28 or above
* Node.js v14 or above
* ember-auto-import v2+


## Installation

```
ember install @lblod/ember-submission-form-fields
```

## Documentation
### spec
The spec is in status draft and may be downloaded [here](https://cloud.ruizdearcaute.com/s/dBf36c8XMQJTtrR)

### form model
#### version 1
The old version of the form model may be downloaded [here](https://cloud.ruizdearcaute.com/s/XJ55FfzkjQdYKJY)
This is currently still a supported model.

#### version 2 (TOBE)
The target model may be downloaded [here](https://cloud.ruizdearcaute.com/s/yz4LExENHLRfcFA)

#### current implementation
The supported model is currently in transitory state. Not all new entities are fully implemented.
Where implementation is lacking, we fall back to the implementation of version 1.
This fallback is mainly related to the dynamic form fields.
If you want to have an overview of the blend, see [here](https://cloud.ruizdearcaute.com/s/dmNBPaBbkeFbeZG)

### Example forms
The addon contains a test app that includes some example forms which can provide a lot of insights in to how to use the form configs.
To start the test app simply run `npm run start`.

The example form config files can be found [here](https://github.com/lblod/ember-submission-form-fields/tree/3ed7941cb2ac392e866de8d593d965bdedaf6210/tests/dummy/public/test-forms).

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
We use [`release-it`](https://github.com/release-it/release-it) to handle our release flow 

### Prerequisites
- All PRs that need to show up in the changelog need a descriptive title and [correct label].

### Generating the changelog (optional)
At the moment the changelog is updated manually. To make this a bit easier you can generate a basic changelog based on the merged PRs with [`lerna-changelog`](https://github.com/lerna/lerna-changelog).

> `lerna-changelog` requires a Github [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to work properly.

The following command can  be used to generate the changelog:

`GITHUB_AUTH=your-access-token npx lerna-changelog`

### Creating a new release
Simply run `npm run release` and follow the prompts.

> If you generated the changelog using lerna-changelog you can add it to the changelog file and add it to the staged changes when release-it asks if you want to commit the changes. This will ensure that the changelog change is part of the release commit.

After the new tag is created and pushed CI will take care of publishing the package to npm.


## License

This project is licensed under the [MIT License](LICENSE.md).
