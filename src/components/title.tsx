import {
  Alert,
  Box,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Reply as ReplyIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import React from "react";
import { isMobile } from "react-device-detect";
export default function Title(props: {
  category: number | string;
  title: string;
  slink: string;
}) {
  const [alert, setAlert] = React.useState({
    text: "",
    open: false,
    error: false,
  });
  return (
    <Box sx={{ backgroundColor: "primary.main", height: "50px" }}>
      <Snackbar
        sx={{
          backgroundColor: "primary.main",
          width: isMobile ? "50vw" : "30vw",
        }}
        open={alert.open}
        autoHideDuration={5000}
        onClick={() => {
          setAlert({ text: "", open: false, error: false });
        }}
        onClose={() => {
          setAlert({ text: "", open: false, error: false });
        }}
      >
        <Alert
          variant="outlined"
          severity={alert.error ? "error" : "info"}
          sx={{ width: "100%" }}
        >
          {alert.text}
        </Alert>
      </Snackbar>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: "10px",
          marginRight: "20px",
          justifyContent: "flex-end",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            overflow: "hidden",
            height: "100%",
          }}
        >
          <Link to={`/category/${props.category}`}>
            <IconButton>
              <ArrowBackIcon color="secondary" />
            </IconButton>
          </Link>
          <Typography
            sx={{
              color: "secondary.main",
              fontSize: "18px",
              marginTop: "0px",
              marginBottom: "0px",
              paddingLeft: "10px",
              lineHeight: "22px",
              maxHeight: "22px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              wordBreak: 'keep-all'
            }}
          >
            {props.title}
          </Typography>
        </div>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Tooltip title="Comment" arrow>
            <Link to={`/comment/${window.location.href.split("/").pop()}`}>
              <IconButton>
                <ReplyIcon
                  style={{ color: "white", height: "24px", width: "24px" }}
                />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Share" arrow>
            <IconButton
              onClick={() => {
                window.navigator.clipboard.writeText(props.slink);
                setAlert({
                  error: false,
                  text: "Link copied to clipboard!",
                  open: true,
                });
              }}
            >
              <ShareIcon style={{ color: "white", fontSize: '20px' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </div>
    </Box>
  );
}
