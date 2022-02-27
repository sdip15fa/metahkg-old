import React from 'react';
import {
  ContentCopy,
  Telegram,
  WhatsApp,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Reddit,
} from "@mui/icons-material";
import { IconButton, TextField, Tooltip } from "@mui/material";
import { PopUp } from "../../lib/popup";
import { useNotification, useWidth } from "../ContextProvider";
import { useShareLink, useShareOpen, useShareTitle } from "../conversation";
export default function Share() {
  const [title] = useShareTitle();
  const [link] = useShareLink();
  const [open, setOpen] = useShareOpen();
  const text = title + "\n" + link + "\n- Shared from Metahkg forum";
  const [, setNotification] = useNotification();
  const [width] = useWidth();
  type external = {
    logo: JSX.Element;
    title: string;
    link: string;
  };
  const externals: external[] = [
    {
      logo: <Telegram />,
      title: "Share to Telegram",
      link: `tg://msg_url?text=${encodeURIComponent(
        title + "\n- Shared from Metahkg forum"
      )}&url=${link}`,
    },
    {
      logo: <WhatsApp />,
      title: "Share to WhatsApp",
      link: `whatsapp://send?text=${encodeURIComponent(text)}`,
    },
    {
      logo: <Twitter />,
      title: "Share to Twitter",
      link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
    },
    {
      logo: <Reddit />,
      title: "Share to Reddit",
      link: `https://www.reddit.com/submit?link=${encodeURIComponent(
        link
      )}&title=${encodeURIComponent(title)}`,
    },
    {
      logo: <Facebook />,
      title: "Share to Facebook",
      link: `https://www.facebook.com/sharer/sharer.php?u=${link}`,
    },
  ];
  return (
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
          value={text}
        />
        <div style={{ marginTop: "5px" }}>
          <Tooltip arrow title="Copy">
            <IconButton
              onClick={async () => {
                await navigator.clipboard.writeText(link);
                setNotification({ open: true, text: "Copied to Clipboard!" });
              }}
            >
              <ContentCopy sx={{ textAlign: "start", fontSize: "22px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="Copy link">
            <IconButton
              onClick={async () => {
                await navigator.clipboard.writeText(link);
                setNotification({
                  open: true,
                  text: "Link copied to Clipboard!",
                });
              }}
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>
          {externals.map((external) => (
            <Tooltip arrow title={external.title}>
              <a href={external.link} target="_blank" rel="noreferrer">
                <IconButton>{external.logo}</IconButton>
              </a>
            </Tooltip>
          ))}
        </div>
      </div>
    </PopUp>
  );
}
