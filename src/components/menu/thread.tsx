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
    <div>
      <Link
        style={{ width: "100%", textDecoration: "none" }}
        to={`/thread/${thread.id}?page=1`}
      >
        <Box
          className="menuthread"
          sx={id === thread.id ? { bgcolor: "#303030" } : {}}
        >
          <div
            style={{
              height: "35px",
              width: "100%",
            }}
          >
            <div className="threadtop">
              <div style={{ display: "flex", alignItems: "center" }}>
                <p
                  className="threadtoptext ml20"
                  style={{
                    color: thread.sex ? "#0277bd" : "red",
                    fontSize: "16px",
                  }}
                >
                  {thread.op}
                </p>
                <p className="threadtoptext ml5">
                  {timetoword(thread.lastModified)}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                {thread.vote >= 0 ? (
                  <ThumbUpIcon className="threadicons" />
                ) : (
                  <ThumbDownIcon className="threadicons" />
                )}
                <p className="threadtoptext">{thread.vote}</p>
                <CommentIcon className="threadicons" />
                <p className="threadtoptext">{thread.c}</p>
                <ArticleIcon className="threadicons" />
                <p className="threadtoptext mr10">
                  {String(roundup(thread.c / 25))}
                </p>
              </div>
            </div>
          </div>
          <div className="threadbottom">
            <p className="ml20 threadtitle">{thread.title}</p>
            {!!(cat === 1 || search || profile) && (
              <Link
                className="mr10"
                to={`/category/${thread.category}`}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  className="threadcatbtn"
                  sx={{ backgroundColor: "#333" }}
                >
                  <p className="threadcatname">{thread.catname}</p>
                </Button>
              </Link>
            )}
          </div>
        </Box>
      </Link>
    </div>
  );
}
