import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Reply as ReplyIcon,
} from "@mui/icons-material";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useHistory } from "../ContextProvider";
import Share from "./share";
/*
 * Thread title component
 * category: category of the thread'
 * title: title of the thread
 * slink: shortened link of the thread
 * renders: a link arrow to the previous category / search / profile / history,
 * or if this is the first page of this session, /category/>category id>
 * title beside the arrow
 * comment (/comment) and share buttons at the right
 * share button opens a popup
 */
export default function Title(props: {
  category: number;
  title: string;
  slink: string;
}) {
  const [open, setOpen] = useState(false);
  const [history] = useHistory();
  const params = useParams();
  const {category, title, slink} = props;
  return (
    <Box sx={{ backgroundColor: "primary.main", height: "47px" }}>
      <Share open={open} setOpen={setOpen} link={slink} title={title}/>
      <div
        style={{
          display: "flex",
          marginLeft: "10px",
          marginRight: "20px",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingRight: 10,
            overflow: "hidden",
          }}
        >
          {(history || category) && <Link to={history || `/category/${category}`}>
            <IconButton sx={{ margin: 0, padding: 0 }}>
              <ArrowBackIcon color="secondary" />
            </IconButton>
          </Link>}
          <Typography
            className="novmargin"
            sx={{
              color: "secondary.main",
              fontSize: "18px",
              paddingLeft: "10px",
              lineHeight: "24px",
              maxHeight: "24px",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {title}
          </Typography>
        </div>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Tooltip title="Comment" arrow>
            <a
              style={{ textDecoration: "none" }}
              href={`/comment/${params.id}`}
            >
              <IconButton>
                <ReplyIcon
                  sx={{ color: "white", height: "24px", width: "24px" }}
                />
              </IconButton>
            </a>
          </Tooltip>
          <Tooltip title="Share" arrow>
            <IconButton
              onClick={() => {
                setOpen(true);
              }}
            >
              <ShareIcon sx={{ color: "white", fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </div>
    </Box>
  );
}
