import { Alert, Box, Button } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { useParams } from "react-router";
import { Link } from 'react-router-dom';
import TextEditor from '../components/texteditor';
type severity = "success" | "info" | "warning" | "error";
class AddComment extends React.Component <any> {
    constructor (props:any) {
        super(props);
        this.addcomment = this.addcomment.bind(this);
        const id = this.props.params.id;
        this.id = Number(id);
        console.log(this.id);
        this.state = {
            comment : '', disabled : false,
            alert : {severity : "info", text : ''}}}
    id = 0;
    state! : {
        comment : string, disabled : boolean,
        alert : {severity : severity, text : string}}
    componentDidMount () {
        axios.post('/api/check', {id : this.id})
        .catch(err => {
            if (err.response.status === 404) {
                this.setState({alert : {severity : "warning", text : "Thread not found. Redirecting you to the homepage in 5 seconds."}});
                setTimeout(() => {window.location.replace('/');}, 5000)}
            else {this.setState({alert : {severity : "error", text : err.response.data}});}})}
    addcomment () {
        this.setState({disabled : true, alert : {severity : "info", text : "Adding comment..."}});
        axios.post('/api/comment', {id : this.id, comment : this.state.comment})
        .then (() => {
            window.location.href = `/thread/${this.id}`;})
        .catch (err => {
            this.setState({alert : {severity : "error", text : err.response.data}, disabled : false})})}
    render () {
        if (!localStorage.signedin) {window.location.replace('/signin'); return <div/>;}
        return (
            <Box sx={{backgroundColor: 'primary.dark', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{width: isMobile ? '100vw' : '80vw'}}>
                  <div style={{margin: '20px'}}>
                      <h2 style={{color: 'white', fontSize: '22px'}}>Add a comment to thread id {this.id}: <Link to={`/thread/${this.id}`}>link</Link></h2>
                      {this.state.alert.text ? <Alert sx={{marginTop: '10px', marginBottom: '10px'}} severity={this.state.alert.severity}>{this.state.alert.text}</Alert> : <div/>}
                      <TextEditor text="" changehandler={(v:any,e:any) => {this.setState({comment : e.getContent()})}}/>
                      <Button disabled={this.state.disabled || !this.state.comment} style={{marginTop: '20px', fontSize: '16px', height: '40px'}} onClick={this.addcomment} variant='contained' color='secondary'>Comment</Button>
                  </div>
                </div>
            </Box>)}}
export default (props:any) => (
    <AddComment params={useParams()}/>);