import "./css/empty.css";
import React from "react";
import {
  AccountCircle as AccountCircleIcon,
  Create as CreateIcon,
  Code as CodeIcon,
  Telegram as TelegramIcon,
  ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import MetahkgLogo from "./logo";
/*
 * just a template for large screens if there's no content
 * e.g. /category/:id, in which there's no main content but only the menu
 */
export default function Empty() {
  const links: { logo: JSX.Element; title: string; link: string }[] = [
    {
      logo: <CreateIcon />,
      title: "Create topic",
      link: "/create",
    },
    {
      logo: <TelegramIcon />,
      title: "Telegram group",
      link: "/telegram",
    },
    {
      logo: <CodeIcon />,
      title: "Source code",
      link: "/source",
    },
  ];
  return (
    <Paper
      className="overflow-auto justify-center flex empty-paper"
      sx={{
        bgcolor: "parmary.dark",
      }}
    >
      <div className="fullwidth empty-main-div">
        <div className="flex align-center">
          <MetahkgLogo height={40} width={50} svg light />
          <h1>Metahkg</h1>
        </div>
        <List>
          <Link
            className="notextdecoration white"
            to={`/${
              localStorage.user ? "logout" : "signin"
            }?returnto=${encodeURIComponent(
              window.location.href.replace(window.location.origin, "")
            )}`}
          >
            <ListItem button className="fullwidth">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText>
                {localStorage.user ? "Logout" : "Sign in / Register"}
              </ListItemText>
            </ListItem>
          </Link>
          {localStorage.user && (
            <Link to="/profile/self" className="notextdecoration white">
              <ListItem button className="fullwidth">
                <ListItemIcon>
                  <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText>{localStorage.user}</ListItemText>
              </ListItem>
            </Link>
          )}
          {links.map((i) => (
            <Link className="notextdecoration white" to={i.link}>
              <ListItem button className="fullwidth">
                <ListItemIcon>{i.logo}</ListItemIcon>
                <ListItemText>{i.title}</ListItemText>
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
    </Paper>
  );
}
