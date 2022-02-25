import "./css/signup.css";
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
  SelectChangeEvent,
} from "@mui/material";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import isInteger from "is-sn-integer";
import queryString from "query-string";
import { useNavigate } from "react-router";
import { useMenu } from "../components/MenuProvider";
import { useWidth } from "../components/ContextProvider";
import { severity } from "../lib/common";
import MetahkgLogo from "../components/logo";
declare const hcaptcha: { reset: (e: string) => void };
/*
 * Sex selector
 * props.disabled: set the Select as disabled if true
 * props.changeHandler: callback to use when user changes selection
 */
function Sex(props: {
  changeHandler: (e: SelectChangeEvent<string>) => void;
  disabled: boolean;
}) {
  const [sex, setSex] = React.useState("");
  const [menu, setMenu] = useMenu();
  if (menu) {
    setMenu(false);
  }
  const changeHandler = (e: SelectChangeEvent<string>) => {
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
/*
 * Register component for /register
 * initially 3 text fields and a Select list (Sex)
 * When verification is pending
 * (waiting for user to type verification code sent to their email address),
 * there would be another textfield alongside Sex for the verification code
 * a captcha must be completed before registering, if registering fails,
 * the captcha would reload
 * process: register --> verify --> account created -->
 * redirect to query.returnto if exists, otherwise homepage after verification
 * If user already signed in, he is redirected to /
 */
export default function Register() {
  document.title = "Register | Metahkg";
  const navigate = useNavigate();
  const [width] = useWidth();
  const [state, setState] = React.useState<{
    user: string;
    email: string;
    pwd: string;
    sex: "M" | "F";
    disabled: boolean;
    waiting: boolean;
    htoken: string;
    code: string;
    alert: { severity: severity; text: string };
  }>({
    user: "",
    email: "",
    pwd: "",
    sex: "M",
    disabled: false,
    waiting: false,
    htoken: "",
    code: "",
    alert: { severity: "info", text: "" },
  });
  const query = queryString.parse(window.location.search);
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
        navigate(decodeURIComponent(String(query.returnto || "/")));
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
          htoken: "",
        });
        hcaptcha.reset("");
      });
  }
  if (localStorage.user) {
    window.location.replace("/");
    return <div />;
  }
  return (
    <Box
      className="signup-root flex fullwidth fullheight justify-center align-center"
      sx={{
        backgroundColor: "primary.dark",
      }}
    >
      <Box
        sx={{
          minHeight: "50vh",
          width: width < 760 ? "100vw" : "50vw",
        }}
      >
        <div style={{ margin: "50px" }}>
          <div className="flex justify-center align-center">
            <MetahkgLogo svg light height={50} width={40} className="mb10" />
            <h1 className="signup-title-text mb20">Register</h1>
          </div>
          {state.alert.text && (
            <Alert
              className="signup-alert mt10"
              severity={state.alert.severity}
            >
              {state.alert.text}
            </Alert>
          )}
          {["user", "email", "pwd"].map((item, index) => (
            <TextField
              sx={{ marginBottom: "20px", input: { color: "white" } }}
              color="secondary"
              disabled={state.waiting}
              variant="filled"
              type={item === "pwd" ? "password" : "text"}
              onChange={(e) => {
                setState({ ...state, [item]: e.target.value });
              }}
              label={["Username", "Email", "Password"][index]}
              required
              fullWidth
            />
          ))}
          <div
            style={width < 760 ? {} : { display: "flex", flexDirection: "row" }}
          >
            <Sex
              disabled={state.waiting}
              changeHandler={(e) => {
                setState({ ...state, sex: e.target.value ? "M" : "F" });
              }}
            />
            {width < 760 ? <br /> : <div />}
            <div
              style={{
                display: "flex",
                justifyContent: width < 760 ? "left" : "flex-end",
                width: "100%",
              }}
            >
              {!state.waiting ? (
                <div />
              ) : (
                <TextField
                  color="secondary"
                  sx={{
                    marginTop: width < 760 ? "20px" : "0px",
                  }}
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
              width < 760
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
                justifyContent: width < 760 ? "left" : "flex-end",
                alignItems: "center",
                width: "100%",
                marginTop: width < 760 ? "20px" : "0px",
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
