import { Box, IconButton, Tooltip } from "@mui/material";
import { Reply as ReplyIcon } from "@mui/icons-material";
import parse from "html-react-parser";
import date from "date-and-time";
import { timetoword } from "../lib/common";
import VoteButtons from "./votebuttons";
import { PopUp } from "../lib/popup";
import { useState } from "react";
export default function Comment(props: {
  op: boolean;
  sex: boolean;
  id: number;
  tid: number;
  userid: number;
  name: string;
  children: string;
  date: string;
  up: number;
  down: number;
  vote: "up" | "down" | undefined;
}) {
  function Tag(tprops: { children: string | JSX.Element | JSX.Element[] }) {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", fontSize: "16px", alignItems: "center" }}>
        <PopUp withbutton open={open} setOpen={setOpen} title="User information" button={{text: "View Profile", link: `/profile/${props.userid}`}}>
          <p style={{textAlign: 'center'}}>
            {props.name}<br/>
            #{props.userid}
          </p>
        </PopUp>
        <p
          style={{
            color: props.op ? "#F5BD1F" : "#aca9a9",
            marginTop: "15px",
            marginBottom: "0px",
          }}
        >
          #{props.id}
        </p>
        <a
          className="cuserlink"
          onClick={() => {setOpen(true)}}
          style={{
            color: props.sex ? "#34aadc" : "red",
            marginLeft: "10px",
            marginTop: "15px",
            marginBottom: "0px",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            overflow: "hidden",
            lineHeight: "22px",
            maxHeight: "22px",
            wordBreak: "keep-all",
            cursor: "pointer"
          }}
        >
          {tprops.children}
        </a>
        <Tooltip
          title={date.format(new Date(props.date), "ddd, MMM DD YYYY HH:mm:ss")}
          arrow
        >
          <p
            style={{
              fontSize: "15px",
              color: "#aca9a9",
              marginLeft: "10px",
              marginTop: "15.5px",
              marginBottom: "0px",
            }}
          >
            {timetoword(props.date)}
          </p>
        </Tooltip>
        <Tooltip title="Quote" arrow>
          <IconButton
            sx={{ marginTop: "16px", marginLeft: "3px" }}
            onClick={() => {
              localStorage.reply = props.children;
              window.location.href = `/comment/${props.tid}`;
            }}
          >
            <ReplyIcon style={{ fontSize: "19px", color: "#aca9a9" }} />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        textAlign: "left",
        marginTop: "5px",
      }}
    >
      <div style={{ marginLeft: "20px", marginRight: "20px" }}>
        <Tag>{props.name}</Tag>
        <p style={{ color: "white", wordBreak: "break-word" }}>
          {parse(props.children)}
        </p>
        <div style={{ height: "2px" }} />
      </div>
      <div style={{ marginLeft: "20px" }}>
        <VoteButtons
          key={props.tid}
          vote={props.vote}
          id={props.tid}
          cid={props.id}
          up={props.up}
          down={props.down}
        />
      </div>
      <div style={{ height: "10px" }} />
    </Box>
  );
}
