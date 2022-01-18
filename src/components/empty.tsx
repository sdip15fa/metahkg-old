import { AccountCircle as AccountCircleIcon, Create as CreateIcon, Code as CodeIcon, Info as InfoIcon } from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { Link } from "react-router-dom";
export default function Empty() {
    const listitems = ["Create Topic", "About", "Source code"];
    const links = ["/create", "/about", "/source"];
    const icons: JSX.Element[] = [<CreateIcon />, <InfoIcon />, <CodeIcon />];
    return (
      <Paper sx={{ overflow: "auto", maxHeight: "100vh" }}>
          <div
            style={{
              width: "70vw",
              justifyContent: "center",
              alignItems: "center",
              display: 'flex'
            }}
          >
        <div style={{ margin: "50px", width: '100%' }}>
              <h1 style={{ color: "white" }}>Metahkg</h1>
              <List>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to={
                    localStorage.signedin
                      ? "/logout"
                      : `/signin?returnto=${window.location.pathname}`
                  }
                >
                  <ListItem button style={{ width: "100%" }}>
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
                    <ListItem button style={{ width: "100%" }}>
                      <ListItemIcon>{icons[index]}</ListItemIcon>
                      <ListItemText>{item}</ListItemText>
                    </ListItem>
                  </Link>
                ))}
              </List>
            </div>
          </div>
          </Paper>
    )
}