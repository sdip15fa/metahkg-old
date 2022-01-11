import { Box, Divider, Button } from '@mui/material';
import { Add as AddIcon, ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon } from '@mui/icons-material';
import humanizeDuration from 'humanize-duration-shortened-english';
import { roundup } from '../lib/common';
import React from 'react';
import SideBar from './sidebar';
import axios from 'axios';
export default class Menu extends React.Component {
    constructor(props:any) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);}
    data:any = [];
    state = {
        ready : false}
    time (sdate:string) {
        const startDate = new Date(sdate);
        const endDate = new Date();
        const diff = (endDate.getTime() - startDate.getTime());
        const r = humanizeDuration(diff, {round:true, spacer: "", delimiter: ""});
        return r;}
    componentDidMount() {
        axios.get('/api/newest')
        .then(res => {
            this.data = res.data;
            this.setState({ready: true});})}
    render () {
        return (
            <Box sx={{backgroundColor: 'primary.dark', width: '100%', minHeight: '100vh'}}>
              <Box sx={{backgroundColor: 'primary.main', width: '100%'}}>
                <div style={{display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                  <SideBar/>
                  <h3 style={{textAlign: 'center', color : '#F5BD1F'}}>Metahkg</h3>
                  <div style={{display: 'flex', justifyContent: 'end', width: '100%'}}>
                  <a style={{height: '30px', width: '30px'}} href='/create'>
                    <AddIcon style={{color: 'white'}}/>
                  </a>
                  </div>
                </div>
              </Box>
              <Divider/>
              {!this.state.ready ? <h3 style={{color: 'white', textAlign: 'center'}}>Please wait...</h3> :
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {this.data.map((thread:any) => (
                        <div>
                        <a style={{width: '100%', textDecoration: 'none'}} href={`/thread/${thread.id}`}>
                            <div style={{display: 'flex', flexDirection: 'column', marginLeft: "20px", marginRight: "20px"}}>
                            <Button variant="text" sx={{textTransform: "none", height: "35px"}}>
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: '10px'}}>
                                    <p style={{color : thread.sex === "male" ? '#0277bd' : 'red', fontSize: '16px', textAlign: 'left'}}><strong>{thread.op}</strong></p>
                                    <p style={{marginLeft: '5px', fontSize: '12px', color: 'grey'}}>{this.time(thread.lastModified)}</p>
                                    <div style={{marginLeft: '5px', height: '8px', width: '8px'}}>
                                    {thread.vote >= 0 ? <ThumbUpIcon style={{color: 'white', height: '12px', marginBottom: '10px'}}/> : <ThumbDownIcon style={{color: 'white', height: '12px', marginBottom: '10px'}}/>}
                                    </div>
                                    <p style={{fontSize: '12px', color: 'white', marginLeft: '15px'}}>{thread.vote}</p>
                                    <div style={{display: 'flex', justifyContent: 'end', width: '100%'}}>
                                    <p style={{textAlign: 'right', color: 'white'}}>{roundup(thread.c / 10)+" pages"}</p>
                                    </div>
                                </div>
                            </Button>
                            <Button variant="text" sx={{textTransform: "none", height: "50px"}}>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'left'}}>
                                  <p style={{color: 'white', fontSize: '22px'}}><strong>{thread.title}</strong></p>
                                </div>
                            </Button>
                            </div>
                        </a>
                        <Divider/>
                        </div>))}
                </div>}
            </Box>)}}