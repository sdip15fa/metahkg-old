import React from 'react';
import { Alert, Box } from "@mui/material";
import axios from "axios";
async function logout() {
  await axios.get("/api/logout");
  localStorage.clear();
  window.history.back();
}
export default function Logout() {
  logout().then(
    () => {},
    () => {},
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
        <Alert style={{ marginTop: "30px", width: "50%" }} severity="info">
          Logging you out...
        </Alert>
      </div>
    </Box>
  );
}
