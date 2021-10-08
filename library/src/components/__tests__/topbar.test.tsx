import { shallow } from "enzyme";
import renderer from "react-test-renderer";

import TopBar, { NotificationHistory } from "../topbar";

it("should render consistently with minimal arguments", () => {
  const tree = renderer.create(<TopBar />).toJSON();
  expect(tree).toMatchSnapshot();
});

describe("Correct functionality", () => {
  const simplestTopbar = <TopBar applicationTitle="My Test Application" />;
  const simplestTopbarShallow = shallow(simplestTopbar);
  it("should show the passed application title", () => {
    expect(simplestTopbarShallow.text()).toEqual("My Test Application");
  });
  it("Should show no notificationHistory if not requested", () => {
    expect(
      simplestTopbarShallow.containsMatchingElement(
        <NotificationHistory
          pastNotifications=""
          noNotificationsYet=""
          createdAtFormat={(_) => ""}
        />,
      ),
    ).toEqual(false);
  });
});
