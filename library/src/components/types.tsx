/**
 * @copyright: B1 Systems GmbH <info@b1-systems.de>, 2021
 * @license LGPLv3+, http://www.gnu.org/licenses/lgpl-3.0.html
 * @author Tilman Lüttje <luettje@b1-systems.de>, 2021
 */
export interface MenuEntry {
  entryId: string;
  type: "entry" | "search";
  parent: string;
  caption: string;
  action: "router" | "newtab" | "other";
  targetUrl: string;
  icon: string;
  // if the targetUrl is also part of the React application we can route inside the
  // frontend and prevent unnecessary reloads
  nonReactRouting?: boolean;
}
