import React, { useEffect } from 'react';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import ResponsiveAppBar from '../components/Appbar';
import TextEditor from '../components/texteditor';
import { isMobile } from 'react-device-detect';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import axios from 'axios';
type severity = "success" | "info" | "warning" | "error";
class ChooseCat extends React.Component <{errorHandler: Function, changeHandler: Function}> {
  state = {
    data : {},
    cat : 0
  }
  componentDidMount() {
    axios.get('/api/categories/all')
    .then(res => {
      this.setState({data : res.data})})
    .catch(err => {this.props.errorHandler(err.response.data)})}
  changeHandler = (e:any) => {
    this.setState({cat : e.target.value});
    this.props.changeHandler(e);}
  render () {
    return (
    <div>
      {!Object.keys(this.state.data).length ? <div/> : 
      <FormControl sx={{minWidth: '200px'}}>
      <InputLabel color="secondary">Category</InputLabel>
      <Select color="secondary" value={this.state.cat}
      label="Category" onChange={this.changeHandler}>
        {Object.entries(this.state.data).map((d:any, i) => (
          <MenuItem value={Number(d[0])}>{d[1]}</MenuItem>
        ))}
      </Select>
      </FormControl>}
    </div>)}}
export default class Create extends React.Component {
    constructor(props:any) {
        super(props);
        this.create = this.create.bind(this);
        this.state = {
            htoken : '', title : '', cat : 0,
            icomment : '', disabled : false,
            alert : {severity : "info", text : ''}}}
    state! : {
        htoken : string, title : string, cat : number,
        icomment : string, disabled : boolean
        alert : {severity : severity, text : string}}
    create () {
        this.setState({alert : {severity : "info", text : "Creating topic..."}, disabled : true});
        axios.post('/api/create', {title : this.state.title, category : this.state.cat,
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
                  <TextField style={{marginBottom : '20px'}} variant="outlined" color="secondary" fullWidth label="Title" 
                  onChange={(e) => {this.setState({title : e.target.value})}}/>
                  <TextEditor changehandler={(v:any,e:any) => {this.setState({icomment : e.getContent()})}} text=''/>
                  <div style={{marginTop: '20px'}}>
                    <ChooseCat changeHandler={(e:any) => {this.setState({cat : e.target.value})}} 
                    errorHandler={(e:any) => {this.setState({alert : {severity : "error", text : e}})}}/>
                  </div>
                  <div style={isMobile ? {} : {display: 'flex', flexDirection: 'row', width: '100%', marginTop: '20px'}}>
                    <div style={{display: 'flex', justifyContent: 'left', width: '100%'}}>
                      <HCaptcha theme='dark' sitekey="adbdce6c-dde2-46e1-b881-356447110fa7" onVerify={(token) => {this.setState({htoken : token})}}/>
                    </div>
                    <div style={{display: 'flex', justifyContent: isMobile ? 'left' : 'end', alignItems: 'center', width: '100%', marginTop: isMobile ? '20px' : '0px'}}>
                      <Button disabled={this.state.disabled || !(this.state.icomment && this.state.title && this.state.htoken && this.state.cat)} style={{marginTop: '20px', fontSize: '16px', height: '40px'}} onClick={this.create} variant='contained' color='secondary'>Create</Button>
                    </div>
                  </div>
                  </div>
                </div>
            </Box>)}}