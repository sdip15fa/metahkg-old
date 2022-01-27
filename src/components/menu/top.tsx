import React from "react";
import {
  Add as AddIcon,
  Autorenew as AutorenewIcon,
} from "@mui/icons-material";
import { Box, Button, Divider, IconButton, Tooltip } from "@mui/material";
import { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import SideBar from "../sidebar";
export default function MenuTop(props: {
  title: string;
  refresh: MouseEventHandler<HTMLButtonElement>;
  buttons: (string | undefined)[];
  selected: number;
  onClick: (e:number) => void;
}) {
  return (
    <div>
      <Box
        sx={{ backgroundColor: "primary.main", width: "100%", height: "90px" }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            height: "50px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ paddingLeft: "10px", marginRight: "40px" }}>
            <SideBar />
          </div>
          <p
            style={{
              color: "#F5BD1F",
              fontSize: "18px",
              marginTop: "0px",
              marginBottom: "0px",
              userSelect: "none",
            }}
          >
            {props.title}
          </p>
          <div style={{ display: "flex" }}>
            <Tooltip title="Refresh" arrow>
              <IconButton onClick={props.refresh}>
                <AutorenewIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Create topic" arrow>
              <Link style={{ display: "flex" }} to="/create">
                <IconButton sx={{ marginRight: "10px" }}>
                  <AddIcon sx={{ color: "white" }} />
                </IconButton>
              </Link>
            </Tooltip>
          </div>
        </div>
        <div
          style={{
            fontSize: "20px",
            display: "flex",
            width: "100%",
            alignItems: "flex-end",
            height: "40px",
          }}
        >
          {props.buttons.map((button, index) => (
            <Button
              variant="text"
              color="secondary"
              onClick={() => {
                props.onClick(index);
              }}
              sx={{
                marginLeft: index === 0 ? "10px" : "0px",
                borderRadius: "0px",
                textTransform: "none",
                borderBottom:
                  props.selected === index ? "3px solid rgb(245, 189, 31)" : "",
                width: "100%",
                marginRight: "10px",
              }}
            >
              {button}
            </Button>
          ))}
        </div>
      </Box>
      <Divider />
    </div>
  );
}
