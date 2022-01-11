import React from 'react';
import { Alert, Box, Button, TextField } from '@mui/material';
import ResponsiveAppBar from '../components/Appbar';
import TextEditor from '../components/texteditor';
import { isMobile } from 'react-device-detect';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import axios from 'axios';
type severity = "success" | "info" | "warning" | "error";
export default class Create extends React.Component {
    constructor(props:any) {
        super(props);
        this.create = this.create.bind(this);
        this.state = {
            htoken : '', title : '',
            icomment : '', disabled : false,
            alert : {severity : "info", text : ''}}}
    state! : {
        htoken : string, title : string, 
        icomment : string, disabled : boolean
        alert : {severity : severity, text : string}}
    create () {
        this.setState({alert : {severity : "info", text : "Creating topic..."}, disabled : true});
        axios.post('/api/create', {title : this.state.title, 
        icomment : this.state.icomment, htoken : this.state.htoken})
        .then(res => {
            window.location.href = `/thread/${res.data.id}`;})
        .catch(err => {
            this.setState({alert : {severity : "error", text : err.response.data}, disabled : false});})} 
    render () {
        if (!localStorage.signedin) {window.location.replace('/signin')};
        return (
            <Box sx={{backgroundColor: 'primary.dark', minHeight: '100vh', display: 'flex', justifyContent: 'center'}}>
                <div style={{width: isMobile ? '100vw' : '80vw'}}>
                  <div style={{margin: '20px'}}>
                  <ResponsiveAppBar/>
                  <h1 style={{color : 'white'}}>Create new topic</h1>
                  {this.state.alert.text ? <Alert sx={{marginTop: '10px', marginBottom: '10px'}} severity={this.state.alert.severity}>{this.state.alert.text}</Alert> : <div/>}
                  <TextField variant="outlined" color="secondary" fullWidth label="Title" 
                  onChange={(e) => {this.setState({title : e.target.value})}}/>
                  <TextEditor onChange={(v:any,e:any) => {this.setState({icomment : e.getContent()})}} text=''/>
                  <div style={isMobile ? {} : {display: 'flex', flexDirection: 'row', width: '100%', marginBottom: '20px'}}>
                    <div style={{display: 'flex', justifyContent: 'left', width: '100%'}}>
                      <HCaptcha theme='dark' sitekey="adbdce6c-dde2-46e1-b881-356447110fa7" onVerify={(token) => {this.setState({htoken : token})}}/>
                    </div>
                    <div style={{display: 'flex', justifyContent: isMobile ? 'left' : 'end', alignItems: 'center', width: '100%', marginTop: isMobile ? '20px' : '0px'}}>
                      <Button disabled={this.state.disabled || !(this.state.icomment && this.state.title && this.state.htoken)} style={{marginTop: '20px'}} onClick={this.create} variant='contained' color='secondary'>Create</Button>
                    </div>
                  </div>
                  </div>
                </div>
            </Box>)}}