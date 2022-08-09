/**
 * Small wrapper around the `react-hot-toast` package to display all
 * notifications as Material UI Alerts.
 *
 * By providing a React context we're able to store any notifications ever
 * displayed reliably which was not possible with `useToasterStore` from the
 * wrapped lib since it does only display the currently shown notifications and
 * extracting every one only once was unsuccessful.
 * The past notifications can be accessed as well, see `topbar.tsx` for an use
 * case.
 *
 * @copyright: B1 Systems GmbH <info@b1-systems.de>, 2021
 * @license LGPLv3+, http://www.gnu.org/licenses/lgpl-3.0.html
 * @author Tilman Lüttje <luettje@b1-systems.de>, 2021
 */
import { Alert, AlertColor, Box, Slide } from "@mui/material";
import { CSSProperties, ReactNode, createContext, useContext, useState } from "react";
import { Toast, ToastPosition, Toaster, toast } from "react-hot-toast";
interface PastNotification {
  msg: string;
  severity: AlertColor;
  createdAt: number;
}

interface ToastyFunction {
  (msg: string, severity: AlertColor, props?: ToastyProps): string;
  error(msg: string, props?: ToastyProps): string;
  info(msg: string, props?: ToastyProps): string;
  success(msg: string, props?: ToastyProps): string;
  warning(msg: string, props?: ToastyProps): string;
}

interface ToastyContext {
  toasty: ToastyFunction;
  pastNotifications: Array<PastNotification>;
}

const NotificationContext = createContext<ToastyContext | undefined>(undefined);

interface ToastyProps {
  close?: boolean;
}

type SlideDirection = "down" | "left" | "right" | "up";

// most of the entries are taken from 'ToasterProps' from 'react-hot-toast'
interface Props {
  position: ToastPosition;
  gutter: number;
  containerStyle?: CSSProperties;
  reverseOrder?: boolean;
  slideDirection?: SlideDirection;
  children: ReactNode;
}

const autoSlideDirection = (position: ToastPosition): SlideDirection => {
  switch (position) {
    case "bottom-left":
    case "top-left":
      return "right";
    case "bottom-right":
    case "top-right":
      return "left";
    case "top-center":
      return "down";
    case "bottom-center":
      return "up";
  }
  return "up";
};

const Toastyfier = (props: Props) => {
  const [pastNotifications, setPastNotifications] = useState<Array<PastNotification>>(
    [],
  );

  // Regarding the name... Take a look at the german author ;)
  const toasty = (
    msg: string,
    severity: AlertColor,
    toastyProps?: ToastyProps,
  ): string => {
    setPastNotifications([
      ...pastNotifications,
      { msg: msg, severity: severity, createdAt: new Date().getTime() },
    ]);
    return toast.custom((t: Toast) => (
      <Slide
        direction={props.slideDirection || autoSlideDirection(props.position)}
        in={t.visible}
      >
        <Box sx={{ boxShadow: 10 }}>
          <Alert
            variant="filled"
            sx={{ maxWidth: 400 }}
            severity={severity}
            onClose={toastyProps?.close ? () => toast.dismiss(t.id) : undefined}
          >
            {msg}
          </Alert>
        </Box>
      </Slide>
    ));
  };

  /**
   * Shows a success alert. Returns an ID which can be used for explicit removal.
   */
  toasty.success = (msg: string, props?: ToastyProps): string =>
    toasty(msg, "success", props);

  /**
   * Shows an info alert. Returns an ID which can be used for explicit removal.
   */
  toasty.info = (msg: string, props?: ToastyProps): string =>
    toasty(msg, "info", props);

  /**
   * Shows a warning alert. Returns an ID which can be used for explicit removal.
   */
  toasty.warning = (msg: string, props?: ToastyProps): string =>
    toasty(msg, "warning", props);

  /**
   * Shows an error alert. Returns an ID which can be used for explicit removal.
   */
  toasty.error = (msg: string, props?: ToastyProps): string =>
    toasty(msg, "error", props);

  /**
   * Dismiss a notification. Be aware that it triggers the exit animation and
   * does not remove the Toast instantly.
   */
  toasty.dismiss = toast.dismiss;

  /**
   * Remove an individual toast or all toasts instanstly.
   */
  toasty.remove = toast.remove;

  // Add additional top margin if the position contaisnt op and no custom
  // containerStyle is requested to accomodate for the TopBar
  let containerStyle = undefined;
  if (props.containerStyle) {
    containerStyle = props.containerStyle;
  } else if (props.position.includes("top")) {
    containerStyle = { top: 80 };
  }
  return (
    <NotificationContext.Provider value={{ pastNotifications, toasty }}>
      <Toaster
        position={props.position}
        gutter={props.gutter}
        reverseOrder={props.reverseOrder}
        containerStyle={containerStyle}
      />
      {props.children}
    </NotificationContext.Provider>
  );
};

const useToasty = () => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error("useToasty must be used within a Toastyfier");
  }

  return context;
};

export { Toastyfier, useToasty };
