import { LogoutOutlined } from "@mui/icons-material";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import MenuIcon from "@mui/icons-material/Menu";
import TranslateIcon from "@mui/icons-material/Translate";
/*
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
  Menu,
  MenuItem,
  Paper,
  Popover,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
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
export const NotificationHistory = (props: NotificationHistoryProps) => {
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
      <Tooltip title={props.pastNotifications}>
        <IconButton
          aria-label="menu"
          onClick={handleToastHistoryClick}
          size="large"
          color="inherit"
        >
          <CircleNotificationsIcon />
        </IconButton>
      </Tooltip>
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
            pastNotifications
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((notification, index) => (
                <Alert severity={notification.severity} sx={{ m: 1 }} key={index}>
                  <AlertTitle>
                    {props.createdAtFormat(notification.createdAt)}
                  </AlertTitle>
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
interface LanguageMenuProps {
  // Defaults to 'Change language'
  changeLanguage?: string;
  entries: { key: string; display: string }[];
  // The key of the currently active language, if passed highlighting is enabled
  currentLanguage: string;
  onLanguageChange(key: string): void;
}
interface Props {
  menuEntries?: Array<MenuEntry>;
  logoutAction?(): void;
  notificationHistory?: NotificationHistoryProps;
  applicationTitle?: string | ReactNode;
  languageMenu?: LanguageMenuProps;
}

const TopBar = (props: Props) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(menuAnchorEl ? null : event.currentTarget);
  };

  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const languageMenuOpen = Boolean(languageMenuAnchorEl);
  const handleLanguageMenuClick = (event: MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchorEl(languageMenuAnchorEl ? null : event.currentTarget);
  };

  const [currentLanguage, setCurrentLanguage] = useState(
    props.languageMenu?.currentLanguage,
  );

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {props.menuEntries !== undefined && props.menuEntries.length !== 0 && (
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
          {props.languageMenu && (
            <>
              <Tooltip title={props.languageMenu.changeLanguage || "Change language"}>
                <IconButton color="inherit" onClick={handleLanguageMenuClick}>
                  <TranslateIcon />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={languageMenuAnchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={languageMenuOpen}
                onClose={() => setLanguageMenuAnchorEl(null)}
              >
                {props.languageMenu.entries.map((entry) => (
                  <MenuItem
                    key={entry.key}
                    selected={entry.key === currentLanguage}
                    onClick={() => {
                      if (entry.key !== currentLanguage) {
                        // `languageMenu` cannot be undefined, otherwise this would not be rendered
                        (props.languageMenu as LanguageMenuProps).onLanguageChange(
                          entry.key,
                        );
                        setCurrentLanguage(entry.key);
                      }
                      setLanguageMenuAnchorEl(null);
                    }}
                  >
                    {entry.display}
                  </MenuItem>
                ))}
              </Menu>
            </>
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
