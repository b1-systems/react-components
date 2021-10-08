import { MenuEntry, Toastyfier, TopBar, useToasty } from "@b1-systems/react-components";
import {
  AlertColor,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { BrowserRouter, Route, Link as RouterLink, Switch } from "react-router-dom";

const NotificationButtons = () => {
  const { toasty } = useToasty();
  return (
    <Grid container justifyContent="space-evenly">
      {["success", "info", "warning", "error"].map((severity, index) => (
        <Button
          key={index}
          variant="contained"
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
    </Grid>
  );
};

const menuEntries: Array<MenuEntry> = [
  {
    entryId: "subpage1_category",
    type: "entry",
    parent: "",
    caption: "Category 1",
    action: "router",
    targetUrl: "/subpage1",
    icon: "",
  },
  {
    entryId: "subpage1_entry",
    type: "entry",
    parent: "subpage1_category",
    caption: "Entry 1",
    action: "router",
    targetUrl: "/subpage1",
    icon: "",
  },
  {
    entryId: "mainpage",
    type: "entry",
    parent: "",
    caption: "Mainpage",
    action: "router",
    targetUrl: "/",
    icon: "",
  },
];

const DemoApp = () => {
  const { toasty } = useToasty();
  const [demoLanguage, setDemoLanguage] = useState<"de" | "en">("en");
  const demoLanguageEntries = [];
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <TopBar
          menuEntries={menuEntries}
          logoutAction={() => toasty.success("Logout complete!")}
          applicationTitle={
            <Link component={RouterLink} to="/" color="inherit">
              Demo Application
            </Link>
          }
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
          <Switch>
            <Route path="/" exact>
              <Typography gutterBottom textAlign="center" variant="h2" component="h4">
                {/* Insert the call to your i18n lib/framework here */}
                {demoLanguage === "en" ? "Main page" : "Hauptseite"}
              </Typography>
              <NotificationButtons />
            </Route>
            <Route path="/subpage1" exact>
              <Typography gutterBottom textAlign="center" variant="h2" component="h4">
                Subpage 1
              </Typography>
              <NotificationButtons />
            </Route>
          </Switch>
        </Container>
      </Box>
    </>
  );
};

function App() {
  return (
    <Toastyfier position={"bottom-right"} gutter={8}>
      <BrowserRouter>
        <DemoApp />
      </BrowserRouter>
    </Toastyfier>
  );
}

export default App;
