import React from "react";
import {
  Add as AddIcon,
  Autorenew as AutorenewIcon,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import SideBar from "../sidebar";
import {
  useCat,
  useId,
  useProfile,
  useSearch,
  useTitle,
} from "../MenuProvider";
import axios from "axios";
/*
 * The top part of the menu consists of a title part
 * (sidebar, title, refresh and create topic button link)
 * and a buttons part (normally two to three buttons)
 * which serve as tabs to decide the data fetch location
 */
export default function MenuTop(props: {
  refresh: MouseEventHandler<HTMLButtonElement>;
  selected: number;
  onClick: (e: number) => void;
}) {
  const [search] = useSearch();
  const [profile] = useProfile();
  const [category, setCat] = useCat();
  const [id] = useId();
  const inittitle = {
    search: "Search",
    profile: "User Profile",
    menu: "Metahkg",
  }[search ? "search" : profile ? "profile" : "menu"];
  const [title, setTitle] = useTitle();
  const tabs = {
    search: ["Relevance", "Created", "Last Comment"],
    profile: ["Created", "Last Comment"],
    menu: ["Newest", "Hottest"],
  }[search ? "search" : profile ? "profile" : "menu"];
  !search &&
    !title &&
    (category || profile || id) &&
    (async () => {
      if (profile) {
        await axios.get(`/api/profile/${profile}?nameonly=true`).then((res) => {
          setTitle(res.data.user);
          document.title = `${res.data.user} | Metahkg`;
        });
        return;
      }
      axios.get(`/api/categories/${category || `bytid${id}`}`).then((res) => {
        setTitle(res.data.name);
        !category && setCat(res.data.id);
        if (!id) {
          document.title = `${res.data.name} | Metahkg`;
        }
      });
    })();
  return (
    <div>
      <Box
        sx={{ backgroundColor: "primary.main", width: "100%", height: "90px" }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            height: "50px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ paddingLeft: "10px", marginRight: "40px" }}>
            <SideBar />
          </div>
          <p
            style={{
              color: "#F5BD1F",
              fontSize: "18px",
              marginTop: "0px",
              marginBottom: "0px",
              userSelect: "none",
            }}
          >
            {title || inittitle}
          </p>
          <div style={{ display: "flex" }}>
            <Tooltip title="Refresh" arrow>
              <IconButton onClick={props.refresh}>
                <AutorenewIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Create topic" arrow>
              <Link style={{ display: "flex" }} to="/create">
                <IconButton sx={{ marginRight: "10px" }}>
                  <AddIcon sx={{ color: "white" }} />
                </IconButton>
              </Link>
            </Tooltip>
          </div>
        </div>
        <div
          style={{
            fontSize: "20px",
            display: "flex",
            width: "100%",
            alignItems: "flex-end",
            height: "40px",
          }}
        >
          {tabs.map((tab, index) => (
            <Box
              onClick={() => {
                props.onClick(index);
              }}
              sx={{
                cursor: "pointer",
                marginLeft: index === 0 ? "10px" : "0px",
                borderBottom:
                  props.selected === index ? "2px solid rgb(245, 189, 31)" : "",
                width: "100%",
                marginRight: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography sx={{ color: "secondary.main", fontSize: "15px" }}>
                {tab}
              </Typography>
            </Box>
          ))}
        </div>
      </Box>
      <Divider />
    </div>
  );
}
