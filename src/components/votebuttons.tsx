import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import {
  Alert,
  Button,
  ButtonGroup,
  Snackbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { isMobile } from "react-device-detect";
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
  const [alert, setAlert] = useState<{
    error: boolean;
    open: boolean;
    text: string;
  }>({ error: false, open: false, text: "" });
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
        setAlert({ error: true, open: true, text: err.response.data });
      });
  };
  const vertical: "top" | "bottom" = "top";
  const horizontal: "left" | "right" | "center" = "right";
  return (
    <div>
      <Snackbar
        sx={{
          backgroundColor: "primary.main",
          width: isMobile ? "50vw" : "30vw",
        }}
        anchorOrigin={{ horizontal, vertical }}
        open={alert.open}
        autoHideDuration={5000}
        onClick={() => {
          setAlert({ ...alert, open: false });
        }}
        onClose={() => {
          setAlert({ ...alert, open: false });
        }}
      >
        <Alert
          variant="filled"
          severity={alert.error ? "error" : "info"}
          sx={{ width: "100%" }}
        >
          {alert.text}
        </Alert>
      </Snackbar>
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
