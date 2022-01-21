import { Divider, Button, Typography } from "@mui/material";
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from "@mui/icons-material";
import { timetoword, roundup } from "../../lib/common";
import { Link } from "react-router-dom";
export default function MenuThread(props: { thread: any, category: number }) {
  return (
    <div>
      <Link
        style={{ width: "100%", textDecoration: "none" }}
        to={`/thread/${props.thread.id}`}
      >
        <Button
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
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
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                height: "35px",
                marginLeft: "10px",
              }}
            >
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
                  style={{
                    color: "#aca9a9",
                    height: "12px",
                    paddingTop: "1px",
                  }}
                />
              ) : (
                <ThumbDownIcon
                  style={{
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  paddingRight: "10px",
                }}
              >
                <p
                  style={{
                    textAlign: "end",
                    color: "#aca9a9",
                    fontSize: "12px",
                  }}
                >
                  {roundup(props.thread.c / 10) +
                    ` page${roundup(props.thread.c / 10) > 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              textTransform: "none",
              height: "auto",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                lineHeight: "24px",
                overflow: "hidden",
                paddingRight: "30px",
              }}
            >
              <p
                style={{
                  color: "white",
                  fontSize: "16px",
                  paddingLeft: "10px",
                  maxWidth: "100%",
                  wordBreak: "break-word",
                  textAlign: "left",
                  marginTop: "5px",
                  marginBottom: "5px",
                  lineHeight: "20px",
                  maxHeight: "40px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {props.thread.title}
              </p>
            </div>
            {props.category === 1 &&
            <Link to={`/category/${props.thread.category}`}>
            <Button variant="contained" sx={{borderRadius: '15px', textTransform: 'none', backgroundColor: '#333', margin: '0px', padding: '0px'}}>
              <Typography sx={{color: 'white', fontSize: '12px', padding: '0px', margin: '0px', whiteSpace: 'nowrap'}}>{props.thread.catname}</Typography>
            </Button>
            </Link>
            }
          </div>
        </Button>
      </Link>
      <Divider />
    </div>
  );
}
