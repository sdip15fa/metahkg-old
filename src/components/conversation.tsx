import React, { memo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Paper,
} from "@mui/material";
import queryString from "query-string";
import Comment from "./comment";
import Title from "./title";
import axios from "axios";
import DOMPurify from "dompurify";
import { Notification } from "../lib/notification";
import { roundup, splitarray } from "../lib/common";
import { useNavigate } from "react-router";
import PageTop from "./conversation/pagetop";
import ReactVisibilitySensor from "react-visibility-sensor";
/*
 * Conversation component gets data from /api/thread/<thread id(props.id)>/<conversation/users>
 * Then renders it as Comments
 */
let lastHeight = 0;
function Conversation(props: { id: number }) {
  const params = queryString.parse(window.location.search);
  const [error, setError] = useState("");
  const [notify, setNotify] = useState({ open: false, text: "" });
  const [conversation, setConversation] = useState<any>([]);
  const [page, setPage] = useState(Number(params.page) || 1);
  const [users, setUsers] = useState<any>({});
  const [details, setDetails] = useState<any>({});
  const [votes, setVotes] = useState<any>({});
  const [updating, setUpdating] = useState(false);
  const [pages, setPages] = useState(1);
  const [end, setEnd] = useState(false);
  const [stpage, setStpage] = useState(Number(params.page) || 1);
  const [n, setN] = useState(Math.random());
  const [pageUpdated, setPageUpdated] = useState(false);
  const navigate = useNavigate();
  function getdata() {
    axios
      .get(`/api/thread/${props.id}?type=1`)
      .then((res) => {
        setDetails(res.data);
        document.title = `${res.data.title} | Metahkg`;
      })
      .catch((err) => {
        setError(err.response.data);
        return;
      });
    axios.get(`/api/thread/${props.id}?type=0`).then((res) => {
      setUsers(res.data);
    });
    axios.get(`/api/thread/${props.id}?type=2&page=${page}`).then((res) => {
      setConversation(res.data);
      if (res.data.length % 25) {
        setEnd(true);
      }
    });
    if (localStorage.user) {
      axios.post("/api/getvotes", { id: Number(props.id) }).then((res) => {
        setVotes(res.data);
      });
    }
  }
  function update() {
    setUpdating(true);
    axios
      .get(
        `/api/thread/${props.id}?type=2&page=${
          conversation[conversation.length - 1].id % 25 ? page : page + 1
        }`
      )
      .then((res) => {
        if (
          conversation?.[conversation.length - 1]?.id % 25 &&
          res.data.length
        ) {
          const c = conversation;
          for (
            let i =
              res.data.findIndex((n: any) => n.id === c[c.length - 1].id) + 1;
            i < res.data.length;
            i++
          ) {
            c.push(res.data?.[i]);
          }
          setConversation(c);
          setEnd(true);
        } else if (res.data.length) {
          const c = conversation;
          for (let i = 0; i < res.data.length; i++) {
            c.push(res.data?.[i]);
          }
          setConversation(c);
          setUpdating(false);
          setPage((page) => page + 1);
          setPages(Math.floor((c[c.length - 1].id - c[0].id) / 25) + 1);
          navigate(`/thread/${props.id}?page=${page + 1}`);
        } else {
          setEnd(true);
        }
        setUpdating(false);
      });
  }
  if (error && !notify.open) {
    setNotify({ open: true, text: error });
  }
  if (
    !conversation.length &&
    !Object.keys(users).length &&
    !Object.keys(details).length
  ) {
    getdata();
  }
  const ready = !!(
    conversation.length &&
    Object.keys(users).length &&
    Object.keys(details).length &&
    (localStorage.user ? Object.keys(votes).length : 1)
  );
  return (
    <div className="conversation" style={{ minHeight: "100vh" }}>
      <Notification notify={notify} setNotify={setNotify} />
      {!error && (
        <div>
          {!ready && (
            <LinearProgress sx={{ width: "100%" }} color="secondary" />
          )}
          <Title
            slink={details.slink}
            category={details.category}
            title={details.title}
          />
          <Paper
            key={n}
            sx={{ overflow: "auto", maxHeight: "calc(100vh - 48px)" }}
            onScroll={(e: any) => {
              if (!end && !updating) {
                const diff = e.target.scrollHeight - e.target.scrollTop;
                if (
                  e.target.clientHeight >= diff - 1.5 &&
                  e.target.clientHeight <= diff + 1.5 &&
                  !end
                ) {
                  update();
                }
              }
              if (lastHeight !== e.target.scrollTop) {
                if (lastHeight && !pageUpdated) {
                  const p =
                    e.target.scrollTop > lastHeight ? stpage : stpage - 1;
                  if (p !== Number(params.page) && p) {
                    navigate(`${window.location.pathname}?page=${p}`);
                    setPageUpdated(true);
                  }
                }
                lastHeight = e.target.scrollTop;
              }
            }}
          >
            <Box sx={{ backgroundColor: "primary.dark", width: "100%" }}>
              {ready &&
                [...Array(pages)].map((p, index) => (
                  <Box>
                    <ReactVisibilitySensor
                      onChange={(isVisible) => {
                        if (isVisible && conversation.length) {
                          setStpage(roundup(conversation[0].id / 25) + index);
                          console.log(
                            roundup(conversation[0].id / 25) + index,
                            index + 1
                          );
                          setPageUpdated(false);
                        }
                      }}
                    >
                      <PageTop
                        pages={roundup(details.c / 25)}
                        page={roundup(conversation[0].id / 25) + index}
                        onChange={(e: any) => {
                          setConversation([]);
                          setStpage(e.target.value);
                          setPages(1);
                          setPage(e.target.value);
                          setPageUpdated(true);
                          setEnd(false);
                          setN(Math.random());
                          navigate(
                            `${window.location.pathname}?page=${e.target.value}`
                          );
                          axios
                            .get(
                              `/api/thread/${props.id}?type=2&page=${e.target.value}`
                            )
                            .then((res) => {
                              setConversation(res.data);
                              if (res.data.length % 25) {
                                setEnd(true);
                              }
                            });
                        }}
                      />
                    </ReactVisibilitySensor>
                    {splitarray(
                      conversation,
                      index * 25,
                      (index + 1) * 25 - 1
                    ).map((entry: any) => (
                      <Comment
                        name={users?.[entry.user].name}
                        id={entry.id}
                        op={users?.[entry.user].name === details.op}
                        sex={users?.[entry.user].sex === "male" ? true : false}
                        date={entry.createdAt}
                        tid={props.id}
                        up={entry.up | 0}
                        down={entry.down | 0}
                        vote={votes?.[entry.id]}
                        userid={entry.user}
                      >
                        {DOMPurify.sanitize(entry?.comment)}
                      </Comment>
                    ))}
                  </Box>
                ))}
            </Box>
            <Box
              sx={{
                height: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!updating ? (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setEnd(false);
                    update();
                  }}
                >
                  Update
                </Button>
              ) : (
                <CircularProgress color="secondary" />
              )}
            </Box>
          </Paper>
        </div>
      )}
    </div>
  );
}
export default memo(Conversation);
