import React from "react";
import {
  AccountCircle as AccountCircleIcon,
  Create as CreateIcon,
  Code as CodeIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
/*
 * just a template for large screens if there's no content
 * e.g. /category/:id, in which there's no main content but only the menu
 */
export default function Empty() {
  const listitems = ["Create Topic", "About", "Source code"];
  const links = ["/create", "/about", "/source"];
  const icons: JSX.Element[] = [<CreateIcon />, <InfoIcon />, <CodeIcon />];
  return (
    <Paper sx={{ overflow: "auto", maxHeight: "100vh" }}>
      <Box
        sx={{
          width: "70vw",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          backgroundColor: "parmary.dark",
        }}
      >
        <div style={{ margin: "50px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              className="svgwhite"
              height="40px"
              width="50px"
              src="/logo.svg"
              alt="Metahkg"
            />
            <h1 style={{ color: "white" }}>Metahkg</h1>
          </div>
          <List>
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to={`/${localStorage.signedin ? "logout" : "signin"}?returnto=${
                window.location.pathname
              }`}
            >
              <ListItem button sx={{ width: "100%" }}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText>
                  {localStorage.signedin ? "Logout" : "Sign in / Register"}
                </ListItemText>
              </ListItem>
            </Link>
            {listitems.map((item, index) => (
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to={links[index]}
              >
                <ListItem button sx={{ width: "100%" }}>
                  <ListItemIcon>{icons[index]}</ListItemIcon>
                  <ListItemText>{item}</ListItemText>
                </ListItem>
              </Link>
            ))}
          </List>
        </div>
      </Box>
    </Paper>
  );
}
