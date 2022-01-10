import { Box, Button } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { useParams } from "react-router";
import ResponsiveAppBar from '../components/Appbar';
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
    addcomment () {
        this.setState({disabled : true, alert : {severity : "info", text : "Adding comment..."}});
        axios.post('/api/comment', {id : this.id, comment : this.state.comment})
        .then (() => {
            window.location.href = `/thread/${this.id}`;})
        .catch (err => {
            this.setState({alert : {severity : "error", text : err.response.data}, disabled : false})})}
    render () {
        if (!localStorage.signedin) {window.location.replace('/register')}
        return (
            <Box sx={{backgroundColor: 'primary.dark', minHeight: '100vh', display: 'flex', justifyContent: 'center'}}>
                <div style={{width: isMobile ? '100vw' : '80vw'}}>
                  <div style={{margin: '20px'}}>
                      <ResponsiveAppBar/>
                      <p style={{color: 'white', fontSize: '18px'}}>Add a comment to thread id {this.id}: <a href={`/thread/${this.id}`}>link</a></p>
                      <TextEditor text="" changehandler={(v:any,e:any) => {this.setState({comment : e.getContent()})}}/>
                      <Button disabled={this.state.disabled || !this.state.comment} style={{marginTop: '20px'}} onClick={this.addcomment} variant='contained' color='secondary'>Comment</Button>
                  </div>
                </div>
            </Box>)}}
export default (props:any) => (
    <AddComment
        params={useParams()}
    />
);