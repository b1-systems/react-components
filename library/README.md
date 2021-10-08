# Component documentation

The following components are available:

## Topbar

A standard MUI AppBar with the following props:

- `menuEntries`: If a non-empty array is passed it will be used to populate a Menu
  inside a Popover which is attached to a button on the top left. Not all properties of
  the `MenuEntry` type are already supported yet, take a look at the demo application
  for exact details.
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
provider component. It takes the following props:

- `position`: Where to show the notifications
- `gutter`: Gap between each notification/toast
- `slideDirection` (optional): In which directions the notifications should leave the
  screen. If not passed the default is chosen based on `position`.

Inside a `Toastyfier` you have access to the `useToasty()` hook which gives you access
to the following functions:

- `toasty`: Main function to show or dismiss notifications. Either call it directly with
  a severity of your choice or use one of the helper functions
  (`toasty.{success,info,warning,error}`). Pass `{close: true}` to enable a manual
  dismiss/close action on the notification.
- `pastNotifications`: An array of past notifications which is used to populate the
  Popover inside the Topbar.

## Directory layout

**Do not remove the `index.js` symlink**, it's what makes `make libbuild-dev` possible
in the first place. See `DEVELOPMENT.md` for a short explanation.
