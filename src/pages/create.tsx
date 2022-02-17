import React, { useState } from "react";
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
import { useCat, useData, useMenu, useProfile, useSearch } from "../components/MenuProvider";
import { useWidth } from "../components/ContextProvider";
import { categories, severity } from "../lib/common";
declare const hcaptcha: { reset: (e: string) => void }; //the hcaptcha object, defined to use hcaptcha.reload("")
/*
 * A select list to choose category
 * props.errorHandler: executed if categories cannot to fetched
 * props.changehandler: used as a callback after user changes category selection
 */
function ChooseCat(props: {
  cat: number;
  setCat: React.Dispatch<React.SetStateAction<number>>;
}) {
  const {cat, setCat} = props;
  const changeHandler = (e: SelectChangeEvent<number>) => {
    setCat(Number(e.target.value));
  };
  return (
    <div>
      {Object.keys(categories).length && (
        <FormControl sx={{ minWidth: "200px" }}>
          <InputLabel color="secondary">Category</InputLabel>
          <Select
            color="secondary"
            value={cat}
            label="Category"
            onChange={changeHandler}
          >
            {Object.entries(categories).map((d: [string, any]) => (
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
  const [profile, setProfile] = useProfile();
  const [cat, setCat] = useCat();
  const [search, setSearch] = useSearch();
  const [data, setData] = useData();
  const [catchoosed, setCatchoosed] = useState<number>(cat);
  menu && setMenu(false);
  const [state, setState] = React.useState<{
    htoken: string;
    title: string;
    icomment: string;
    disabled: boolean;
    alert: { severity: severity; text: string };
  }>({
    htoken: "",
    title: "",
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
        category: catchoosed,
        icomment: state.icomment,
        htoken: state.htoken,
      })
      .then((res) => {
        cat && setCat(0);
        search && setSearch(false);
        profile && setProfile(0);
        data.length && setData([]);
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
            <ChooseCat cat={catchoosed} setCat={setCatchoosed}/>
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
                  !(state.icomment && state.title && state.htoken && catchoosed)
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
