import React from "react";
import axios from "axios";
import hash from "hash.js";
import * as EmailValidator from "email-validator";
import {
  Box,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Alert,
} from "@mui/material";
import { isMobile } from "react-device-detect";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import isInteger from "is-sn-integer";
import queryString from "query-string";
import { useNavigate } from "react-router";
import { useMenu } from "../components/MenuProvider";
declare const hcaptcha: any;
function Sex(props: any) {
  const [sex, setSex] = React.useState("");
  const [menu, setMenu] = useMenu();
  if (menu) {
    setMenu(false);
  }
  const changeHandler = (e: any) => {
    props.changeHandler(e);
    setSex(e.target.value);
  };
  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel color="secondary">Sex</InputLabel>
      <Select
        color="secondary"
        disabled={props.disabled}
        value={sex}
        label="Sex"
        onChange={changeHandler}
      >
        <MenuItem value={1}>Male</MenuItem>
        <MenuItem value={0}>Female</MenuItem>
      </Select>
    </FormControl>
  );
}
type severity = "success" | "info" | "warning" | "error";
export default function Register() {
  const navigate = useNavigate();
  const [state, setState] = React.useState<{
    user: string;
    email: string;
    pwd: string;
    sex: string;
    disabled: boolean;
    waiting: boolean;
    htoken: string;
    code: string;
    alert: { severity: severity; text: string };
  }>({
    user: "",
    email: "",
    pwd: "",
    sex: "",
    disabled: false,
    waiting: false,
    htoken: "",
    code: "",
    alert: { severity: "info", text: "" },
  });
  const params = queryString.parse(window.location.search);
  function verify() {
    setState({
      ...state,
      alert: { severity: "info", text: "Verifying..." },
      disabled: true,
    });
    axios
      .post("/api/verify", { email: state.email, code: Number(state.code) })
      .then((res) => {
        localStorage.user = state.user;
        localStorage.id = res.data.id;
        localStorage.signedin = true;
        navigate(String(params.returnto || "/"));
      })
      .catch((err) => {
        setState({
          ...state,
          alert: { severity: "error", text: err.response.data },
          disabled: false,
        });
      });
  }
  function register() {
    setState({
      ...state,
      alert: { severity: "info", text: "Registering..." },
      disabled: true,
    });
    if (!EmailValidator.validate(state.email)) {
      setState({
        ...state,
        alert: { severity: "error", text: "Email invalid" },
        disabled: false,
      });
      return;
    }
    if (state.user.split(" ")[1] || state.user.length > 15) {
      setState({
        ...state,
        alert: {
          severity: "error",
          text: "Username must be one word and less than 16 characters.",
        },
        disabled: false,
      });
      return;
    }
    axios
      .post("/api/register", {
        email: state.email,
        user: state.user,
        pwd: hash.sha256().update(state.pwd).digest("hex"),
        sex: state.sex,
        htoken: state.htoken,
      })
      .then(() => {
        setState({
          ...state,
          waiting: true,
          alert: {
            severity: "success",
            text: "Please enter the verification code sent to your email address.\nIt will expire in 5 minutes.",
          },
          disabled: false,
        });
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
  if (localStorage.signedin) {
    window.location.replace("/");
    return <div />;
  }
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        height: "100%",
        width: "100%"
      }}
    >
      <Box sx={{ minHeight: "50vh", width: isMobile ? "100vw" : "50vw" }}>
        <div style={{ margin: "50px" }}>
          <h1
            style={{
              textAlign: "center",
              fontSize: "25px",
              color: "white",
              marginBottom: "20px",
            }}
          >
            Register a Metahkg account
          </h1>
          {!state.alert.text ? (
            <div />
          ) : (
            <Alert
              sx={{ marginTop: "10px", marginBottom: "30px" }}
              severity={state.alert.severity}
            >
              {state.alert.text}
            </Alert>
          )}
          <TextField
            sx={{ marginBottom: "20px", input: { color: "white" } }}
            color="secondary"
            disabled={state.waiting}
            variant="filled"
            type="text"
            onChange={(e) => {
              setState({ ...state, user: e.target.value });
            }}
            label="Username"
            required
            fullWidth
          />
          <TextField
            sx={{ marginBottom: "20px", input: { color: "white" } }}
            color="secondary"
            disabled={state.waiting}
            variant="filled"
            type="email"
            onChange={(e) => {
              setState({ ...state, email: e.target.value });
            }}
            label="Email"
            required
            fullWidth
          />
          <TextField
            sx={{ marginBottom: "20px", input: { color: "white" } }}
            color="secondary"
            disabled={state.waiting}
            variant="filled"
            type="password"
            onChange={(e) => {
              setState({ ...state, pwd: e.target.value });
            }}
            label="Password"
            required
            fullWidth
          />
          <div
            style={isMobile ? {} : { display: "flex", flexDirection: "row" }}
          >
            <Sex
              disabled={state.waiting}
              changeHandler={(e: any) => {
                setState({ ...state, sex: e.target.value ? "male" : "female" });
              }}
            />
            {isMobile ? <br /> : <div />}
            <div
              style={{
                display: "flex",
                justifyContent: isMobile ? "left" : "flex-end",
                width: "100%",
              }}
            >
              {!state.waiting ? (
                <div />
              ) : (
                <TextField
                  color="secondary"
                  style={{ marginTop: isMobile ? "20px" : "0px" }}
                  variant="filled"
                  label="verification code"
                  onChange={(e) => {
                    setState({ ...state, code: e.target.value });
                  }}
                />
              )}
            </div>
          </div>
          <br />
          <div
            style={
              isMobile
                ? {}
                : { display: "flex", flexDirection: "row", width: "100%" }
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
                marginTop: isMobile ? "20px" : "0px",
              }}
            >
              <Button
                disabled={
                  state.disabled ||
                  (state.waiting
                    ? !(
                        state.code &&
                        isInteger(state.code) &&
                        state.code.length === 6
                      )
                    : !(
                        state.htoken &&
                        state.user &&
                        state.email &&
                        state.pwd &&
                        state.sex
                      ))
                }
                type="submit"
                sx={{ fontSize: "16px", height: "40px" }}
                color="secondary"
                variant="contained"
                onClick={state.waiting ? verify : register}
              >
                {state.waiting ? "Verify" : "Register"}
              </Button>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
}
