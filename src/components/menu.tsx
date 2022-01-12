import { Box, Divider, Button } from '@mui/material';
import { Add as AddIcon, ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon } from '@mui/icons-material';
import humanizeDuration from 'humanize-duration-shortened-english';
import { roundup } from '../lib/common';
import React from 'react';
import SideBar from './sidebar';
import axios from 'axios';
import { Link } from 'react-router-dom';
export default class Menu extends React.Component <any> {
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
        const c = this.props.category || `bytid${this.props.id}`;
        axios.get(`/api/newest/${c}`)
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
                  <Link style={{height: '30px', width: '30px'}} to='/create'>
                    <AddIcon style={{color: 'white', marginRight: '10px'}}/>
                  </Link>
                  </div>
                </div>
              </Box>
              <Divider/>
              {!this.state.ready ? <h3 style={{color: 'white', textAlign: 'center'}}>Please wait...</h3> :
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {this.data.map((thread:any) => (
                        <div>
                        <Link style={{width: '100%', textDecoration: 'none'}} to={`/thread/${thread.id}`}>
                            <Button sx={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                            <div style={{textTransform: "none", height: "35px", width: '100%'}}>
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', height: '35px', marginLeft: '10px'}}>
                                    <p style={{color : thread.sex === "male" ? '#0277bd' : 'red', fontSize: '16px', textAlign: 'left'}}>{thread.op}</p>
                                    <p style={{marginLeft: '5px', fontSize: '12px', color: 'grey'}}>{this.time(thread.lastModified)}</p>
                                    {thread.vote >= 0 ? <ThumbUpIcon style={{color: 'white', height: '12px'}}/> : <ThumbDownIcon style={{color: 'white', height: '12px'}}/>}
                                    <p style={{fontSize: '12px', color: 'white'}}>{thread.vote}</p>
                                    <div style={{display: 'flex', justifyContent: 'end', width: '100%'}}>
                                    <p style={{textAlign: 'right', color: 'white', marginRight: '10px'}}>{roundup(thread.c / 10)+" pages"}</p>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div style={{textTransform: "none", height: "45px", width: '100%'}}>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'center', height: '45px'}}>
                                  <p style={{color: 'white', fontSize: '18px', marginLeft: '10px'}}>{thread.title}</p>
                                </div>
                            </div>
                            </Button>
                        </Link>
                        <Divider/>
                        </div>))}
                </div>}
            </Box>)}}