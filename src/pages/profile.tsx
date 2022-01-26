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
import Menu from "../components/menu";
import axios from "axios";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useParams } from "react-router";
import MenuThread from "../components/menu/thread";
import MenuTop from "../components/menu/top";
import { useMenu, useProfile, useSearch } from "../components/MenuProvider";
import UploadAvatar from "../components/uploadavatar";
import { timetoword_long } from "../lib/common";
import { Link } from "react-router-dom";
import { useHistory } from "../components/HistoryProvider";
export function ProfileMenu() {
  const [user, setUser] = useState("Metahkg");
  const [profile, setProfile] = useProfile();
  const [data, setData] = useState<any>([]);
  const [selected, setSelected] = useState(0);
  const buttons = ["Created", "Last Comment"];
  async function fetch() {
    await axios
      .get(
        `/api/history/${profile}?sort=${{ 0: "post", 1: "comments" }[selected]}`
      )
      .then((res) => {
        setData(res.data);
      });
    await axios.get(`/api/profile/${profile}?nameonly=true`).then((res) => {
      setUser(res.data.user);
    });
  }
  if (!data.length) {
    fetch();
  }
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "primary.dark",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ width: isMobile ? "100vw" : "30vw" }}>
        {!data.length && <LinearProgress color="secondary" />}
        <MenuTop
          title={user}
          refresh={() => {
            setData([]);
          }}
          buttons={buttons}
          selected={selected}
          onClick={(e: number) => {
            setSelected(e);
            setData([]);
          }}
        />
        <Paper style={{ maxHeight: "calc(100vh - 91px)", overflow: "auto" }}>
          {
            <div style={{ maxWidth: "99%" }}>
              {!data.length ? (
                <div />
              ) : data[0] === 404 ? (
                <div />
              ) : (
                data.map((thread: any) => (
                  <MenuThread thread={thread} category={0} />
                ))
              )}
            </div>
          }
        </Paper>
      </div>
    </Box>
  );
}
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
              <TableCell
                component="th"
                scope="row"
                style={{ fontSize: "16px" }}
              >
                {tablerows[index]}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                style={{ fontSize: "16px" }}
              >
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
  async function fetch() {
    await axios
      .get(`/api/profile/${Number(params.id) || "self"}`)
      .then((res) => {
        setUser(res.data);
      });
  }
  const [history, setHistory] = useHistory();
  if (history !== window.location.pathname) {
    setHistory(window.location.pathname);
  } 
  if (!menu && !isMobile) {
    setMenu(true);
  }
  else if (menu && isMobile) {
    setMenu(false);
  }
  if (profile !== Number(params.id) || "self") {
    setProfile(Number(params.id) || "self");
  }
  if (search) {
    setSearch(false);
  }
  if (!Object.keys(user).length) {
    fetch();
  }
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
                    width: isMobile ? "100vw" : "70vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={
                      user?.avatar ||
                      "https://metahkg.s3.ap-northeast-1.amazonaws.com/avatars/noavatar.png"
                    }
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
                        maxWidth: isMobile ? "calc(100vw - 260px)" : "calc(70vw - 260px)",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        lineHeight: "35px",
                        maxHeight: "35px"
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
                {isMobile && (
                  <div style={{ marginTop: "20px" }}>
                    <Link to={`/history/${params.id}`} style={{textDecoration: 'none'}}>
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
