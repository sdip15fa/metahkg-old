import { Box, Paper } from "@mui/material";
import React, { memo } from "react";
import axios from "axios";
import MenuTop from "./menu/top";
import MenuThread from "./menu/thread";
import {
  useCat,
  useId,
  useProfile,
  useSearch,
  useMenu,
  useSelected,
  useData,
} from "./MenuProvider";
import { summary } from "../lib/common";
import MenuPreload from "./menu/preload";
import queryString from "query-string";
import { useHistory, useQuery } from "./ContextProvider";
import SearchBar from "./searchbar";
import { useNavigate } from "react-router";
/*
 * variables are from MenuProvider and can be changed in any components
 * returns SearchMenu if search = true
 * returns ProfileMenu if profile = true
 * else:
 * data is fetched by category or thread id
 * two tabs, newest and hottest which fetch different api urls:
 * /api/<"newest" | "hottest">/<category | 'bytid<thread id>'>
 * MenuThreads are rendered after data is fetched
 */
function MainContent() {
  const params = queryString.parse(window.location.search);
  const [category] = useCat();
  const [search] = useSearch();
  const [profile] = useProfile();
  const [selected] = useSelected();
  const [query] = useQuery();
  const [id] = useId();
  const [data, setData] = useData();
  const q = decodeURIComponent(String(params.q || query || ""));
  function fetch() {
    const c: string | number = id ? `bytid${id}` : category;
    const url = {
      search: `/api/search?q=${q}&sort=${selected}`,
      profile: `/api/history/${profile}?sort=${selected ? "comments" : "post"}`,
      menu: `/api/menu/${c}?sort=${selected}`,
    }[search ? "search" : profile ? "profile" : "menu"];
    axios.get(url).then((res) => {
      if (!res.data.length) {
        setData([404]);
        return;
      }
      setData(res.data);
    });
  }
  if (!data.length && (category || id || profile || search)) {
    fetch();
  }
  return (
    <Paper
      sx={{
        overflow: "auto",
        maxHeight: search ? "calc(100vh - 151px)" : "calc(100vh - 91px)",
      }}
    >
      {!!(data.length && data[0] !== 404) && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "99%",
          }}
        >
          {data.map((thread: summary) => (
            <div>
              <MenuThread key={category} thread={thread} />
            </div>
          ))}
        </div>
      )}
      {!data.length && <MenuPreload />}
    </Paper>
  );
}
function Menu() {
  const [selected, setSelected] = useSelected();
  const [category] = useCat();
  const [, setData] = useData();
  const [menu] = useMenu();
  const [search] = useSearch();
  const [query, setQuery] = useQuery();
  const [, setHistory] = useHistory();
  const navigate = useNavigate();
  let tempq = decodeURIComponent(query || "");
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        maxWidth: "100%",
        minHeight: "100vh",
        display: menu ? "flex" : "none",
        flexDirection: "column",
      }}
    >
      <MenuTop
        refresh={() => {
          setData([]);
        }}
        onClick={(e: number) => {
          if (selected !== e) {
            setSelected(e);
            setData([]);
          }
        }}
        selected={selected}
      />
      {search && (
        <div style={{ display: "flex", width: "100%" }}>
          <div
            style={{
              display: "flex",
              height: "39px",
              margin: "10px",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SearchBar
              onChange={(e) => {
                tempq = e.target.value;
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && tempq) {
                  navigate(`/search?q=${encodeURIComponent(tempq)}`);
                  setQuery(tempq);
                  setData([]);
                  setHistory(`/search?q=${encodeURIComponent(tempq)}`);
                }
              }}
            />
          </div>
        </div>
      )}
      <MainContent key={category} />
    </Box>
  );
}
export default memo(Menu);
