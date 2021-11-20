# Random GoFood

## Quick Start

_If you want to contribute to this project, please fork this repository._

```
cd random-gofood
git checkout main
yarn
yarn start
```

Open at `localhost:3000`

Look for files in

- `src/App.js`

## Patching dependencies

We are patching `wired-elements` and `wired-elements-react`, because some of the requirements that we sought weren't available in these 2 libraries.

To apply the patches under the [patches](./patches) folder, do this in the root of this project:

```shell
yarn patch-package
```

To apply a new patch, go to the `node_modules` folder and find the package that you want to patch. Some tips when patching:

1. Remember that you need to patch the transpiled JavaScript files instead of TypeScript files.
2. Changing `node_modules` requires us to restart the development server, so the overall process might take some time, especially with trials and errors.
3. Remember to read the package's docs, package's GitHub issues, and other discussions (e.g. StackOverflow). They might save you some time.

After finishing your patch, let's say that you are patching something inside `wired-elements`, do this in the root of this project:

```shell
yarn patch-package wired-elements
```

## Contributing

If you would like to help us with this project you can learn about our initiative from [twitter](https://twitter.com/ans4175/status/1457313278015639553?s=20). Before you contribute to this project, please make sure to read our [CONTRIBUTING](CONTRIBUTING.md) file.

## Tech behind this app

You can learn more about tech stacks that we used by visiting their documentations.

- [React](https://reactjs.org/)
- [Wired](https://wiredjs.com/)
