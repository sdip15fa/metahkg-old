import React, { memo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Paper,
  SelectChangeEvent,
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
  const [n, setN] = useState(Math.random());
  const navigate = useNavigate();
  !params.page && navigate(`${window.location.pathname}?page=1`);
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
          lastHeight = 0;
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
          document.getElementById(String(page + 1))?.scrollIntoView();
          const croot = document.getElementById("croot");
          // @ts-ignore
          if (!(croot?.clientHeight / 5 + 60 >= croot?.clientHeight) && (croot?.scrollHeight - croot?.scrollTop > croot?.clientHeight)) {
            // @ts-ignore
            croot.scrollTop -= croot?.clientHeight / 5;
          }
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
  function changePage(p: number) {
    //const reset = ![page - 1, page, page + 1].includes(p);
    /*reset &&*/ setConversation([]);
    setPages(1);
    setPage(p);
    lastHeight = 0;
    setEnd(false);
    setN(Math.random());
    navigate(`${window.location.pathname}?page=${p}`);
    axios.get(`/api/thread/${props.id}?type=2&page=${p}`).then((res) => {
      setConversation(res.data);
      if (res.data.length % 25) {
        setEnd(true);
      }
      document.getElementById(String(page))?.scrollIntoView();
    });
  }
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
            id="croot"
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
            }}
          >
            <Box sx={{ backgroundColor: "primary.dark", width: "100%" }}>
              {ready &&
                [...Array(pages)].map((p, index) => (
                  <Box>
                    <ReactVisibilitySensor
                      onChange={(isVisible) => {
                        const croot = document.getElementById("croot");
                        let page = roundup(conversation[0].id / 25) + index;
                        if (isVisible) {
                          lastHeight = croot?.scrollTop || lastHeight; 
                          navigate(`${window.location.pathname}?page=${page}`);
                        }
                        if (!isVisible && conversation.length) {
                          if (lastHeight !== croot?.scrollTop) {
                              // @ts-ignore
                              page = croot.scrollTop > lastHeight ? page : page - 1;
                              if (lastHeight && page !== Number(params.page) && page) {
                                navigate(`${window.location.pathname}?page=${page}`);
                              }
                            }
                        }
                      }}
                    >
                      <PageTop
                        id={roundup(conversation[0].id / 25) + index}
                        pages={roundup(details.c / 25)}
                        page={roundup(conversation[0].id / 25) + index}
                        onChange={(e: SelectChangeEvent<number>) => {
                          changePage(Number(e.target.value));
                        }}
                        last={!(roundup(conversation[0].id / 25) + index === 1 && !index)}
                        next={roundup(conversation[0].id / 25) + index !== roundup(details.c / 25)}
                        onLastClicked={() => {
                          changePage(roundup(conversation[0].id / 25) + index - 1);
                        }}
                        onNextClicked={() => {
                          changePage(roundup(conversation[0].id / 25) + index + 1);
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
