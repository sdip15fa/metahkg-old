import "./css/signin.css";
import React, { useEffect, useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import axios from "axios";
import hash from "hash.js";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import queryString from "query-string";
import { useMenu } from "../components/MenuProvider";
import { useWidth } from "../components/ContextProvider";
import { severity } from "../lib/common";
import MetahkgLogo from "../components/logo";
/*
 * /signin
 * The Signin component collects data from user then send to the server /api/signin
 * If sign in is successful, a cookie "key" would be set by the server, which is the api key
 * If user is already signed in, he is redirected to /
 * After signing in, user is redirected to query.returnto if it exists, otherwise /
 */
export default function Signin() {
  document.title = "Sign in | Metahkg";
  const navigate = useNavigate();
  const [menu, setMenu] = useMenu();
  const [width] = useWidth();
  menu && setMenu(false);
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState<{ severity: severity; text: string }>({
    severity: "info",
    text: "",
  });
  const query = queryString.parse(window.location.search);
  useEffect(() => {
    if (query.continue) {
      setAlert({ severity: "info", text: "Sign in to continue." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function signin() {
    setAlert({ severity: "info", text: "Signing in..." });
    setDisabled(true);
    axios
      .post("/api/signin", {
        user: user,
        pwd: hash.sha256().update(pwd).digest("hex"),
      })
      .then((res) => {
        localStorage.user = res.data.user;
        localStorage.id = res.data.id;
        navigate(decodeURIComponent(String(query.returnto || "/")));
      })
      .catch((err) => {
        setAlert({ severity: "error", text: err?.response?.data?.error || err?.response?.data || "" });
        setDisabled(false);
      });
  }
  if (localStorage.user) {
    navigate("/", { replace: true });
    return <div />;
  }
  return (
    <Box
      className="flex align-center justify-center fullwidth min-height-fullvh"
      sx={{
        backgroundColor: "primary.dark",
      }}
    >
      <Box
        className="signin-main-box"
        sx={{
          width: width < 760 ? "100vw" : "50vw",
        }}
      >
        <div className="signin-main-div">
          <div className="flex fullwidth justify-flex-end">
            <Link
              className="notextdecoration"
              to={`/register${window.location.search}`}
            >
              <Button
                className="flex notexttransform signin-toregister-btn"
                color="secondary"
                variant="text"
              >
                Register
              </Button>
            </Link>
          </div>
          <div className="flex justify-center align-center">
            <MetahkgLogo height={50} width={40} svg light className="mb10" />
            <h1 className="signin-title-text mb20">Sign in</h1>
          </div>
          {!alert.text ? (
            <div />
          ) : (
            <Alert
              className="mb20 mt10"
              severity={alert.severity}
            >
              {alert.text}
            </Alert>
          )}
          <TextField
            className="mb20"
            color="secondary"
            type="text"
            label="Username / Email"
            variant="filled"
            onChange={(e) => {
              setUser(e.target.value);
            }}
            required
            fullWidth
          />
          <TextField
            className="mb20"
            color="secondary"
            type="password"
            label="Password"
            variant="filled"
            onChange={(e) => {
              setPwd(e.target.value);
            }}
            required
            fullWidth
          />
          <br />
          <Button
            disabled={disabled || !(user && pwd)}
            className="mt10 signin-btn"
            color="secondary"
            variant="contained"
            onClick={signin}
          >
            Sign in
          </Button>
        </div>
      </Box>
    </Box>
  );
}
