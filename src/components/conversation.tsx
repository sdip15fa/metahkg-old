import React, { memo, useState } from "react";
import { Box, LinearProgress, Paper } from "@mui/material";
import Comment from "./comment";
import Title from "./title";
import axios from "axios";
import DOMPurify from "dompurify";
import { Notification } from "../lib/notification";
/*
 * Conversation component gets data from /api/thread/<thread id(props.id)>/<conversation/users>
 * Then renders it as Comments
 */
let slink = "";
function Conversation(props: { id: number }) {
  const [error, setError] = useState("");
  const [notify, setNotify] = useState({ open: false, text: "" });
  const [conversation, setConversation] = useState<any>({});
  const [users, setUsers] = useState<any>({});
  const [votes, setVotes] = useState<any>({});
  function getdata() {
    axios
      .get(`/api/thread/${props.id}/conversation`)
      .then((res) => {
        (async () => {slink =
          res.data.slink ||
          `https://l.wcyat.me/${
            (
              await axios.post("https://api-us.wcyat.me/create", {
                url: window.location.origin + window.location.pathname,
              })
            ).data.id
        }`;})()
        setConversation(res.data);
        document.title = `${res.data.title} | Metahkg`;
      })
      .catch((err) => {
        setError(err.response.data);
        return;
      });
    axios.get(`/api/thread/${props.id}/users`).then((res) => {
      setUsers(res.data);
    });
    if (localStorage.user) {
      axios
        .post("/api/getvotes", { id: Number(props.id) })
        .then((res) => {
          setVotes(res.data);
        });
    }
  }
  if (error && !notify.open) {
    setNotify({ open: true, text: error });
  }
  if (!Object.keys(conversation).length && !Object.keys(users).length) {
    getdata();
  }
  const ready = !!(Object.keys(conversation).length && Object.keys(users).length
  && (localStorage.user ? Object.keys(votes).length : 1));
  return (
    <div className="conversation" style={{ minHeight: "100vh" }}>
      <Notification notify={notify} setNotify={setNotify} />
      {!error && (
        <div>
          {!ready && (
            <LinearProgress sx={{ width: "100%" }} color="secondary" />
          )}
          <Title
            slink={slink}
            category={conversation.category}
            title={conversation.title}
          />
          <Paper sx={{ overflow: "auto", maxHeight: "calc(100vh - 61px)" }}>
            <Box sx={{ backgroundColor: "primary.dark", width: "100%" }}>
              {ready && Object.entries(conversation.conversation).map((entry: any) => (
        <Comment
          name={users?.[entry[1].user].name}
          id={entry[0]}
          op={users?.[entry[1].user].name === conversation.op ? true : false}
          sex={users?.[entry[1].user].sex === "male" ? true : false}
          date={entry[1].createdAt}
          tid={props.id}
          up={entry[1].up | 0}
          down={entry[1].down | 0}
          vote={votes?.[entry[0]]}
          userid={entry[1].user}
        >
          {DOMPurify.sanitize(entry[1]?.comment)}
        </Comment>
        ))}
            </Box>
          </Paper>
        </div>
      )}
    </div>
  );
}
export default memo(Conversation);
