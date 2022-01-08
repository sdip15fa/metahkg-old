import React from "react";
import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import hash from 'hash.js';
import Cookies from "js-cookie";
export default class Signin extends React.Component {
    constructor (props:any) {
        super(props);
        this.signin = this.signin.bind(this);}
    user = '';pwd = '';
    state = {
        warning : ''}
    signin () {
        if (!this.user) {this.setState({warning : "Username cannot be empty."}); return;};
        if (!this.pwd) {this.setState({warning : "Password cannot be empty"}); return;};
        axios.post('/api/signin', {user : this.user, pwd : hash.sha256().update(this.pwd).digest("hex")})
        .then(res => {
            Cookies.set('key', res.data.key);
            localStorage.signedin = true;
            localStorage.user = res.data.user;
            localStorage.id = res.data.id;
            window.location.href = '/'})
        .catch(err => {
            this.setState({warning: err.response.data})})}
    render () {
        if (localStorage.signedin) {window.location.replace('/')};
        return (
            <Box sx={{backgroundColor : 'primary.dark', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Box sx={{backgroundColor : 'secondary.dark', minHeight : '50vh', minWidth : '50vw'}}>
                <div style={{margin: '50px'}}>
                  <h1 style={{textAlign : 'center', fontSize : '20px'}}>Sign in to your Metahkg account</h1>
                  <TextField sx={{marginBottom : '20px'}} type="text" label="Username / Email" variant="standard" 
                  onChange={(e) => {this.user = e.target.value}} required fullWidth/>
                  <TextField sx={{marginBottom : '20px'}} type="password" label="Password" variant="standard"
                  onChange={(e) => {this.pwd = e.target.value}} required fullWidth/>
                  <br/>
                  <Button variant="outlined" onClick={this.signin}>Sign in</Button>
                  <p style={{color : 'red'}}>{this.state.warning}</p>
                </div>
              </Box> 
            </Box>)}}