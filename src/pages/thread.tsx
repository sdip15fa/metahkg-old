import React from 'react';
import Conversation from "../components/conversation";
import { Box } from "@mui/material";
import { useParams } from "react-router";
import { useCat, useId, useMenu } from "../components/MenuProvider";
import { useWidth } from "../components/ContextProvider";
export default function Thread() {
  const params = useParams();
  const [category] = useCat();
  const [id, setId] = useId();
  const [menu, setMenu] = useMenu();
  const [width] = useWidth();
  if (!menu && !(width < 760)) {
    setMenu(true);
  } else if (menu && width < 760) {
    setMenu(false);
  }
  if (!category && !id) {
    const i = window.location.pathname.split("/");
    setId(i.pop() || i.pop());
  }
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div key={params.id} style={{ width: width < 760 ? "100vw" : "70vw" }}>
        <Conversation id={Number(params.id)} />
      </div>
    </Box>
  );
}
