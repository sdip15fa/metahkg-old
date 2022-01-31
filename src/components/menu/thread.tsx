import React from "react";
import { Divider, Button, Typography } from "@mui/material";
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from "@mui/icons-material";
import { timetoword, roundup, summary } from "../../lib/common";
import { Link } from "react-router-dom";
import { useCat, useProfile, useSearch } from "../MenuProvider";
/*
 * A thread in the menu
 * Basic information about the thread is needed (see type summary in ../../lib/common)
 * category of the current menu is needed to decide whether category lebel is rendered or not
 */
export default function MenuThread(props: { thread: summary }) {
  const [cat] = useCat();
  const [search] = useSearch();
  const [profile] = useProfile();
  return (
    <div>
      <Link
        style={{ width: "100%", textDecoration: "none" }}
        to={`/thread/${props.thread.id}`}
      >
        <Button
          sx={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              textTransform: "none",
              height: "35px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                height: "35px",
                marginLeft: "10px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <p
                  style={{
                    color: props.thread.sex === "male" ? "#0277bd" : "red",
                    fontSize: "16px",
                    textAlign: "left",
                  }}
                >
                  {props.thread.op}
                </p>
                <p
                  style={{
                    marginLeft: "5px",
                    fontSize: "12px",
                    color: "#aca9a9",
                    paddingTop: "1px",
                  }}
                >
                  {timetoword(props.thread.lastModified)}
                </p>
                {props.thread.vote >= 0 ? (
                  <ThumbUpIcon
                    sx={{
                      color: "#aca9a9",
                      height: "12px",
                      paddingTop: "1px",
                    }}
                  />
                ) : (
                  <ThumbDownIcon
                    sx={{
                      color: "#aca9a9",
                      height: "12px",
                      paddingTop: "1px",
                    }}
                  />
                )}
                <p
                  style={{
                    fontSize: "12px",
                    color: "#aca9a9",
                    paddingTop: "1px",
                  }}
                >
                  {props.thread.vote}
                </p>
              </div>
              <p
                style={{
                  color: "#aca9a9",
                  fontSize: "12px",
                  paddingRight: "10px",
                }}
              >
                {String(roundup(props.thread.c / 25)) +
                  ` page${roundup(props.thread.c / 25) > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              textTransform: "none",
              alignItems: "center",
            }}
          >
            <p
              style={{
                color: "white",
                fontSize: "16px",
                paddingLeft: "10px",
                wordBreak: "break-word",
                marginTop: 0,
                marginBottom: "5px",
                lineHeight: "20px",
                maxHeight: "40px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                paddingRight: "30px",
                textAlign: "left",
              }}
            >
              {props.thread.title}
            </p>
            {(cat === 1 || search || profile) && (
              <Link
                to={`/category/${props.thread.category}`}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "15px",
                    textTransform: "none",
                    backgroundColor: "#333",
                    margin: "0px",
                    padding: "0px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "12px",
                      padding: "0px",
                      margin: "0px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {props.thread.catname}
                  </Typography>
                </Button>
              </Link>
            )}
          </div>
        </Button>
      </Link>
      <Divider />
    </div>
  );
}
