import { Box, Button } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { useParams } from "react-router";
import ResponsiveAppBar from '../components/Appbar';
import TextEditor from '../components/texteditor';
class AddComment extends React.Component <any> {
    constructor (props:any) {
        super(props);
        this.addcomment = this.addcomment.bind(this);
        const id = this.props.params.id;
        this.id = Number(id);
        console.log(this.id);
    }
    state = {
        warning : ''}
    comment = '';
    id = 0;
    addcomment () {
        if (!this.comment) {this.setState({warning : "Comment cannot be empty."}); return;}
        axios.post('/api/comment', {id : this.id, comment : this.comment})
        .then (() => {
            window.location.href = `${window.location.origin}/thread/${this.id}`;})
        .catch (err => {
            this.setState({warning : err.response.data})})}
    render () {
        if (!localStorage.signedin) {window.location.replace('/register')}
        return (
            <Box sx={{backgroundColor: 'primary.dark', minHeight: '100vh', display: 'flex', justifyContent: 'center'}}>
                <div style={{width: isMobile ? '100vw' : '80vw'}}>
                  <div style={{margin: '20px'}}>
                      <ResponsiveAppBar/>
                      <p style={{color: 'white', fontSize: '18px'}}>Add a comment to thread id {this.id}: <a href={`${window.location.origin}/thread/${this.id}`}>link</a></p>
                      <TextEditor text="" changehandler={(v:any,e:any) => {this.comment = e.getContent()}}/>
                      <Button style={{marginTop: '20px'}} onClick={this.addcomment} variant='contained' color='secondary'>Comment</Button>
                      <p style={{color : 'red'}}>{this.state.warning}</p>
                  </div>
                </div>
            </Box>)}}
export default (props:any) => (
    <AddComment
        params={useParams()}
    />
);