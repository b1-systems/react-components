import { Toastyfier, TopBar, useToasty } from "@b1-systems/react-components";
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
} from "@material-ui/core";
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
            toasty(`${severity.toUpperCase()} notification`, severity as AlertColor)
          }
        >
          {`${severity.toUpperCase()} notification`}
        </Button>
      ))}
    </Grid>
  );
};

const DemoApp = () => {
  const { toasty } = useToasty();
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <TopBar
          menuEntries={[]}
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
        />
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container>
          <br />
          <Switch>
            <Route path="/" exact>
              <Typography gutterBottom textAlign="center" variant="h2" component="h4">
                Main page
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
