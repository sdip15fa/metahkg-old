import React from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import hash from 'hash.js';
import * as EmailValidator from 'email-validator';
import { Box, TextField, Button, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
function Sex (props:any) {
    const [sex, setSex] = React.useState('');
    const changeHandler = 
    (e:any) => {props.changeHandler(e);
     setSex(e.target.value);}
    return (
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sex</InputLabel>
          <Select value={sex} label="Sex"
            onChange={changeHandler}>
            <MenuItem value={1}>Male</MenuItem>
            <MenuItem value={0}>Female</MenuItem>
          </Select>
        </FormControl>)}
export default class Register extends React.Component {
    constructor (props:any) {
        super(props);
        this.verify = this.verify.bind(this);
        this.register = this.register.bind(this);}
    email = '';user = '';
    pwd = '';code = '';sex = '';
    state = {
        verify : <div/>,
        waiting : false,
        warning : ''}
    verify () {
        this.setState({warning : ''});
        axios.post('/api/verify', {email : this.email, code : Number(this.code)})
        .then(res => {
            Cookies.set('key', res.data.key);
            localStorage.user = this.user;
            localStorage.id = res.data.id;
            localStorage.signedin = true;
            window.location.href = '/'})
        .catch(err => {
            this.setState({warning : err.response.data})})}
    register () {
        if (!this.user) {this.setState({warning : 'Username cannot be empty.'}); return;}
        else if (!this.email) {this.setState({warning : 'Email cannot be empty.'}); return;}
        else if (!this.pwd) {this.setState({warning : 'Password cannot be empty.'}); return;}
        else if (!this.sex) {this.setState({warning : 'You must select a sex.'}); return;}
        else if (!EmailValidator.validate(this.email)) {this.setState({warning : 'Email invalid.'}); return;}
        this.setState({warning : ''});
        axios.post('/api/register',{email : this.email, user : this.user, 
            pwd : hash.sha256().update(this.pwd).digest("hex"), sex : this.sex})
        .then (() => {
            this.setState({verify : <TextField style={{marginBottom : '20px', marginTop: '20px'}} variant="outlined" label="verification code" onChange={(e) => {this.code = e.target.value}}/>, waiting : true });
        }).catch (err => {this.setState({warning : err.response.data});})}
    render () {
        return (
            <Box sx={{backgroundColor: 'primary.dark', display : 'flex', alignItems: 'center', justifyContent: 'center', minHeight : '100vh'}}>
                <Box sx={{backgroundColor : 'secondary.dark', minHeight : '50vh', minWidth : '50vw'}}>
                    <div style={{margin : '50px'}}>
                        <h1 style={{textAlign : 'center', fontSize: '20px'}}>Register a Metahkg account</h1>
                        <TextField style={{marginBottom: '20px'}} disabled={this.state.waiting} variant="standard" type="text" onChange={(e) => {this.user = e.target.value}} label="Username" required fullWidth /> 
                        <TextField style={{marginBottom: '20px'}} disabled={this.state.waiting} variant="standard" type="email" onChange={(e) => {this.email = e.target.value}} label="Email" required fullWidth/>
                        <TextField style={{marginBottom: '20px'}} disabled={this.state.waiting} variant="standard" type="password" onChange={(e) => {this.pwd = e.target.value}} label="Password" required fullWidth/>
                        <Sex changeHandler={(e:any) => {this.sex = e.target.value ? "male" : "female"}}/><br/>
                        {this.state.verify}<br/>
                        <Button variant="outlined" onClick={this.state.waiting ? this.verify : this.register}>{this.state.waiting ? 'Verify' : 'Register'}</Button>
                        <p style={{color : 'red'}}>{this.state.warning}</p>
                    </div>
                </Box>
            </Box>)}}