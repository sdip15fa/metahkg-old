import {
  ContentCopy,
  Telegram,
  WhatsApp,
  Link as LinkIcon,
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
          <Tooltip arrow title="Share to Telegram">
            <a
              href={`tg://msg_url?text=${encodeURIComponent(
                title + "\n- Shared from Metahkg forum"
              )}&url=${link}`}
            >
              <IconButton>
                <Telegram />
              </IconButton>
            </a>
          </Tooltip>
          <Tooltip arrow title="Share to Whatsapp">
            <a href={`whatsapp://send?text=${encodeURIComponent(text)}`}>
              <IconButton>
                <WhatsApp />
              </IconButton>
            </a>
          </Tooltip>
        </div>
      </div>
    </PopUp>
  );
}
