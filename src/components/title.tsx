import React from "react";
import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Reply as ReplyIcon,
  Link as LinkIcon,
  ContentCopy,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PopUp } from "../lib/popup";
import { Notification } from "../lib/notification";
import { useHistory, useWidth } from "./ContextProvider";
export default function Title(props: {
  category: number | string;
  title: string;
  slink: string;
}) {
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState({ open: false, text: "" });
  const [history, setHistory] = useHistory();
  const [width, setWidth] = useWidth();
  const copytext =
    props.title + "\n" + props.slink + "\n- Shared from Metahkg forum";
  return (
    <Box sx={{ backgroundColor: "primary.main", height: "50px" }}>
      <Notification notify={notify} setNotify={setNotify} />
      <PopUp
        withbutton={false}
        open={open}
        setOpen={setOpen}
        title="Share"
        button={{ text: "", link: "" }}
      >
        <div
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            textAlign: "start",
          }}
        >
          <TextField
            sx={{
              borderRadius: "0px",
              minWidth: width < 760 ? "300px" : "500px",
              marginTop: 0,
            }}
            multiline
            variant="outlined"
            fullWidth
            aria-readonly
            value={copytext}
          />
          <br />
          <Tooltip title="Copy">
            <IconButton
              onClick={async () => {
                await navigator.clipboard.writeText(props.slink);
                setNotify({ open: true, text: "Copied to Clipboard!" });
              }}
            >
              <ContentCopy sx={{ textAlign: "start" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy link">
            <IconButton
              onClick={async () => {
                await navigator.clipboard.writeText(props.slink);
                setNotify({ open: true, text: "Link copied to Clipboard!" });
              }}
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>
        </div>
      </PopUp>
      <div
        style={{
          display: "flex",
          marginLeft: "10px",
          marginRight: "20px",
          alignItems: "center",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            maxWidth: "100%",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Link to={history || `/category/${props.category}`}>
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
              wordBreak: "keep-all",
            }}
          >
            {props.title}
          </Typography>
        </div>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Tooltip title="Comment" arrow>
            <a
              style={{ textDecoration: "none" }}
              href={`/comment/${
                window.location.pathname.split("/").pop() ||
                window.location.pathname.split("/")[
                  window.location.pathname.split("/").length - 2
                ]
              }`}
            >
              <IconButton>
                <ReplyIcon
                  sx={{ color: "white", height: "24px", width: "24px" }}
                />
              </IconButton>
            </a>
          </Tooltip>
          <Tooltip title="Share" arrow>
            <IconButton
              onClick={() => {
                setOpen(true);
              }}
            >
              <ShareIcon sx={{ color: "white", fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </div>
    </Box>
  );
}
