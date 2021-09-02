import { shallow } from "enzyme";
import renderer from "react-test-renderer";

import TopBar, { NotificationHistory } from "../topbar";

it("should render correctly", () => {
  const tree = renderer
    .create(<TopBar menuEntries={[]} notificationHistory={false} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

describe("Correct functionality", () => {
  const wrapper = shallow(
    <TopBar
      menuEntries={[]}
      applicationTitle="My Test Application"
      notificationHistory={false}
    />,
  );
  it("should show the passed application title", () => {
    expect(wrapper.text()).toEqual("My Test Application");
  });
  it("Should show no notificationHistory if not requested", () => {
    expect(
      wrapper.containsMatchingElement(
        <NotificationHistory
          pastNotifications=""
          noNotificationsYet=""
          createdAtFormat={(_) => ""}
        />,
      ),
    ).toEqual(false);
  });
});
