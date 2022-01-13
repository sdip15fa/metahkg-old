import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  Create as CreateIcon,
  Info as InfoIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import { isMobile } from "react-device-detect";
import { useParams } from "react-router";
import Menu from "../components/menu";
import { Link } from "react-router-dom";
export default function Category() {
  const listitems = ["Create Topic", "About", "Source code"];
  const links = ["/create", "/about", "/source"];
  const icons: JSX.Element[] = [<CreateIcon />, <InfoIcon />, <CodeIcon />];
  const params = useParams();
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ width: isMobile ? "100vw" : "30vw" }}>
        <Menu id={0} category={Number(params.category)} />
      </div>
      {!isMobile ? (
        <Paper sx={{ overflow: "auto", maxHeight: "100vh" }}>
          <div
            style={{
              width: "70vw",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ margin: "50px" }}>
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
      ) : (
        <div />
      )}
    </Box>
  );
}
