import {
  Box,
  Divider,
  Button,
  Paper,
  IconButton,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Autorenew as AutorenewIcon,
} from "@mui/icons-material";
import { roundup, timetoword } from "../lib/common";
import React, { memo } from "react";
import SideBar from "./sidebar";
import axios from "axios";
import { Link } from "react-router-dom";
function Menu(props: { id: string | number; category: string | number }) {
  const [data, setData] = React.useState([]);
  const [cat, setCat] = React.useState("Metahkg");
  async function fetch() {
    const c = props.id ? `bytid${props.id}` : props.category;
    await axios.get(`/api/newest/${c}`).then((res) => {
      setData(res.data);
    });
    await axios.get(`/api/categories/${c}`).then((res) => {
      setCat(res.data.name || res.data);
    });
  }
  if (!data.length) {
    fetch();
  }
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        maxWidth: "100%",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ backgroundColor: "primary.main", width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            height: "50px",
          }}
        >
          <div style={{ paddingLeft: "10px" }}>
            <SideBar />
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                textAlign: "center",
                color: "#F5BD1F",
                fontSize: "18px",
                marginTop: "0px",
                marginBottom: "0px",
              }}
            >
              {cat}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Tooltip title="Refresh" arrow>
              <IconButton
                onClick={() => {
                  setData([]);
                }}
              >
                <AutorenewIcon style={{ color: "white" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Create topic" arrow>
              <Link style={{ display: "flex" }} to="/create">
                <IconButton>
                  <AddIcon style={{ color: "white", marginRight: "10px" }} />
                </IconButton>
              </Link>
            </Tooltip>
          </div>
        </div>
      </Box>
      <Divider />
      <Paper style={{ overflow: "auto", maxHeight: "calc(100vh - 61px)" }}>
        {!data.length ? (
          <LinearProgress style={{ width: "100%" }} color="secondary" />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "99%",
            }}
          >
            {data.map((thread: any) => (
              <div>
                <Link
                  style={{ width: "100%", textDecoration: "none" }}
                  to={`/thread/${thread.id}`}
                >
                  <Button
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        textTransform: "none",
                        height: "35px",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                          height: "35px",
                          marginLeft: "10px",
                        }}
                      >
                        <p
                          style={{
                            color: thread.sex === "male" ? "#0277bd" : "red",
                            fontSize: "16px",
                            textAlign: "left",
                          }}
                        >
                          {thread.op}
                        </p>
                        <p
                          style={{
                            marginLeft: "5px",
                            fontSize: "12px",
                            color: "grey",
                          }}
                        >
                          {timetoword(thread.lastModified)}
                        </p>
                        {thread.vote >= 0 ? (
                          <ThumbUpIcon
                            style={{ color: "white", height: "12px" }}
                          />
                        ) : (
                          <ThumbDownIcon
                            style={{ color: "white", height: "12px" }}
                          />
                        )}
                        <p style={{ fontSize: "12px", color: "white" }}>
                          {thread.vote}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            width: "100%",
                            paddingRight: "10px",
                          }}
                        >
                          <p style={{ textAlign: "end", color: "white" }}>
                            {roundup(thread.c / 10) +
                              ` page${roundup(thread.c / 10) > 1 ? "s" : ""}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        textTransform: "none",
                        height: "auto",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "left",
                          alignItems: "center",
                          lineHeight: "24px",
                          overflow: "hidden",
                          paddingRight: "30px",
                        }}
                      >
                        <p
                          style={{
                            color: "white",
                            fontSize: "17px",
                            paddingLeft: "10px",
                            maxWidth: "100%",
                            wordBreak: "break-word",
                            textAlign: "left",
                            marginTop: "5px",
                            marginBottom: "5px",
                            wordWrap: "break-word",
                            lineHeight: "20px",
                            maxHeight: "40px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {thread.title}
                        </p>
                      </div>
                    </div>
                  </Button>
                </Link>
                <Divider />
              </div>
            ))}
          </div>
        )}
      </Paper>
    </Box>
  );
}
export default memo(Menu);
