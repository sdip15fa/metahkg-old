import React, { useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import TextEditor from "../components/texteditor";
import { isMobile } from "react-device-detect";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import axios from "axios";
import { useNavigate } from "react-router";
declare const hcaptcha: any;
type severity = "success" | "info" | "warning" | "error";
function ChooseCat(props: { errorHandler: Function; changeHandler: Function }) {
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
  const changeHandler = (e: any) => {
    setState({ ...state, cat: e.target.value });
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
            {Object.entries(state.data).map((d: any, i) => (
              <MenuItem value={Number(d[0])}>{d[1]}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
}
export default function Create() {
  const navigate = useNavigate();
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
      }}
    >
      <div style={{ width: isMobile ? "100vw" : "80vw" }}>
        <div style={{ margin: "20px" }}>
          <h1 style={{ color: "white" }}>Create new topic</h1>
          {!state.alert.text ? <div/> : (
            <Alert
              sx={{ marginTop: "10px", marginBottom: "10px" }}
              severity={state.alert.severity}
            >
              {state.alert.text}
            </Alert>
          )}
          <TextField
            style={{ marginBottom: "20px" }}
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
              isMobile
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
                justifyContent: isMobile ? "left" : "flex-end",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Button
                disabled={
                  state.disabled ||
                  !(state.icomment && state.title && state.htoken && state.cat)
                }
                style={{ marginTop: "20px", fontSize: "16px", height: "40px" }}
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
