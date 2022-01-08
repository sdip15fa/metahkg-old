import React from "react";
import { Box } from '@mui/material';
import Comment from "./comment";
import Title from "./title";
import axios from "axios";
import {isMobile} from 'react-device-detect';
import ResponsiveAppbar from "./Appbar";
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
        ready : false}
    async getdata() {
        await axios.get(`/api/thread/${this.props.id}/conversation`).then(res => {
            this.conversation = res.data;})
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
        if (!this.state.ready) {this.getdata(); return <p style={{color: "white"}}>Please wait...</p>};
        this.build();
        return (
          <div>
              <ResponsiveAppbar/>
              <Title title={this.conversation.title}/>
              <Box sx={{backgroundColor: "primary.dark", width: isMobile ? '100vw' : '80vw'}}>
                {this.o}
              </Box>
          </div>
        )}}