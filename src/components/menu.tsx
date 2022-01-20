import { Box, Paper, LinearProgress } from "@mui/material";
import React, { memo } from "react";
import axios from "axios";
import MenuTop from "./menu/top";
import MenuThread from "./menu/thread";
import { SearchMenu } from "../pages/search";
function Menu(props: { id: string | number; category: string | number; search: boolean }) {
  const [data, setData] = React.useState<any>([]);
  const [title, setTitle] = React.useState("Metahkg");
  const [selected, setSelected] = React.useState(0);
  if (props.search) {return <SearchMenu/>}
  const buttons = ["Newest", "Hottest"];
  async function fetch() {
    const c = props.id ? `bytid${props.id}` : props.category;
    await axios
      .get(`/api/${selected === 0 ? "newest" : "hottest"}/${c}`)
      .then((res) => {
        if (!res.data.length) {
          setData([404]);
          return;
        }
        setData(res.data);
      });
    await axios.get(`/api/categories/${c}`).then((res) => {
      setTitle(res.data.name || res.data);
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
      {!data.length ? (
        <LinearProgress style={{ width: "100%" }} color="secondary" />
      ) : (
        <div />
      )}
      <MenuTop
        title={title}
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
      <Paper style={{ overflow: "auto", maxHeight: "calc(100vh - 91px)" }}>
        {!data.length ? (
          <div />
        ) : data[0] === 404 ? (
          <h1 style={{ color: "white" }}>Nothing found</h1>
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
                <MenuThread thread={thread} />
              </div>
            ))}
          </div>
        )}
      </Paper>
    </Box>
  );
}
export default memo(Menu);
