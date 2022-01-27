import { Box, Paper, LinearProgress } from "@mui/material";
import React, { memo } from "react";
import axios from "axios";
import MenuTop from "./menu/top";
import MenuThread from "./menu/thread";
import { SearchMenu } from "../pages/search";
import { useCat, useId, useProfile, useSearch, useMenu } from "./MenuProvider";
import { ProfileMenu } from "../pages/profile";
function Menu() {
  const [data, setData] = React.useState<any>([]);
  const [cat, setCat] = React.useState({ id: 0, name: "Metahkg" });
  const [selected, setSelected] = React.useState(0);
  const [id] = useId();
  const [category] = useCat();
  const [search] = useSearch();
  const [profile] = useProfile();
  const [menu] = useMenu();
  if (search) {
    return (
      <div style={{ display: menu ? "flex" : "none" }}>
        <SearchMenu />
      </div>
    );
  }
  if (profile) {
    return (
      <div style={{ display: menu ? "flex" : "none" }}>
        <ProfileMenu />
      </div>
    );
  }
  const buttons = ["Newest", "Hottest"];
  async function fetch() {
    const c: string | number = id ? `bytid${id}` : category;
    let d: any, ca: any;
    await axios
      .get(`/api/${selected === 0 ? "newest" : "hottest"}/${c}`)
      .then((res) => {
        if (!res.data.length) {
          setData([404]);
          return;
        }
        d = res.data;
      });
    await axios.get(`/api/categories/${c}`).then((res) => {
      ca = res.data;
    });
    if (!id) {
      document.title = `${ca.name} | Metahkg`;
    }
    setData(d);
    setCat(ca);
  }
  if (!data.length) {
    fetch().then(() => {},
    () => {});
  }
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
      {!data.length && (
        <LinearProgress sx={{ width: "100%" }} color="secondary" />
      )}
      <MenuTop
        title={cat.name}
        refresh={() => {
          setData([]);
        }}
        onClick={(e: number) => {
          setSelected(e);
          setData([]);
        }}
        selected={selected}
        buttons={buttons}
      />
      <Paper sx={{ overflow: "auto", maxHeight: "calc(100vh - 91px)" }}>
        {!!(data.length && data[0] !== 404) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "99%",
            }}
          >
            {data.map((thread: any) => (
              <div>
                <MenuThread key={cat.id} thread={thread} category={cat.id} />
              </div>
            ))}
          </div>
        )}
      </Paper>
    </Box>
  );
}
export default memo(Menu);
