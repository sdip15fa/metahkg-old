import React from "react";
import { Alert, Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import hash from 'hash.js';
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
type severity = "success" | "info" | "warning" | "error";
export default class Signin extends React.Component {
    constructor (props:any) {
        super(props);
        this.signin = this.signin.bind(this);
        this.state = {
          user : '', pwd : '', disabled : false,
          alert : {severity : "info", text : ''}}}
    state! : {
        user : string, pwd : string, disabled : boolean,
        alert : {severity : severity, text : string}}
    signin () {
        this.setState({alert : {severity : "info", text : "Signing in..."}, disabled : true});
        axios.post('/api/signin', {user : this.state.user, pwd : hash.sha256().update(this.state.pwd).digest("hex")})
        .then(res => {
            localStorage.signedin = true;
            localStorage.user = res.data.user;
            localStorage.id = res.data.id;
            window.location.href = '/'})
        .catch(err => {
            this.setState({alert : {severity : "error", text : err.response.data}, disabled : false})})}
    render () {
        if (localStorage.signedin) {window.location.replace('/'); return <div/>;};
        return (
            <Box sx={{backgroundColor : 'primary.dark', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '50px'}}>
              <Box sx={{minHeight : '50vh', width : isMobile ? '100vw' : '50vw'}}>
                <div style={{margin: '50px'}}>
                  <div style={{display: 'flex', justifyContent: 'end'}}>
                    <Link to="/register"><Button sx={{fontSize: '18px', textTransform: 'none'}} color="secondary" variant="text"><strong>Register</strong></Button></Link>
                  </div>
                  <h1 style={{textAlign : 'center', fontSize : '25px', color: 'white', marginBottom: '20px'}}>Sign in to your Metahkg account</h1>
                  {this.state.alert.text ? <Alert sx={{marginTop: '10px', marginBottom: '30px'}} severity={this.state.alert.severity}>{this.state.alert.text}</Alert> : <div/>}
                  <TextField sx={{marginBottom : '20px'}} color="secondary" type="text" label="Username / Email" variant="filled" 
                  onChange={(e) => {this.setState({user : e.target.value})}} required fullWidth/>
                  <TextField sx={{marginBottom : '20px'}} color="secondary" type="password" label="Password" variant="filled"
                  onChange={(e) => {this.setState({pwd : e.target.value})}} required fullWidth/>
                  <br/>
                  <Button disabled={this.state.disabled || !(this.state.user && this.state.pwd)} sx={{fontSize: '16px', height: '40px', marginTop: '10px'}} color="secondary" variant="contained" onClick={this.signin}>Sign in</Button>
                </div>
              </Box> 
            </Box>)}}