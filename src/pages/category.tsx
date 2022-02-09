import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router";
import Empty from "../components/empty";
import { useHistory, useWidth } from "../components/ContextProvider";
import {
  useCat,
  useData,
  useId,
  useMenu,
  useProfile,
  useSearch,
  useSelected,
  useTitle,
} from "../components/MenuProvider";
import { categories } from "../lib/common";
/*
 * Component for /category/1
 * returns a box with template if width > 760
 * controls the menu component
 */
export default function Category() {
  const params = useParams();
  const [id, setId] = useId();
  const [menu, setMenu] = useMenu();
  const [category, setCategory] = useCat();
  const [search, setSearch] = useSearch();
  const [profile, setProfile] = useProfile();
  const [history, setHistory] = useHistory();
  const [, setData] = useData();
  const [width] = useWidth();
  const [, setTitle] = useTitle();
  const [selected, setSelected] = useSelected();
  document.title = categories[category] + " | METAHKG";
  function cleardata() {
    setData([]);
    setTitle("");
    setSelected(0);
  }
  history !== window.location.pathname && setHistory(window.location.pathname);
  !menu && setMenu(true);
  if (category !== Number(params.category) || id) {
    setCategory(Number(params.category));
    cleardata();
    setId(0);
  }
  if (search) {
    setSearch(false);
    cleardata();
  }
  if (profile) {
    setProfile(0);
    cleardata();
  }
  ![0, 1].includes(selected) && setSelected(0);
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        display: "flex",
        flexDirection: "row",
        maxHeight: "100vh",
      }}
    >
      {!(width < 760) && <Empty />}
    </Box>
  );
}
