import React from "react";
import { Box, Paper } from '@mui/material';
import Comment from "./comment";
import Title from "./title";
import axios from "axios";
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
export default class Conversation extends React.Component<any> {
    constructor(props:any) {
        super(props);
        this.getdata = this.getdata.bind(this);
        this.build = this.build.bind(this);}
    o : JSX.Element[] = [];
    conversation:any = {};
    users:any = {};
    state = {
        ready : false,
        error : ''}
    async getdata() {
        await axios.get(`/api/thread/${this.props.id}/conversation`).then(res => {
            this.conversation = res.data;})
            .catch(err => {this.setState({error : err.response.data}); return;})
        await axios.get(`/api/thread/${this.props.id}/users`).then(res => {
            this.users = res.data;})
        this.setState({ready : true});}
    build() {
        Object.entries(this.conversation.conversation).map((entry:any) => {
            this.o.push(
                <Comment name={this.users[entry[1].user].name} 
                        id={entry[0]} 
                        op={this.users[entry[1].user].name === this.conversation.op ? true : false} 
                        sex={this.users[entry[1].user].sex === "male" ? true : false}>
                            {parse(DOMPurify.sanitize(entry[1].comment))}</Comment>
            )})}
    render() {
        if (this.state.error) {return <h1 style={{color : 'white'}}>{this.state.error}</h1>};
        if (!this.state.ready) {this.getdata(); return <p style={{color: "white", textAlign: 'center'}}>Please wait...</p>};
        this.build();
        return (
          <div style={{minHeight: '100vh'}}>
              <Title title={this.conversation.title}/>
              <Paper style={{overflow: "auto", maxHeight: "calc(100vh-61px)"}}>
              <Box sx={{backgroundColor: "primary.dark", width: '100%'}}>
                {this.o}
              </Box>
              </Paper>
          </div>)}}