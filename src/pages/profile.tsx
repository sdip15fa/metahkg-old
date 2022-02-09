import React from "react";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router";
import {
  useData,
  useMenu,
  useProfile,
  useSearch,
  useSelected,
  useTitle,
} from "../components/MenuProvider";
import UploadAvatar from "../components/uploadavatar";
import { timetoword_long } from "../lib/common";
import { Link } from "react-router-dom";
import { useHistory, useWidth } from "../components/ContextProvider";
/*
 * ProfileMenu returns posts that a user has posted
 * Renders a Menu without any threads if the user has posted nothing
 * Used in /profile/:id (if width >= 750) and /history/:id (id width < 750)
 */
function DataTable(props: { user: any }) {
  const tablerows = ["Posts", "Sex", "Admin", "Joined"];
  const items = [
    props.user.count,
    props.user.sex,
    props.user?.admin ? "yes" : "no",
    `${timetoword_long(props.user.createdAt)} ago`,
  ];
  return (
    <TableContainer
      sx={{ marginLeft: "50px", marginRight: "50px" }}
      component={Paper}
    >
      <Table sx={{ width: "100%" }} aria-label="simple table">
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ fontSize: "16px" }}>
                {tablerows[index]}
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontSize: "16px" }}>
                {item}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default function Profile() {
  const params = useParams();
  const [profile, setProfile] = useProfile();
  const [search, setSearch] = useSearch();
  const [user, setUser] = useState<any>({});
  const [menu, setMenu] = useMenu();
  const [width] = useWidth();
  const [, setData] = useData();
  const [, setTitle] = useTitle();
  const [selected, setSelected] = useSelected();
  function fetch() {
    axios.get(`/api/profile/${Number(params.id) || "self"}`).then((res) => {
      setUser(res.data);
      document.title = `${res.data.user} | METAHKG`;
    });
  }
  function cleardata() {
    setData([]);
    setTitle("");
    selected && setSelected(0);
  }
  const [history, setHistory] = useHistory();
  history !== window.location.pathname && setHistory(window.location.pathname);
  if (!menu && !(width < 760)) {
    setMenu(true);
  } else if (menu && width < 760) {
    setMenu(false);
  }
  if (profile !== (Number(params.id) || "self")) {
    setProfile(Number(params.id) || "self");
    cleardata();
  }
  if (search) {
    setSearch(false);
    cleardata();
  }
  !Object.keys(user).length && fetch();
  return (
    <div>
      <Box
        sx={{
          backgroundColor: "primary.dark",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {!Object.keys(user).length ? (
          <LinearProgress sx={{ width: "100%" }} color="secondary" />
        ) : (
          user?.[0] !== 404 && (
            <Paper sx={{ maxHeight: "100vh", overflow: "auto" }}>
              <Box
                sx={{
                  backgroundColor: "primary.dark",
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: width < 760 ? "100vw" : "70vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={
                      user?.avatar ||
                      "https://metahkg.s3.amazonaws.com/avatars/noavatar.png"
                    }
                    alt="User avatar"
                  />
                  <br />
                  <div
                    style={{
                      marginLeft: "20px",
                      height: "200px",
                      display: "flex",
                      flexDirection: params.id === "self" ? "column" : "row",
                    }}
                  >
                    <h1
                      style={{
                        color: "white",
                        fontSize: "30px",
                        alignSelf: "center",
                        paddingTop: params.id === "self" ? "50px" : "0px",
                        wordBreak: "break-all",
                        maxWidth:
                          width < 760
                            ? "calc(100vw - 260px)"
                            : "calc(70vw - 260px)",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        lineHeight: "35px",
                        maxHeight: "35px",
                      }}
                    >
                      <span
                        style={{
                          color: user.sex === "male" ? "#34aadc" : "red",
                        }}
                      >
                        {user.user}
                      </span>{" "}
                      #{user.id}
                    </h1>
                    <div
                      style={{
                        alignSelf: "flex-start",
                        marginTop: params.id === "self" ? "10px" : "0px",
                      }}
                    >
                      {params.id === "self" && <UploadAvatar />}
                    </div>
                  </div>
                </Box>
                <Box
                  sx={{
                    marginTop: "20px",
                    maxWidth: "100%",
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <DataTable user={user} />
                </Box>
                {width < 760 && (
                  <div style={{ marginTop: "20px" }}>
                    <Link
                      to={`/history/${params.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        sx={{ fontSize: "16px" }}
                        variant="text"
                        color="secondary"
                      >
                        View History
                      </Button>
                    </Link>
                  </div>
                )}
              </Box>
            </Paper>
          )
        )}
      </Box>
    </div>
  );
}
