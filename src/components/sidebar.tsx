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
  Typography,
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
import { useNavigate } from "react-router";
import SearchBar from "./searchbar";
export default function SideBar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const categories = {
    "1": "Chit-chat",
    "2": "Stories",
    "3": "School",
    "4": "Admin",
    "5": "Leisure",
    "6": "IT",
  };
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
  let tempq = "";
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
        <Box sx={{ width: 250 }} role="presentation">
          <div
            style={{
              marginTop: "20px",
              maxWidth: "100%",
              width: "100%",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <SearchBar
              onChange={(e) => {
                tempq = e.target.value;
              }}
              onKeyPress={(e: any) => {
                if (e.key === "Enter" && tempq) {
                  if (window.location.pathname === "/search") {
                    window.location.replace(
                      `/search?q=${encodeURIComponent(tempq)}`
                    );
                  } else {
                    navigate(`/search?q=${encodeURIComponent(tempq)}`);
                  }
                }
              }}
            />
          </div>
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
          <div style={{ margin: "20px" }}>
            {Object.entries(categories).map((category: [string, string]) => (
              <Link
                to={`/category/${category[0]}`}
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                  textAlign: "left",
                  width: "50%",
                }}
              >
                <Typography
                  className="catlink"
                  sx={{ color: "white", fontSize: "16px", lineHeight: "35px" }}
                >
                  {category[1]}
                </Typography>
              </Link>
            ))}
          </div>
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
