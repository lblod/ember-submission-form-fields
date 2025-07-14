# @lblod/ember-submission-form-fields

This addon provides form and form-fields components to create and edit submissions. In-depth information, usage instructions, and comprehensive details about ember-submission-form-fields can be found in the [Wiki](https://github.com/lblod/ember-submission-form-fields/wiki).

## Compatibility

* Ember.js v5.12 or above
* Ember CLI v5.12 or above
* ember-auto-import v2+


## Installation

```
npm install --save-dev @lblod/ember-submission-form-fields
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
