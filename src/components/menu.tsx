import { Box, Divider, Button, Paper, IconButton, LinearProgress, Tooltip } from '@mui/material';
import { Add as AddIcon, ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon } from '@mui/icons-material';
import { roundup, timetoword } from '../lib/common';
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
    componentDidMount() {
        const c = this.props.id ? `bytid${this.props.id}` :this.props.category ;
        axios.get(`/api/newest/${c}`)
        .then(res => {
            this.data = res.data;
            this.setState({ready: true});})}
    render () {
        return (
            <Box sx={{backgroundColor: 'primary.dark', maxWidth: '100%', minHeight: '100vh'}}>
              <Box sx={{backgroundColor: 'primary.main', width: '100%'}}>
                <div style={{display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', height: '60px'}}>
                  <SideBar/>
                  <div style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <p style={{textAlign: 'center', color : '#F5BD1F', fontSize: '18px'}}>Metahkg</p>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'end'}}>
                  <Tooltip title="Create topic" arrow>
                  <Link style={{display: 'flex'}} to='/create'>
                    <IconButton>
                      <AddIcon style={{color: 'white', marginRight: '10px'}}/>
                    </IconButton>
                  </Link>
                  </Tooltip>
                  </div>
                </div>
              </Box>
              <Divider/>
              <Paper style={{overflow:"auto", maxHeight: 'calc(100vh - 61px)'}}>
              {!this.state.ready ? <LinearProgress style={{width: '100%'}} color="secondary"/> :
                <div style={{display: 'flex', flexDirection: 'column', maxWidth: '99%'}}>
                    {this.data.map((thread:any) => (
                        <div>
                        <Link style={{width: '100%', textDecoration: 'none'}} to={`/thread/${thread.id}`}>
                            <Button sx={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                            <div style={{textTransform: "none", height: "35px", width: '100%'}}>
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', height: '35px', marginLeft: '10px'}}>
                                    <p style={{color : thread.sex === "male" ? '#0277bd' : 'red', fontSize: '16px', textAlign: 'left'}}>{thread.op}</p>
                                    <p style={{marginLeft: '5px', fontSize: '12px', color: 'grey'}}>{timetoword(thread.lastModified)}</p>
                                    {thread.vote >= 0 ? <ThumbUpIcon style={{color: 'white', height: '12px'}}/> : <ThumbDownIcon style={{color: 'white', height: '12px'}}/>}
                                    <p style={{fontSize: '12px', color: 'white'}}>{thread.vote}</p>
                                    <div style={{display: 'flex', justifyContent: 'end', width: '100%', paddingRight: '10px'}}>
                                    <p style={{textAlign: 'right', color: 'white'}}>{roundup(thread.c / 10) +` page${roundup(thread.c / 10) > 1 ? "s" : ""}`}</p>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div style={{display: 'flex', textTransform: "none", height: "auto", width: '100%'}}>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'center', lineHeight: '24px', overflow: 'hidden', paddingRight: '30px'}}>
                                  <p style={{color: 'white', fontSize: '18px', marginLeft: '10px', maxWidth: '100%', wordBreak: 'break-word', textAlign: 'left', marginTop: '5px', marginBottom: '5px'}}>{thread.title}</p>
                                </div>
                            </div>
                            </Button>
                        </Link>
                        <Divider/>
                        </div>))}
                     </div>}
                </Paper>
            </Box>)}}