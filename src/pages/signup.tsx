import React from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import hash from 'hash.js';
import * as EmailValidator from 'email-validator';
import { Box, TextField, Button, FormControl, Select, MenuItem, InputLabel, Alert } from '@mui/material';
import { isMobile } from 'react-device-detect';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import isNumber from 'is-number';
import queryString from 'query-string';
function Sex (props:any) {
    const [sex, setSex] = React.useState('');
    const changeHandler = 
    (e:any) => {props.changeHandler(e);
     setSex(e.target.value);}
    return (
        <FormControl sx={{minWidth: 200}}>
          <InputLabel color="secondary">Sex</InputLabel>
          <Select color="secondary" disabled={props.disabled} value={sex} 
            label="Sex" onChange={changeHandler}>
            <MenuItem value={1}>Male</MenuItem>
            <MenuItem value={0}>Female</MenuItem>
          </Select>
        </FormControl>)}
type severity = "success" | "info" | "warning" | "error";
export default class Register extends React.Component {
    constructor (props:any) {
        super(props);
        this.verify = this.verify.bind(this);
        this.register = this.register.bind(this);
        this.state = {
            user : '', email : '', pwd : '',
            sex : '', verify : <div/>, disabled : false, 
            waiting : false, htoken : '',
            code :'', alert : {severity: "info", text : ''}}}
    params = queryString.parse(window.location.search);
    state! : {
        user : string, email : string, pwd: string,
        sex : string, verify : JSX.Element, disabled : boolean,
        waiting : boolean, htoken : string,
        code : string, alert : {severity : severity, text : string}}
    verify () {
        this.setState({alert : {severity : "info", text : "Verifying..."}, disabled : true});
        axios.post('/api/verify', {email : this.state.email, code : Number(this.state.code)})
        .then(res => {
            Cookies.set('key', res.data.key);
            localStorage.user = this.state.user;
            localStorage.id = res.data.id;
            localStorage.signedin = true;
            window.location.href = String(this.params.returnto) || '/'})
        .catch(err => {
            this.setState({alert : {severity : "error", text : err.response.data}, disabled : false})})}
    register () {
        this.setState({alert : {severity : "info", text : "Registering..."}, disabled : true});
        if (!EmailValidator.validate(this.state.email)) {this.setState({alert : {severity : "error", text: "Email invalid"}, disabled : false}); return;}
        axios.post('/api/register',{email : this.state.email, user : this.state.user, 
            pwd : hash.sha256().update(this.state.pwd).digest("hex"), sex : this.state.sex, htoken: this.state.htoken})
        .then (() => {
            this.setState({verify : <TextField color="secondary" style={{marginTop: isMobile ? '20px' : '0px'}} variant="filled" label="verification code" onChange={(e) => {this.setState({code : e.target.value})}}/>, waiting : true, 
        alert : {severity : "success", text : "Please enter the verification code sent to your email address.\nIt will expire in 5 minutes."}, disabled : false});
        }).catch (err => {this.setState({alert : {severity : "error", text : err.response.data}, disabled : false});})}
    render () {
        if (localStorage.signedin) {window.location.replace('/'); return <div/>;};
        return (
            <Box sx={{backgroundColor: 'primary.dark', display : 'flex', alignItems: 'center', justifyContent: 'center', minHeight : '100vh', height: '100%'}}>
                <Box sx={{minHeight : '50vh', width : isMobile ? '100vw' : '50vw'}}>
                    <div style={{margin : '50px'}}>
                        <h1 style={{textAlign : 'center', fontSize: '25px', color : 'white', marginBottom: '20px'}}>Register a Metahkg account</h1>
                        {this.state.alert.text ? <Alert sx={{marginTop: '10px', marginBottom: '30px'}} severity={this.state.alert.severity}>{this.state.alert.text}</Alert> : <div/>}
                        <TextField sx={{marginBottom: '20px', input : {color : 'white'}}} color="secondary" disabled={this.state.waiting} variant="filled" type="text" onChange={(e) => {this.setState({user : e.target.value})}} label="Username" required fullWidth /> 
                        <TextField sx={{marginBottom: '20px', input : {color : 'white'}}} color="secondary" disabled={this.state.waiting} variant="filled" type="email" onChange={(e) => {this.setState({email : e.target.value})}} label="Email" required fullWidth/>
                        <TextField sx={{marginBottom: '20px', input : {color : 'white'}}} color="secondary" disabled={this.state.waiting} variant="filled" type="password" onChange={(e) => {this.setState({pwd : e.target.value})}} label="Password" required fullWidth/>
                        <div style={isMobile ? {} : {display: 'flex', flexDirection: 'row'}}>
                        <Sex disabled={this.state.waiting} changeHandler={(e:any) => {this.setState({sex : e.target.value ? "male" : "female"})}}/>
                        {isMobile ? <br/> : <div/>}
                        <div style={{display: 'flex', justifyContent: isMobile ? 'left' : 'end', width: '100%'}}>
                          {this.state.verify}
                        </div>
                        </div><br/>
                        <div style={isMobile ? {} : {display: 'flex', flexDirection: 'row', width: '100%'}}>
                        <div style={{display: 'flex', justifyContent: 'left', width: '100%'}}>
                          <HCaptcha theme='dark' sitekey="adbdce6c-dde2-46e1-b881-356447110fa7" onVerify={(token) => {this.setState({htoken : token})}}/>
                        </div>
                        <div style={{display: 'flex', justifyContent: isMobile ? 'left' : 'end', alignItems: 'center', width: '100%', marginTop: isMobile ? '20px' : '0px'}}>
                          <Button disabled={this.state.disabled || (this.state.waiting ? !(this.state.code && isNumber(this.state.code) && this.state.code.length === 6) : !(this.state.htoken && this.state.user && this.state.email && this.state.pwd && this.state.sex))} type="submit" sx={{fontSize: '16px', height: '40px'}} color="secondary" variant="contained" onClick={this.state.waiting ? this.verify : this.register}>{this.state.waiting ? 'Verify' : 'Register'}</Button>
                        </div>
                        </div>
                    </div>
                </Box>
            </Box>)}}