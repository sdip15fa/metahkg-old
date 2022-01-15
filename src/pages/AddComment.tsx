import { Alert, Box, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { isMobile } from "react-device-detect";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import TextEditor from "../components/texteditor";
type severity = "success" | "info" | "warning" | "error";
export default function AddComment() {
  const [state, setState] = React.useState<{
    comment: string;
    disabled: boolean;
    alert: { severity: severity; text: string };
  }>({
    comment: "",
    disabled: false,
    alert: { severity: "info", text: "" },
  });
  const params = useParams();
  const id = Number(params.id);
  let inittext = "";
  if (localStorage.reply) {
    inittext = `<blockquote style="color: #aca9a9; border-left: 2px solid #aca9a9; margin-left: 0"><div style="margin-left: 15px">${localStorage.reply}</div></blockquote>`;
    localStorage.removeItem('reply');}
  useEffect(() => {
    axios.post("/api/check", { id: id }).catch((err) => {
      if (err.response.status === 404) {
        setState({
          ...state,
          alert: {
            severity: "warning",
            text: "Thread not found. Redirecting you to the homepage in 5 seconds.",
          },
        });
        setTimeout(() => {
          window.location.replace("/");
        }, 5000);
      } else {
        setState({
          ...state,
          alert: { severity: "error", text: err.response.data },
        });
      }
    });
  }, []);
  function addcomment() {
    setState({
      ...state,
      disabled: true,
      alert: { severity: "info", text: "Adding comment..." },
    });
    axios
      .post("/api/comment", { id: id, comment: state.comment })
      .then(() => {
        window.location.href = `/thread/${id}`;
      })
      .catch((err) => {
        setState({
          ...state,
          alert: { severity: "error", text: err.response.data },
          disabled: false,
        });
      });
  }
  if (!localStorage.signedin) {
    window.location.replace(
      `/signin?continue=true&returnto=${window.location.pathname}`
    );
    return <div />;
  }
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: isMobile ? "100vw" : "80vw" }}>
        <div style={{ margin: "20px" }}>
          <h2 style={{ color: "white", fontSize: "22px" }}>
            Add a comment to thread id {id}:{" "}
            <Link to={`/thread/${id}`}>link</Link>
          </h2>
          {state.alert.text ? (
            <Alert
              sx={{ marginTop: "10px", marginBottom: "10px" }}
              severity={state.alert.severity}
            >
              {state.alert.text}
            </Alert>
          ) : (
            <div />
          )}
          <TextEditor
            text={inittext}
            changehandler={(v: any, e: any) => {
              setState({ ...state, comment: e.getContent() });
            }}
          />
          <Button
            disabled={state.disabled || !state.comment}
            style={{ marginTop: "20px", fontSize: "16px", height: "40px" }}
            onClick={addcomment}
            variant="contained"
            color="secondary"
          >
            Comment
          </Button>
        </div>
      </div>
    </Box>
  );
}
