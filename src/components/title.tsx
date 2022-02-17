import React from "react";
import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Reply as ReplyIcon,
  Link as LinkIcon,
  ContentCopy,
  Telegram,
  WhatsApp,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PopUp } from "../lib/popup";
import { Notification } from "../lib/notification";
import { useHistory, useWidth } from "./ContextProvider";
/*
 * Thread title component
 * props.category: category of the thread'
 * props.title: title of the thread
 * props.slink: shortened link of the thread
 * renders: a link arrow to the previous category / search / profile / history,
 * or if this is the first page of this session, /category/>category id>
 * title beside the arrow
 * comment (/comment) and share buttons at the right
 * share button opens a popup
 */
export default function Title(props: {
  category: number;
  title: string;
  slink: string;
}) {
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState({ open: false, text: "" });
  const [history] = useHistory();
  const [width] = useWidth();
  const copytext =
    props.title + "\n" + props.slink + "\n- Shared from Metahkg forum";
  return (
    <Box sx={{ backgroundColor: "primary.main", height: "47px" }}>
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
          <div style={{ marginTop: "5px" }}>
            <Tooltip arrow title="Copy">
              <IconButton
                onClick={async () => {
                  await navigator.clipboard.writeText(props.slink);
                  setNotify({ open: true, text: "Copied to Clipboard!" });
                }}
              >
                <ContentCopy sx={{ textAlign: "start", fontSize: "22px" }} />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Copy link">
              <IconButton
                onClick={async () => {
                  await navigator.clipboard.writeText(props.slink);
                  setNotify({ open: true, text: "Link copied to Clipboard!" });
                }}
              >
                <LinkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Share to Telegram">
              <a
                href={`tg://msg_url?text=${encodeURIComponent(
                  props.title + "\n- Shared from Metahkg forum"
                )}&url=${props.slink}`}
              >
                <IconButton>
                  <Telegram />
                </IconButton>
              </a>
            </Tooltip>
            <Tooltip arrow title="Share to Whatsapp">
              <a href={`whatsapp://send?text=${encodeURIComponent(copytext)}`}>
                <IconButton>
                  <WhatsApp />
                </IconButton>
              </a>
            </Tooltip>
          </div>
        </div>
      </PopUp>
      <div
        style={{
          display: "flex",
          marginLeft: "10px",
          marginRight: "20px",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingRight: 10,
            overflow: "hidden",
          }}
        >
          <Link to={history || `/category/${props.category}`}>
            <IconButton sx={{ margin: 0, padding: 0 }}>
              <ArrowBackIcon color="secondary" />
            </IconButton>
          </Link>
          <Typography
            className="novmargin"
            sx={{
              color: "secondary.main",
              fontSize: "18px",
              paddingLeft: "10px",
              lineHeight: "22px",
              maxHeight: "22px",
              textOverflow: "ellipsis",
              overflow: "hidden",
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
