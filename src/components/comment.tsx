import "./css/comment.css";
import React, { memo } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Reply as ReplyIcon } from "@mui/icons-material";
import parse from "html-react-parser";
import date from "date-and-time";
import { timetoword } from "../lib/common";
import VoteButtons from "./votebuttons";
import { PopUp } from "../lib/popup";
import { useState } from "react";
import { useNavigate } from "react-router";
/*
 * Comment component renders a comment
 * which includes a title (Tag)
 * the comment body
 * and upvote and downvote buttons
 */
function Comment(props: {
  op: boolean; //is original poster (true | false)
  sex: "M" | "F"; //user sex
  id: number; //comment id
  tid: number; //thread id
  userid: number; //user's id
  name: string; //username
  children: string; //the comment
  date: string; //comment date
  up: number; //number of upvotes
  down: number; //number of downvotes
  vote?: "U" | "D"; //user's vote, if not voted or not signed in it would be undefined
}) {
  /*
   * Tag serves as a title for the comment
   * renders user id, username (as children),
   * and a quote button for users to quote the comment
   */
  function Tag(tprops: { children: string | JSX.Element | JSX.Element[] }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    return (
      <div
        style={{
          display: "flex",
          fontSize: "16px",
          alignItems: "center",
          paddingTop: "10px",
        }}
      >
        <PopUp
          withbutton
          open={open}
          setOpen={setOpen}
          title="User information"
          button={{ text: "View Profile", link: `/profile/${props.userid}` }}
        >
          <p
            style={{
              textAlign: "center",
              marginTop: "5px",
              marginBottom: "5px",
            }}
          >
            {props.name}
            <br />#{props.userid}
          </p>
        </PopUp>
        <p
          className="novmargin"
          style={{
            color: props.op ? "#F5BD1F" : "#aca9a9",
          }}
        >
          #{props.id}
        </p>
        <p
          className="comment-userlink novmargin"
          onClick={() => {
            setOpen(true);
          }}
          style={{
            color: props.sex === "M" ? "#34aadc" : "red",
            marginLeft: "10px",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            overflow: "hidden",
            lineHeight: "22px",
            maxHeight: "22px",
            wordBreak: "keep-all",
            cursor: "pointer",
          }}
        >
          {tprops.children}
        </p>
        <Tooltip
          title={date.format(new Date(props.date), "ddd, MMM DD YYYY HH:mm:ss")}
          arrow
        >
          <p
            className="novmargin"
            style={{
              fontSize: "15px",
              color: "#aca9a9",
              marginLeft: "10px",
            }}
          >
            {timetoword(props.date)}
          </p>
        </Tooltip>
        <Tooltip title="Quote" arrow>
          <IconButton
            sx={{ marginLeft: "10px", padding: 0 }}
            onClick={() => {
              localStorage.reply = props.children;
              navigate(`/comment/${props.tid}`);
            }}
          >
            <ReplyIcon sx={{ fontSize: "19px", color: "#aca9a9" }} />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
  return (
    <Box
      id={`c${props.id}`}
      sx={{
        backgroundColor: "primary.main",
        textAlign: "left",
        marginTop: "5px",
      }}
    >
      <div style={{ marginLeft: "20px", marginRight: "20px" }}>
        <Tag>{props.name}</Tag>
        <p
          style={{
            color: "white",
            wordBreak: "break-word",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
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
export default memo(Comment);
