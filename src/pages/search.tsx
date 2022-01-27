import React from "react";
import { Box, LinearProgress, Paper } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import MenuThread from "../components/menu/thread";
import MenuTop from "../components/menu/top";
import SearchBar from "../components/searchbar";
import queryString from "query-string";
import { useNavigate } from "react-router";
import Empty from "../components/empty";
import { useMenu, useSearch } from "../components/MenuProvider";
import { useHistory, useWidth } from "../components/ContextProvider";
import { summary } from "../lib/common";
/*
* Search menu component, rendered in ../components/menu if search is true
* Returns a menu similar to the default one
*/
export function SearchMenu() {
  document.title = "Search | Metahkg";
  const [data, setData] = useState<any>([]);
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState("");
  const [,setHistory] = useHistory();
  const [width] = useWidth();
  let tempq = "";
  const buttons = ["Relevance", "Created", "Last Comment"];
  const params = queryString.parse(window.location.search);
  const navigate = useNavigate();
  async function fetch() {
    await axios
      .post("/api/search", {
        q: decodeURIComponent(String(query || params.q || localStorage.query)),
        sort: selected,
      })
      .then((res) => {
        localStorage.query =
          decodeURIComponent(String(query || params.q)) || localStorage.query;
        if (!res.data.length) {
          setData([404]);
          return;
        }
        setData(res.data);
      });
  }
  if (!data.length) {
    fetch().then(
      () => {},
      () => {}
    );
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
      <div style={{ width: width < 760 ? "100vw" : "30vw" }}>
        {!data.length ? <LinearProgress color="secondary" /> : <div />}
        <MenuTop
          title="Search"
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
                  setQuery(tempq);
                  setData([]);
                  setHistory(`/search?q=${encodeURIComponent(tempq)}`);
                  navigate(`/search?q=${encodeURIComponent(tempq)}`);
                }
              }}
              initvalue={decodeURIComponent(
                String(query || params.q || localStorage.query)
              )}
            />
          </div>
        </div>
        <Paper sx={{ maxHeight: "calc(100vh - 151px)", overflow: "auto" }}>
          {
            <div style={{ maxWidth: "99%" }}>
              {!!(data.length && data[0] !== 404) &&
                data.map(
                  (thread: summary) => <MenuThread thread={thread} category={0} />
                )}
            </div>
          }
        </Paper>
      </div>
    </Box>
  );
}
export default function Search() {
  const [search, setSearch] = useSearch();
  const [menu, setMenu] = useMenu();
  const [history, setHistory] = useHistory();
  const [width] = useWidth();
  if (history !== window.location.pathname) {
    setHistory(window.location.pathname + window.location.search);
  }
  if (!menu) {
    setMenu(true);
  }
  if (!search) {
    setSearch(true);
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
      {!(width < 760) && (
        <Paper sx={{ overflow: "auto", maxHeight: "100vh" }}>
          <div
            style={{
              width: "70vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Empty />
          </div>
        </Paper>
      )}
    </Box>
  );
}
