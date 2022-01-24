import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Notification } from "../lib/notification";
export default function VoteButtons(props: {
  vote: "up" | "down" | undefined;
  id: number;
  cid: number;
  up: number;
  down: number;
}) {
  const [vote, setVote] = useState(props.vote);
  const [up, setUp] = useState(props.up);
  const [down, setDown] = useState(props.down);
  const [notify, setNotify] = useState<{
    open: boolean;
    text: string;
  }>({ open: false, text: "" });
  const sendvote = (v: "up" | "down") => {
    v === "up" ? setUp(up + 1) : setDown(down + 1);
    setVote(v);
    axios
      .post("/api/vote", {
        id: Number(props.id),
        cid: Number(props.cid),
        vote: v,
      })
      .catch((err) => {
        v === "up" ? setUp(up) : setDown(down);
        setVote(undefined);
        setNotify({ open: true, text: err.response.data });
      });
  };
  return (
    <div>
      <Notification notify={notify} setNotify={setNotify}/>
      <ButtonGroup
        variant="text"
        sx={{ borderRadius: "5px", backgroundColor: "#333" }}
      >
        <Button
          sx={{ padding: "0px", marginTop: "1.5px", marginBottom: "1.5px" }}
          disabled={!localStorage.signedin || !!vote}
          onClick={() => {
            sendvote("up");
          }}
        >
          <Typography
            className="votearrow"
            sx={{
              display: "flex",
              color: vote === "up" ? "green" : "#aaa",
            }}
          >
            <ArrowDropUp />
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
          disabled={!localStorage.signedin || !!vote}
          onClick={() => {
            sendvote("down");
          }}
        >
          <Typography
            className="votearrow"
            sx={{
              color: vote === "down" ? "red" : "#aaa",
              display: "flex",
            }}
          >
            <ArrowDropDown />
            {down}
          </Typography>
        </Button>
      </ButtonGroup>
    </div>
  );
}
