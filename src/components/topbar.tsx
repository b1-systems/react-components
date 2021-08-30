/*g
 * Simple Topbar with the following (mostly optional) features:
 *
 * - Application title as either a string or a finished node
 * - Popover menu based on `menuPopover.tsx`, see the corresponding file for
 *   more information
 * - Popover display of past notifications, requires the usage of `Toastyfier`
 *   from `notications.tsx`
 * - Logout-Button with custom action
 *
 * @copyright: B1 Systems GmbH <info@b1-systems.de>, 2021
 * @license LGPLv3+, http://www.gnu.org/licenses/lgpl-3.0.html
 * @author Tilman Lüttje <luettje@b1-systems.de>, 2021
 */
import {
  Alert,
  AlertTitle,
  AppBar,
  IconButton,
  Paper,
  Popover,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { LogoutOutlined } from "@material-ui/icons";
import CircleNotificationsIcon from "@material-ui/icons/CircleNotifications";
import MenuIcon from "@material-ui/icons/Menu";
import { MouseEvent, ReactNode, useState } from "react";

import { useToasty } from "../notifications";
import MenuPopover from "./menuPopover";
import { MenuEntry } from "./types";

interface NotificationHistoryProps {
  pastNotifications: string;
  noNotificationsYet: string;
  createdAtFormat(createdAt: number): string;
}

// Keeping this in a separate component supports usage of the `TopBar`
// component without the notifications since `useToasty` without the required
// context will throw an error
const NotificationHistory = (props: NotificationHistoryProps) => {
  const [toastHistoryAnchorEl, setToastHistoryAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const toastHistoryOpen = Boolean(toastHistoryAnchorEl);
  const handleToastHistoryClick = (event: MouseEvent<HTMLElement>) => {
    setToastHistoryAnchorEl(toastHistoryAnchorEl ? null : event.currentTarget);
  };

  const { pastNotifications } = useToasty();

  return (
    <>
      <IconButton
        aria-label="menu"
        onClick={handleToastHistoryClick}
        size="large"
        color="inherit"
      >
        <CircleNotificationsIcon />
      </IconButton>
      <Popover
        sx={{ maxHeight: "60%" }}
        open={toastHistoryOpen}
        anchorEl={toastHistoryAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => setToastHistoryAnchorEl(null)}
        disableRestoreFocus
      >
        <Paper elevation={0} sx={{ p: 1 }}>
          <Typography
            gutterBottom
            align="center"
            component="h2"
            variant="h4"
            sx={{ p: 1 }}
          >
            {props.pastNotifications}
          </Typography>
          {pastNotifications.length ? (
            pastNotifications.map((notification, index) => (
              <Alert
                severity={notification.severity}
                sx={{ m: 1, minWidth: 400 }}
                key={index}
              >
                <AlertTitle>{props.createdAtFormat(notification.createdAt)}</AlertTitle>
                {notification.msg}
              </Alert>
            ))
          ) : (
            <Typography align="center" sx={{ m: 5 }}>
              {props.noNotificationsYet}
            </Typography>
          )}
        </Paper>
      </Popover>
    </>
  );
};
interface Props {
  menuEntries: Array<MenuEntry>;
  logoutAction?(): void;
  notificationHistory: false | NotificationHistoryProps;
  applicationTitle?: string | ReactNode;
}

const TopBar = (props: Props) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(menuAnchorEl ? null : event.currentTarget);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {props.menuEntries && (
            <>
              <IconButton aria-label="menu" onClick={handleMenuClick} size="large">
                <MenuIcon />
              </IconButton>
              <MenuPopover
                open={menuOpen}
                anchorElement={menuAnchorEl}
                setAnchorElement={setMenuAnchorEl}
                menuEntries={props.menuEntries}
              />
            </>
          )}
          {props.applicationTitle && (
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              {props.applicationTitle}
            </Typography>
          )}
          {props.notificationHistory && (
            <NotificationHistory {...props.notificationHistory} />
          )}

          {props.logoutAction && (
            <IconButton
              color="inherit"
              size="large"
              aria-label="logout"
              onClick={props.logoutAction}
            >
              <LogoutOutlined />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default TopBar;
