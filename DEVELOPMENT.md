# Development

This repository uses
[_workspaces_](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to share the
dependencies of the library and the demo application. A simple `npm install`
inside the root directory is enough.

## Setup

You'll need the following packages for contributing:

- make
- [`pre-commit`](https://pre-commit.com/)

Run `make setup` to enable the pre-commit hook.

The demo application (`react-components-example`) serves two purposes:

1. Presenting the existing components with some code to copy-paste.
2. Instantly see your changes when you're making changes to the library.

Run the following commands in two separate terminals to see you library changes
live:

- `$ make run-demo`
- `$ make libbuild-dev`

The last command watches the library directory for any changes and
incrementally "compiles" the changed files to `dist/esm/` and thanks to the
symlink inside the `library` directory `make run-demo` can use the produced
files directly.
