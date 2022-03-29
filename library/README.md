# Component documentation

The following components are available:

## Topbar

A standard MUI AppBar with the following props:

- `menuEntries` (incompatible with `menuOnClick`): If a non-empty array is passed it
  will be used to populate a Menu inside a Popover which is attached to a menu button on
  the top left. Not all properties of the `MenuEntry` type are already supported yet,
  take a look at the demo application for exact details.
- `menuOnClick(): void` (incompatible with `menuEntries`): Pass your own function to
  execute whenever the menu button is clicked.

  _Note_: If none of the above props is passed no menu button will be rendered at all

- `logoutAction(): void`: If passed a logout button is shown in the top right and the
  passed function will be called `onClick`.
- `applicationTitle`: A string or styled `ReactNode` to display the title of your
  application. Use the latter approach if you want it to be a link or add an icon.
- `notificationHistory:` An optional object with following props to show a history of
  all notifications in the top right. Requires the component to be inside a
  `Toastyfier`:
  - `pastNotifications`: Translation of "Past notifications"
  - `noNotificationsYet`: Translation of "No notifications yet"
  - `createdAtFormat(createdAt: number): string`: Function to format the timestamps
    (milliseconds) of the past notifications
- `languageMenu`: An optional object to enable a language menu in the top right:
  - `changeLanguage`: Optional string to show inside the tooltip of the icon button,
    defaults to 'Change language'
  - `entries`: Array of available languages, the value of `display` will be shown
  - `currentLanguage`: The key of the active language at the time of rendering, future
    changes will be tracked internally
  - `onLanguageChange(key: string):void`: Will be called with the `key` of the selected
    Language

## Notification handling

A wrapper around [`react-hot-toast`](https://github.com/timolins/react-hot-toast) to
render them as MUI Alerts and to provide a notification history.

To show notifications you need to encapsulate your components inside a `Toastyfier`
provider component. It takes the following props, of which most are directly passed
through to a [`Toaster`](https://react-hot-toast.com/docs/toaster):

- `position`: Where to show the notifications
- `gutter`: Gap between each notification/toast
- `slideDirection` (optional, not from `react-hot-toast`): In which directions the
  notifications should leave the screen. If not passed the default is chosen based on
  `position`.
- `reverseOrder` (optional): Whether to show the most recent notification at the bottom
- `containerStyle` (optional): Add additional `CSS` to every notification. Please notice
  that we set a default top-margin of 80 if you pass any `top-*` position to show the
  notifications below our `Topbar`. If you pass any custom styles via this prop this
  will not be applied and you have to manage everything yourself.

Inside a `Toastyfier` you have access to the `useToasty()` hook which gives you access
to the following functions:

- `toasty`: Main function to show or dismiss notifications. Either call it directly with
  a severity of your choice or use one of the helper functions
  (`toasty.{success,info,warning,error}`). Pass `{close: true}` to enable a manual
  dismiss/close action on the notification.
- `pastNotifications`: An array of past notifications which is used to populate the
  Popover inside the Topbar.

## Confirmation dialog

Creating a confirmation dialog over and over in different components can become very
frustrating since they are usually very similar to each other. Wouldn't it be nice if
you could simply pass your message and callback functions to a hook and let it handle
the dialog rendering, etc.? `ConfirmationDialog` and `useConfirmationDialog` to the
rescue!

First you insert a `ConfirmationDialog` somewhere up in your component hierarchy which
takes the following props:

- `cancel`: Text to display on the `Cancel` button
- `confirm`: Text to display on the `Confirm` button
- `title` (optional): A default title

Inside a child component you have access to the `useConfirmationDialog()` hook which
gives you access to the `confirm()` function which you call with an object:

- `onConfirm(): Promise<any>`: Function to call if the user clicked the `Confirm`
  button. Once the promises finishes either successful or with an error (we use
  `.finally`) the dialog closes. As long as `onConfirm` is running both buttons,
  `Cancel` and `Confirm`, are disabled and a spinner is shown on top of the latter. The
  code has been taken from
  [here](https://mui.com/components/progress/#interactive-integration=).
- `msg`: Text or `ReactNode` containing your message/question, e.g. "Really delete the
  contract?"
- `onCancel(): Promise<any>` (optional): Function to call if the user either clicked the
  `Cancel` button or outside of the dialog to dismiss it. The dialog closes once it has
  run through.
- `title` (optional): Title of the dialog, overrides the value passed to
  `ConfirmationDialog`

## Directory layout

**Do not remove the `index.js` symlink**, it's what makes `make libbuild-dev` possible
in the first place. See `DEVELOPMENT.md` for a short explanation.
