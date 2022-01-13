import React from "react";
import {
  Box,
  List,
  ListItem,
  Drawer,
  Divider,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Create as CreateIcon,
  Info as InfoIcon,
  Code as CodeIcon,
  ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
export default function SideBar() {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer =
    (o: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(o);
    };
  const links = ["/about", "/source"];
  return (
    <div>
      <div>
        <IconButton
          sx={{ height: "40px", width: "40px" }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon style={{ color: "white" }} />
        </IconButton>
      </div>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to={
                localStorage.signedin
                  ? "/logout"
                  : `/signin?returnto=${window.location.pathname}`
              }
            >
              <ListItem button>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText>
                  {localStorage.signedin ? "Logout" : "Sign in / Register"}
                </ListItemText>
              </ListItem>
            </Link>
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/create"
            >
              <ListItem button>
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText>Create topic</ListItemText>
              </ListItem>
            </Link>
          </List>
          <Divider />
          <List>
            {["About", "Source code"].map((text, index) => (
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to={links[index]}
              >
                <ListItem button key={text}>
                  <ListItemIcon>
                    {index === 0 ? <InfoIcon /> : <CodeIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
            ))}
          </List>
          {localStorage.signedin ? (
            <div>
              <Divider />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ManageAccountsIcon />
                  </ListItemIcon>
                  <ListItemText>{localStorage.user}</ListItemText>
                </ListItem>
              </List>
            </div>
          ) : (
            <div />
          )}
        </Box>
      </Drawer>
    </div>
  );
}
