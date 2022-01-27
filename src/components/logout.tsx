import React from "react";
import { Alert, Box } from "@mui/material";
import axios from "axios";
import { useMenu } from "./MenuProvider";
async function logout() {
  await axios.get("/api/logout");
  localStorage.clear();
  window.history.back();
}
export default function Logout() {
  const [menu, setMenu] = useMenu();
  if (menu) {
    setMenu(false);
  }
  logout().then(
    () => {},
    () => {}
  );
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        minHeight: "100vh",
        justifyContent: "center",
        width: "100vw",
      }}
    >
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <Alert sx={{ marginTop: "30px", width: "50%" }} severity="info">
          Logging you out...
        </Alert>
      </div>
    </Box>
  );
}
