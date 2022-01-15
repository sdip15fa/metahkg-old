import React from "react";
import { Box, LinearProgress, Paper } from "@mui/material";
import Comment from "./comment";
import Title from "./title";
import axios from "axios";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { timetoword } from "../lib/common";
let o: JSX.Element[] = [];
let conversation: any = {};
let users: any = {};
let slink = "";
export default function Conversation(props: { id: string | number }) {
  const [state, setState] = React.useState<{ ready: boolean; error: string }>({
    ready: false,
    error: "",
  });
  async function getdata() {
    await axios
      .get(`/api/thread/${props.id}/conversation`)
      .then((res) => {
        conversation = res.data;
      })
      .catch((err) => {
        setState({ ...state, error: err.response.data });
        return;
      });
    await axios.get(`/api/thread/${props.id}/users`).then((res) => {
      users = res.data;
    });
    slink =
      conversation.slink ||
      `https://us.wcyat.me/${
        (
          await axios.post("https://api-us.wcyat.me/create", {
            url: window.location.origin + window.location.pathname,
          })
        ).data.id
      }`;
    setState({ ...state, ready: true });
  }
  function build() {
    o = [];
    Object.entries(conversation.conversation).map((entry: any): void => {
      o.push(
        <Comment
          name={users[entry[1].user].name}
          id={entry[0]}
          op={users[entry[1].user].name === conversation.op ? true : false}
          sex={users[entry[1].user].sex === "male" ? true : false}
          time={timetoword(entry[1].createdAt)}
          tid={props.id}
        >
          {DOMPurify.sanitize(entry[1].comment)}
        </Comment>
      );
    });
  }
  if (state.error) {
    return <h1 style={{ color: "white" }}>{state.error}</h1>;
  }
  if (!state.ready) {
    getdata();
  } else {
    build();
  }
  return (
    <div style={{ minHeight: "100vh" }}>
      {!state.ready ? (
        <LinearProgress sx={{ width: "100%" }} color="secondary" />
      ) : (
        <div />
      )}
      <Title
        slink={slink}
        category={conversation.category}
        title={conversation.title}
      />
      <Paper style={{ overflow: "auto", maxHeight: "calc(100vh - 61px)" }}>
        <Box sx={{ backgroundColor: "primary.dark", width: "100%" }}>{o}</Box>
      </Paper>
    </div>
  );
}
