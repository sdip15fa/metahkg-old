import React from "react";
import { Box, Paper } from "@mui/material";
import Empty from "../components/empty";
import {
  useData,
  useMenu,
  useSearch,
  useSelected,
  useTitle,
} from "../components/MenuProvider";
import { useHistory, useWidth } from "../components/ContextProvider";
export default function Search() {
  const [search, setSearch] = useSearch();
  const [menu, setMenu] = useMenu();
  const [history, setHistory] = useHistory();
  const [data, setData] = useData();
  const [width] = useWidth();
  const [selected, setSelected] = useSelected();
  const [, setTitle] = useTitle();
  document.title = "Search | METAHKG";
  history !== window.location.pathname &&
    setHistory(window.location.pathname + window.location.search);
  !menu && setMenu(true);
  if (!search) {
    setSearch(true);
    data && setData([]);
    selected && setSelected(0);
    setTitle("");
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
