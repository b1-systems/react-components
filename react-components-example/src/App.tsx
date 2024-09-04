import {
  ConfirmationDialog,
  Toastyfier,
  TopBar,
  useConfirmationDialog,
  useToasty,
} from "@b1-systems/react-components";
import {
  type AlertColor,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid2,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { BrowserRouter, Route, Link as RouterLink, Routes } from "react-router-dom";

const NotificationButtons = () => {
  const { toasty } = useToasty();
  return (
    <Grid2 container justifyContent="space-evenly">
      {["success", "info", "warning", "error"].map((severity) => (
        <Button
          key={severity}
          variant="contained"
          sx={{ m: 2 }}
          // @ts-ignore
          color={severity}
          onClick={() =>
            toasty(`${severity.toUpperCase()} notification`, severity as AlertColor, {
              close: true,
            })
          }
        >
          {`${severity.toUpperCase()} notification`}
        </Button>
      ))}
    </Grid2>
  );
};

const DemoApp = () => {
  const { toasty } = useToasty();
  const { confirm } = useConfirmationDialog();
  const [demoLanguage, setDemoLanguage] = useState<"de" | "en">("en");

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <TopBar
          menuOnClick={() => toasty.success("Open your menu, eg Drawer, ")}
          logoutAction={() => toasty.success("Logout complete!")}
          applicationTitle={
            <Link component={RouterLink} to="/" color="inherit">
              Demo Application
            </Link>
          }
          helpLink={"https://github.com/b1-systems/react-components"}
          notificationHistory={{
            pastNotifications: "Past Notifications",
            noNotificationsYet: "No notifications yet",
            createdAtFormat: (v: number) => new Date(v).toString(),
          }}
          languageMenu={{
            entries: [
              { key: "de", display: "Deutsch" },
              { key: "en", display: "English" },
            ],
            // showCurrentLanguageInsteadOfIcon: true,
            onLanguageChange: (key: string) => {
              const msg =
                key === "en" ? "Switched to English" : "Sprache auf Deutsch gestellt";
              toasty.success(msg);
              // Call your libs function here
              setDemoLanguage(key as "de" | "en");
            },
            currentLanguage: "en",
          }}
        />
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container>
          <br />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Typography
                    gutterBottom
                    textAlign="center"
                    variant="h2"
                    component="h4"
                  >
                    {/* Insert the call to your i18n lib/framework here */}
                    {demoLanguage === "en" ? "Main page" : "Hauptseite"}
                  </Typography>
                  <NotificationButtons />
                </>
              }
            />
            <Route
              path="/subpage1"
              element={
                <>
                  <Typography
                    gutterBottom
                    textAlign="center"
                    variant="h2"
                    component="h4"
                  >
                    Subpage 1
                  </Typography>
                  <NotificationButtons />
                </>
              }
            />
          </Routes>
          <br />
          <Grid2 container justifyContent="space-evenly">
            <Button
              variant="contained"
              onClick={() =>
                confirm({
                  msg: `Are you sure you want to proceed? If so, simply press Enter. The
                  dialog will only close once the onConfirm function has finished. This
                  one for example will sleep for 2 seconds. While this happens the
                  Cancel button is deactivated and the confirm button turns into a
                  spinner.`,
                  onConfirm: () =>
                    new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
                      toasty.success("Confirmation successful");
                    }),
                  onCancel: () =>
                    Promise.resolve(toasty.warning("Dialog cancelled or dismissed")),
                })
              }
            >
              Confirmation Dialog
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                confirm({
                  title: (
                    <Typography color="blue">Custom title for this dialog</Typography>
                  ),
                  msg: (
                    <>
                      <Typography variant="h4">A styled message</Typography>
                      <Typography variant="body2">
                        The title is different from the default one and no `onCancel`
                        has been passed
                      </Typography>
                    </>
                  ),
                  onConfirm: () =>
                    Promise.resolve(toasty.success("Confirmation successful again")),
                })
              }
            >
              Confirmation Dialog with custom title
            </Button>
          </Grid2>
        </Container>
      </Box>
    </>
  );
};

function App() {
  return (
    <Toastyfier position={"top-right"} gutter={8}>
      <BrowserRouter>
        <ConfirmationDialog
          cancel="Cancel"
          confirm="Confirm"
          title="Confirmation required"
        >
          <DemoApp />
        </ConfirmationDialog>
      </BrowserRouter>
    </Toastyfier>
  );
}

export default App;
