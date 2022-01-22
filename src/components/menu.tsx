import { Box, Paper, LinearProgress } from "@mui/material";
import React, { memo } from "react";
import axios from "axios";
import MenuTop from "./menu/top";
import MenuThread from "./menu/thread";
import { SearchMenu } from "../pages/search";
function Menu(props: { id: string | number; category: number; search: boolean }) {
  const [data, setData] = React.useState<any>([]);
  const [cat, setCat] = React.useState({id: 0, name: "Metahkg"});
  const [selected, setSelected] = React.useState(0);
  if (props.search) {
    return <SearchMenu />;
  }
  const buttons = ["Newest", "Hottest"];
  async function fetch() {
    const c = props.id ? `bytid${props.id}` : props.category;
    let d:any, ca:any;
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
    setData(d);
    setCat(ca);
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
      <Paper style={{ overflow: "auto", maxHeight: "calc(100vh - 91px)" }}>
        {!data.length ? (
          <div />
        ) : data[0] === 404 ? (
           <div/>
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
                <MenuThread key={cat.id} thread={thread} category={cat.id}/>
              </div>
            ))}
          </div>
        )}
      </Paper>
    </Box>
  );
}
export default memo(Menu);
