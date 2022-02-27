import React from "react";
import { Close, Notifications } from "@mui/icons-material";
import { Box, Snackbar } from "@mui/material";
import { useNotification } from "../components/ContextProvider";
/*
 * Display a notification at the top right corner
 */
export function Notification() {
  const [notification, setNotification] = useNotification();
  const vertical: "top" | "bottom" = "top";
  const horizontal: "left" | "right" | "center" = "right";
  const open = notification.open;
  return (
    <Snackbar
      className="conversation"
      sx={{
        backgroundColor: "primary.main",
        width: "300px",
        borderRadius: "8px",
      }}
      anchorOrigin={{ horizontal, vertical }}
      open={open}
      autoHideDuration={3500}
      onClick={() => {
        setNotification({ ...notification, open: false });
      }}
      onClose={() => {
        setNotification({ ...notification, open: false });
      }}
    >
      <Box
        sx={{
          backgroundColor: "#444",
          width: "100%",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#333",
            fontSize: "14px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        >
          <div
            style={{
              marginLeft: "15px",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Notifications sx={{ color: "#aca9a9", fontSize: "14px" }} />
            <p
              style={{
                color: "#aca9a9",
                marginTop: "6px",
                marginBottom: "6px",
                marginLeft: "10px",
              }}
            >
              Notification
            </p>
            <div
              className="close"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <Close
                className="icon-white-onhover"
                sx={{ fontSize: "16px", color: "#aca9a9", marginRight: "30px" }}
              />
            </div>
          </div>
        </Box>
        <Box sx={{ width: "100%", borderRadius: "8px" }}>
          <p
            style={{
              color: "white",
              marginLeft: "15px",
              marginRight: "15px",
              marginTop: "15px",
              marginBottom: "15px",
              fontSize: "15px",
              lineHeight: "18px",
              maxHeight: "36px",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {notification.text}
          </p>
        </Box>
      </Box>
    </Snackbar>
  );
}
