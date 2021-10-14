/**
 * Simple customizable confirmation dialog available to child components.
 *
 * A simple confirmation dialog is often needed in various places but no one likes to
 * use the native `confirm()` method. By using this provider in combination with
 * `useConfirmationDialog` you can reuse the same dialog in all child components without
 * having to synchronise the dialog state or content externally.
 *
 * @copyright: B1 Systems GmbH <info@b1-systems.de>, 2021
 * @license LGPLv3+, http://www.gnu.org/licenses/lgpl-3.0.html
 * @author Tilman Lüttje <luettje@b1-systems.de>, 2021
 */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ReactNode, createContext, useContext, useState } from "react";

interface ConfirmProps {
  title?: string;
  msg: string | ReactNode;
  onConfirm(): void;
  onCancel?(): void;
}

interface ContextProps {
  confirm(props: ConfirmProps): void;
}

const ConfirmationDialogContext = createContext<ContextProps | undefined>(undefined);
interface Props {
  title?: string;
  cancel: string;
  confirm: string;
  children: ReactNode;
}

const ConfirmationDialog = (props: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [onCancelFunc, setOnCancelFunc] = useState<(() => void) | undefined>(undefined);
  const [onConfirmFunc, setOnConfirmFunc] = useState<() => void>(() => () => {});
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState<string | ReactNode>("");

  const confirm = (confirmProps: ConfirmProps) => {
    // check whether the dialog is already in use
    if (dialogOpen) {
      throw new Error("The dialog is already in use");
    }
    // reset actions and content
    setOnConfirmFunc(() => () => {});
    setOnCancelFunc(undefined);
    setTitle(props.title || "");
    // no need to override `msg` since it has to be passed through `confirmProps`

    // apply passed props and show dialog
    setOnConfirmFunc(() => confirmProps.onConfirm);
    setOnCancelFunc(() => confirmProps?.onCancel);
    setTitle(confirmProps.title || "");
    setMsg(confirmProps.msg);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    onCancelFunc && onCancelFunc();
  };

  return (
    <ConfirmationDialogContext.Provider value={{ confirm }}>
      <Dialog open={dialogOpen} onClose={handleClose}>
        {(title || props.title) && <DialogTitle>{title || props.title}</DialogTitle>}
        <DialogContent>
          <DialogContentText>{msg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{props.cancel}</Button>
          <Button
            onClick={() => {
              onConfirmFunc();
              setDialogOpen(false);
            }}
            autoFocus
          >
            {props.confirm}
          </Button>
        </DialogActions>
      </Dialog>
      {props.children}
    </ConfirmationDialogContext.Provider>
  );
};

const useConfirmationDialog = () => {
  const context = useContext(ConfirmationDialogContext);

  if (context === undefined) {
    throw new Error("useConfirmationDialog must be used within a ConfirmationDialog");
  }

  return context;
};

export { ConfirmationDialog, useConfirmationDialog };
