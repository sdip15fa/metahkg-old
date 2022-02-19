import React from "react";
import "./thread.css";
import { Button, Box } from "@mui/material";
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Article as ArticleIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import { timetoword, roundup, summary } from "../../lib/common";
import { Link } from "react-router-dom";
import { useCat, useId, useProfile, useSearch } from "../MenuProvider";
/*
 * A thread in the menu
 * Basic information about the thread is needed (see type summary in ../../lib/common)
 * category of the current menu is needed to decide whether category lebel is rendered or not
 */
export default function MenuThread(props: { thread: summary }) {
  const [cat] = useCat();
  const [search] = useSearch();
  const [profile] = useProfile();
  const [id] = useId();
  const { thread } = props;
  return (
    <Link
      className="fullwidth notextdecoration"
      to={`/thread/${thread.id}?page=1`}
    >
      <Box
        className="menuthread root fullwidth"
        sx={id === thread.id ? { bgcolor: "#303030 !important" } : {}}
      >
        <div className="menuthread top fullwidth">
          <div style={{ display: "flex", alignItems: "center" }}>
            <p
              className="menuthread op ml20"
              style={{
                color: thread.sex ? "#0277bd" : "red",
              }}
            >
              {thread.op}
            </p>
            <p className="menuthread toptext ml5">
              {timetoword(thread.lastModified)}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {thread.vote >= 0 ? (
              <ThumbUpIcon className="menuthread icons" />
            ) : (
              <ThumbDownIcon className="menuthread icons" />
            )}
            <p className="menuthread toptext">{thread.vote}</p>
            <CommentIcon className="menuthread icons" />
            <p className="menuthread toptext">{thread.c}</p>
            <ArticleIcon className="menuthread icons" />
            <p className="menuthread toptext mr10">
              {String(roundup(thread.c / 25))}
            </p>
          </div>
        </div>
        <div className="menuthread bottom fullwidth mb10">
          <p className="ml20 menuthread title">{thread.title}</p>
          {!!(cat === 1 || search || profile) && (
            <Link
              className="mr10 notextdecoration"
              to={`/category/${thread.category}`}
            >
              <Button variant="contained" className="menuthread catbtn">
                <p className="menuthread catname">{thread.catname}</p>
              </Button>
            </Link>
          )}
        </div>
      </Box>
    </Link>
  );
}
