# React components collection

Loose collection of React components that will probably be split up further down the
road. Based on [_Material-UI_](https://material-ui.com).

## Available components

- Notification/toast management based on _Material-UI Alerts_ with access to all past
  notifications.
- Popover menu with support for multiple entries and categories.
- Topbar with multiple optional integrations, including the components/features
  mentioned above

## Demo application

The `react-components-example` contains a demo application to showcase the provided
components. Simply run `make run-demo`.

## Install

1. Insert the following content into `.npmrc` at the root of your project
   ```
   @b1-systems:registry=https://npm.pkg.github.com
   ```
2. Create a new personal access token (PAT) [here](https://github.com/settings/tokens)
   with `repo` and `read:packages` permissions and run
   `npm login --scope=@b1-systems --registry=https://npm.pkg.github.com`
3. Run `npm install @b1-systems/react-components`
