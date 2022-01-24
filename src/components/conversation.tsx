import React, { useState } from "react";
import { Box, LinearProgress, Paper } from "@mui/material";
import Comment from "./comment";
import Title from "./title";
import axios from "axios";
import DOMPurify from "dompurify";
import { Notification } from "../lib/notification";
let o: JSX.Element[] = [];
let conversation: any = {};
let users: any = {};
let uservotes: any = {};
let slink = "";
export default function Conversation(props: { id: number }) {
  const [state, setState] = React.useState<{ ready: boolean; error: string }>({
    ready: false,
    error: "",
  });
  const [notify, setNotify] = useState({open: false, text: ""});
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
      `https://l.wcyat.me/${
        (
          await axios.post("https://api-us.wcyat.me/create", {
            url: window.location.origin + window.location.pathname,
          })
        ).data.id
      }`;
    if (localStorage.signedin) {
      await axios
        .post("/api/getvotes", { id: Number(props.id) })
        .then((res) => {
          uservotes = res.data;
        });
    }
    setState({ ...state, ready: true });
  }
  function build() {
    o = [];
    Object.entries(conversation.conversation).map((entry: any): void => {
      o.push(
        <Comment
          name={users?.[entry[1].user].name}
          id={entry[0]}
          op={users?.[entry[1].user].name === conversation.op ? true : false}
          sex={users?.[entry[1].user].sex === "male" ? true : false}
          date={entry[1].createdAt}
          tid={props.id}
          up={entry[1].up | 0}
          down={entry[1].down | 0}
          vote={uservotes?.[entry[0]]}
          userid={entry[1].user}
        >
          {DOMPurify.sanitize(entry[1]?.comment)}
        </Comment>
      );
    });
  }
  if (state.error && !notify.open) {
    setNotify({open: true, text: state.error});
  }
  !state.ready ? !state.error && getdata() : build();
  return (
    <div className="conversation" style={{ minHeight: "100vh" }}>
      <Notification notify={notify} setNotify={setNotify}/>
      {!state.error && <div>
      {!state.ready && (
        <LinearProgress sx={{ width: "100%" }} color="secondary" />
      )}
      <Title
        slink={slink}
        category={conversation.category}
        title={conversation.title}
      />
      <Paper style={{ overflow: "auto", maxHeight: "calc(100vh - 61px)" }}>
        <Box sx={{ backgroundColor: "primary.dark", width: "100%" }}>{o}</Box>
      </Paper>
      </div>}
    </div>
  );
}
