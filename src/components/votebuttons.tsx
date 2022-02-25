import React from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button, ButtonGroup, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNotification } from "./ContextProvider";
/*
 * Buttons for voting
 * Disabled if user is not signed in
 * If upvote is clicked or has been previously clicked using a same account,
 * upvote button text color changes to green and downvote button disables.
 * For downvote, the same but color is red
 * Generates a notification in case of errors
 */
export default function VoteButtons(props: {
  vote?: "U" | "D";
  id: number;
  cid: number;
  up: number;
  down: number;
}) {
  const [vote, setVote] = useState(props.vote);
  const [up, setUp] = useState(props.up);
  const [down, setDown] = useState(props.down);
  const [, setNotification] = useNotification();
  const sendvote = (v: "U" | "D") => {
    v === "U" ? setUp(up + 1) : setDown(down + 1);
    setVote(v);
    axios
      .post("/api/vote", {
        id: Number(props.id),
        cid: Number(props.cid),
        vote: v,
      })
      .catch((err) => {
        v === "U" ? setUp(up) : setDown(down);
        setVote(undefined);
        setNotification({ open: true, text: err.response.data.error });
      });
  };
  return (
    <div>
      <ButtonGroup
        variant="text"
        sx={{ borderRadius: "5px", backgroundColor: "#333" }}
      >
        <Button
          sx={{ padding: "0px", marginTop: "1.5px", marginBottom: "1.5px" }}
          disabled={!localStorage.user || !!vote}
          onClick={() => {
            sendvote("U");
          }}
        >
          <Typography
            sx={{
              display: "flex",
              color: vote === "U" ? "green" : "#aaa",
            }}
          >
            <ArrowDropUp className="icon-white-onhover" />
            {up}
          </Typography>
        </Button>
        <Button
          sx={{
            padding: "0px",
            marginTop: "1.5px",
            marginBottom: "1.5px",
            marginRight: "5px",
          }}
          disabled={!localStorage.user || !!vote}
          onClick={() => {
            sendvote("D");
          }}
        >
          <Typography
            sx={{
              color: vote === "D" ? "red" : "#aaa",
              display: "flex",
            }}
          >
            <ArrowDropDown className="icon-white-onhover" />
            {down}
          </Typography>
        </Button>
      </ButtonGroup>
    </div>
  );
}
