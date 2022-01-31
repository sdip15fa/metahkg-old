import React, { useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import TextEditor from "../components/texteditor";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import axios from "axios";
import { useNavigate } from "react-router";
import { useMenu } from "../components/MenuProvider";
import { useWidth } from "../components/ContextProvider";
import { severity } from "../lib/common";
declare const hcaptcha: { reset: (e: string) => void }; //the hcaptcha object, defined to use hcaptcha.reload("")
/*
 * A select list to choose category
 * props.errorHandler: executed if categories cannot to fetched
 * props.changehandler: used as a callback after user changes category selection
 */
function ChooseCat(props: {
  errorHandler: (e: string) => void;
  changeHandler: (e: SelectChangeEvent<number>) => void;
}) {
  const [state, setState] = React.useState<{ data: any; cat: number }>({
    data: {},
    cat: 0,
  });
  useEffect(() => {
    axios
      .get("/api/categories/all")
      .then((res) => {
        setState({ ...state, data: res.data });
      })
      .catch((err) => {
        props.errorHandler(err.response.data);
      });
  }, []);
  const changeHandler = (e: SelectChangeEvent<number>) => {
    setState({ ...state, cat: Number(e.target.value) });
    props.changeHandler(e);
  };
  return (
    <div>
      {Object.keys(state.data).length && (
        <FormControl sx={{ minWidth: "200px" }}>
          <InputLabel color="secondary">Category</InputLabel>
          <Select
            color="secondary"
            value={state.cat}
            label="Category"
            onChange={changeHandler}
          >
            {Object.entries(state.data).map((d: [string, any]) => (
              <MenuItem value={Number(d[0])}>{d[1]}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
}
/*
 * Create component for /create
 * renders a tinymce editor (for content) and a textfield (for title)
 * A captcha must be completed before a user can create a thread
 * The user must be signed in, otherwise he would be redirected to /signin
 */
export default function Create() {
  document.title = "Create topic | Metahkg";
  const navigate = useNavigate();
  const [menu, setMenu] = useMenu();
  const [width] = useWidth();
  if (menu) {
    setMenu(false);
  }
  const [state, setState] = React.useState<{
    htoken: string;
    title: string;
    cat: number;
    icomment: string;
    disabled: boolean;
    alert: { severity: severity; text: string };
  }>({
    htoken: "",
    title: "",
    cat: 0,
    icomment: "",
    disabled: false,
    alert: { severity: "info", text: "" },
  });
  function create() {
    //sends data to /api/create
    setState({
      ...state,
      alert: { severity: "info", text: "Creating topic..." },
      disabled: true,
    });
    axios
      .post("/api/create", {
        title: state.title,
        category: state.cat,
        icomment: state.icomment,
        htoken: state.htoken,
      })
      .then((res) => {
        navigate(`/thread/${res.data.id}`);
      })
      .catch((err) => {
        setState({
          ...state,
          alert: { severity: "error", text: err.response.data },
          disabled: false,
        });
        hcaptcha.reset("");
      });
  }
  if (!localStorage.user) {
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
        width: "100%",
      }}
    >
      <div style={{ width: width < 760 ? "100vw" : "80vw" }}>
        <div style={{ margin: "20px" }}>
          <h1 style={{ color: "white" }}>Create new topic</h1>
          {!state.alert.text ? (
            <div />
          ) : (
            <Alert
              sx={{ marginTop: "10px", marginBottom: "10px" }}
              severity={state.alert.severity}
            >
              {state.alert.text}
            </Alert>
          )}
          <TextField
            sx={{ marginBottom: "20px" }}
            variant="outlined"
            color="secondary"
            fullWidth
            label="Title"
            onChange={(e) => {
              setState({ ...state, title: e.target.value });
            }}
          />
          <TextEditor
            changehandler={(v: any, e: any) => {
              setState({ ...state, icomment: e.getContent() });
            }}
            text=""
          />
          <div style={{ marginTop: "20px" }}>
            <ChooseCat
              changeHandler={(e: any) => {
                setState({ ...state, cat: e.target.value });
              }}
              errorHandler={(e: any) => {
                setState({ ...state, alert: { severity: "error", text: e } });
              }}
            />
          </div>
          <div
            style={
              width < 760
                ? { marginTop: "20px" }
                : {
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    marginTop: "20px",
                  }
            }
          >
            <div
              style={{ display: "flex", justifyContent: "left", width: "100%" }}
            >
              <HCaptcha
                theme="dark"
                sitekey="adbdce6c-dde2-46e1-b881-356447110fa7"
                onVerify={(token) => {
                  setState({ ...state, htoken: token });
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: width < 760 ? "left" : "flex-end",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Button
                disabled={
                  state.disabled ||
                  !(state.icomment && state.title && state.htoken && state.cat)
                }
                sx={{ marginTop: "20px", fontSize: "16px", height: "40px" }}
                onClick={create}
                variant="contained"
                color="secondary"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
