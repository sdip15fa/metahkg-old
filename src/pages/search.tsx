import { Box, LinearProgress, Paper } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import MenuThread from "../components/menu/thread";
import MenuTop from "../components/menu/top";
import SearchBar from "../components/searchbar";
import queryString from "query-string";
import { useNavigate } from "react-router";
import Empty from "../components/empty";
import Menu from '../components/menu';
import { useCat, useId, useSearch } from "../components/MenuProvider";
export function SearchMenu() {
  const [data, setData] = useState<any>([]);
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState("");
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
        localStorage.query = decodeURIComponent(String(query || params.q)) || localStorage.query;
        if (!res.data.length) {
          setData([404]);
          return;
        }
        setData(res.data);
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
                  navigate(`/search?q=${encodeURIComponent(tempq)}`);
                }
              }}
              initvalue={decodeURIComponent(String(query || params.q || localStorage.query))}
            />
          </div>
        </div>
        <Paper style={{ maxHeight: "calc(100vh - 151px)", overflow: "auto" }}>
          {
            <div style={{ maxWidth: "99%" }}>
              {!data.length ? <div/> :
                (data[0] === 404 ? (
                  <h1 style={{ color: "white" }}>Nothing found</h1>
                ) : (
                  data.map((thread: any) => <MenuThread thread={thread} category={0}/>)
                ))}
            </div>
          }
        </Paper>
      </div>
    </Box>
  )
}
export default function Search() {
  const [id, setId] = useId();
  const [category, setCategory] = useCat();
  const [search, setSearch] = useSearch();
  if (!search) {setSearch(true);};
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "primary.dark",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Menu key={search} id={id} category={category} search={search}/>
      {!isMobile ? (
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
      ) : (
        <div />
      )}
    </Box>
  );
}
