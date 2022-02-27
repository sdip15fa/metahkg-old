import { Alert, Box, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useWidth } from "../components/ContextProvider";
import { useMenu } from "../components/MenuProvider";
import TextEditor from "../components/texteditor";
import { roundup, severity } from "../lib/common";
let inittext = ""; //used for quoting
/*
 * AddComment component for /comment/:id adds a comment
 * if user not signed in, he would be redirected to /signin
 * if thread with the specified id is not found, user would be redirected to /
 * Renders a tinymce editor for editing comment
 * if localStorage.reply exists, tinymce's initial content is set to localStorage.reply
 * captcha not needed
 */
export default function AddComment() {
  document.title = "Comment | Metahkg";
  const navigate = useNavigate();
  const [menu, setMenu] = useMenu();
  const [width] = useWidth();
  menu && setMenu(false);
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
  if (localStorage.reply && localStorage.user) {
    inittext = `<blockquote style="color: #aca9a9; border-left: 2px solid #aca9a9; margin-left: 0"><div style="margin-left: 15px">${localStorage.reply}</div></blockquote><p></p>`;
    localStorage.removeItem("reply");
  }
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
          navigate("/", {replace:true});
        }, 5000);
      } else {
        setState({
          ...state,
          alert: { severity: "error", text: err.response.data },
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function addcomment() {
    //send data to server /api/comment
    setState({
      ...state,
      disabled: true,
      alert: { severity: "info", text: "Adding comment..." },
    });
    axios
      .post("/api/comment", { id: id, comment: state.comment })
      .then((res) => {
        navigate(`/thread/${id}?page=${roundup(res.data.id / 25)}`);
      })
      .catch((err) => {
        setState({
          ...state,
          alert: { severity: "error", text: err.response.data },
          disabled: false,
        });
      });
  }
  if (!localStorage.user) {
    navigate(
      `/signin?continue=true&returnto=${encodeURIComponent(
        window.location.href.replace(window.location.origin, "")
      )}`, {replace: true}
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
        width: "100%",
      }}
    >
      <div style={{ width: width < 760 ? "100vw" : "80vw" }}>
        <div style={{ margin: "20px" }}>
          <h2 style={{ color: "white", fontSize: "22px" }}>
            Add a comment to thread id {id}:{" "}
            <Link to={`/thread/${id}`}>link</Link>
          </h2>
          {state.alert.text && (
            <Alert
              sx={{ marginTop: "10px", marginBottom: "10px" }}
              severity={state.alert.severity}
            >
              {state.alert.text}
            </Alert>
          )}
          <TextEditor
            key={id}
            text={inittext}
            changehandler={(v: any, e: any) => {
              setState({ ...state, comment: e.getContent() });
            }}
          />
          <Button
            disabled={state.disabled || !state.comment}
            sx={{ marginTop: "20px", fontSize: "16px", height: "40px" }}
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
