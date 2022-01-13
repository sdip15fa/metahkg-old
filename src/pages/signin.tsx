import React, { useEffect } from "react";
import { Alert, Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import hash from 'hash.js';
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import queryString from "query-string";
type severity = "success" | "info" | "warning" | "error";
export default function Signin() {
  const [state, setState] = React.useState<{
    user : string, pwd : string, disabled : boolean,
    alert : {severity : severity, text : string}}>({
    user : '', pwd : '', disabled : false,
    alert : {severity : "info", text : ''}});
    const params = queryString.parse(window.location.search);
    useEffect(() => {
      if (params.continue) {
        setState({...state, alert : {severity : "info", text : "Sign in to continue."}})}}, [])
    function signin () {
        setState({...state, alert : {severity : "info", text : "Signing in..."}, disabled : true});
        axios.post('/api/signin', {user : state.user, pwd : hash.sha256().update(state.pwd).digest("hex")})
        .then(res => {
            localStorage.signedin = true;
            localStorage.user = res.data.user;
            localStorage.id = res.data.id;
            if (params.returnto) {window.location.href = String(params.returnto)}
              else {window.location.href = '/'}})
        .catch(err => {
            setState({...state, alert : {severity : "error", text : err.response.data}, disabled : false})})}
        if (localStorage.signedin) {window.location.replace('/'); return <div/>;};
        return (
            <Box sx={{backgroundColor : 'primary.dark', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Box sx={{minHeight : '50vh', width : isMobile ? '100vw' : '50vw'}}>
                <div style={{marginLeft: '50px', marginRight: '50px'}}>
                  <div style={{display: 'flex', justifyContent: 'end'}}>
                    <Link to={`/register${window.location.search}`}><Button sx={{fontSize: '18px', textTransform: 'none'}} color="secondary" variant="text"><strong>Register</strong></Button></Link>
                  </div>
                  <h1 style={{textAlign : 'center', fontSize : '25px', color: 'white', marginBottom: '20px'}}>Sign in to your Metahkg account</h1>
                  {state.alert.text ? <Alert sx={{marginTop: '10px', marginBottom: '20px'}} severity={state.alert.severity}>{state.alert.text}</Alert> : <div/>}
                  <TextField sx={{marginBottom : '20px'}} color="secondary" type="text" label="Username / Email" variant="filled" 
                  onChange={(e) => {setState({...state, user : e.target.value})}} required fullWidth/>
                  <TextField sx={{marginBottom : '20px'}} color="secondary" type="password" label="Password" variant="filled"
                  onChange={(e) => {setState({...state, pwd : e.target.value})}} required fullWidth/>
                  <br/>
                  <Button disabled={state.disabled || !(state.user && state.pwd)} sx={{fontSize: '16px', height: '40px', marginTop: '10px'}} color="secondary" variant="contained" onClick={signin}>Sign in</Button>
                </div>
              </Box> 
            </Box>)}