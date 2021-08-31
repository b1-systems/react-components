/**
 * Simple Popover menu containing a dynamic number of categories and entries.
 *
 * @copyright: B1 Systems GmbH <info@b1-systems.de>, 2021
 * @license LGPLv3+, http://www.gnu.org/licenses/lgpl-3.0.html
 * @author Tilman Lüttje <luettje@b1-systems.de>, 2021
 */
import { Link, Paper } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { MenuEntry } from "./types";

interface Props {
  open: boolean;
  anchorElement: HTMLElement | null;
  setAnchorElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  menuEntries: Array<MenuEntry>;
}
interface LinkProps {
  target: "_self" | "_blank";
  href: string;
}

const MenuPopover = (props: Props) => {
  const handleclose = () => {
    props.setAnchorElement(null);
  };

  const buildLink = (entry: MenuEntry) => {
    if (!entry.nonReactRouting) {
      return (
        // we need to close the menu manually since we're routing inside the web application
        <Link
          color="inherit"
          component={RouterLink}
          to={entry.targetUrl}
          onClick={handleclose}
          underline="hover"
        >
          {entry.caption}
        </Link>
      );
    }
    const props: LinkProps = {
      target: "_self",
      href: entry.targetUrl,
    };
    switch (entry.action) {
      case "newtab":
        props["target"] = "_blank";
        break;
      case "other":
        // TODO implement "run the specified action through the dispatcher"
        props["target"] = "_self";
    }

    return (
      <Link {...props} color="inherit" underline="hover">
        {entry.caption}
      </Link>
    );
  };

  const buildMenuGrid = (menuEntries: Array<MenuEntry>) => {
    let subentriesByParent = new Map<string, Array<MenuEntry>>();
    let topEntries: Array<MenuEntry> = [];
    menuEntries.forEach((el) => {
      if (!el.parent) {
        topEntries.push(el);
        return;
      }
      if (!subentriesByParent.has(el.parent)) {
        subentriesByParent.set(el.parent, [el]);
      } else {
        // @ts-ignore cannot be undefined due to the previous case
        subentriesByParent.get(el.parent).push(el);
      }
    });
    return (
      <Grid container spacing={4} sx={{ minWidth: 400 }}>
        {topEntries.map((topEntry) => (
          <Grid item xs={6} key={topEntry.entryId}>
            <Typography variant="h6" gutterBottom color="primary">
              {buildLink(topEntry)}
            </Typography>
            {(subentriesByParent.get(topEntry.entryId) || []).map((subEntry) => (
              <Typography
                key={subEntry.entryId}
                variant="body2"
                gutterBottom
                color="secondary"
              >
                {buildLink(subEntry)}
              </Typography>
            ))}
          </Grid>
        ))}
      </Grid>
    );
  };
  const menuGrid = buildMenuGrid(props.menuEntries);

  return (
    <Popover
      sx={{
        // hide scrollbar
        overflow: "hidden",
      }}
      open={props.open}
      anchorEl={props.anchorElement}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={handleclose}
      disableRestoreFocus
    >
      <Paper elevation={0} sx={{ p: 2 }}>
        {menuGrid}
      </Paper>
    </Popover>
  );
};
export default MenuPopover;
