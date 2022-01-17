import { Box, LinearProgress, Paper } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import MenuThread from "../components/menu/thread";
import MenuTop from "../components/menu/top";
import SearchBar from "../components/searchbar";
import queryString from "query-string";
import { useNavigate } from "react-router";
export default function Search() {
  const [data, setData] = useState<any>([]);
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState("");
  let tempq = "";
  const buttons = ["Relevance", "By Posts", "By Comments"];
  const params = queryString.parse(window.location.search);
  const navigate = useNavigate();
  async function fetch() {
    console.log(params.q, String(params.q));
    await axios
      .post("/api/search", {
        q: decodeURIComponent(String(query || params.q)),
        sort: selected,
      })
      .then((res) => {
        if (!res.data.length) {setData([404]); return;}
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
          />
        </div>
        <Paper style={{ maxHeight: "calc(100vh - 160px)", overflow: "auto" }}>
          {
            <div style={{ maxWidth: "99%" }}>
              {!data.length ? (
                <div />
              ) : data[0] === 404 ? <h1 style={{color: 'white'}}>Nothing found</h1> : (
                data.map((thread:any) => <MenuThread thread={thread} />)
              )}
            </div>
          }
        </Paper>
      </div>
    </Box>
  );
}
