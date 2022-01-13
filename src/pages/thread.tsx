import Conversation from "../components/conversation"
import { Box } from '@mui/material';
import { useParams } from "react-router";
import Menu from '../components/menu';
import { isMobile } from "react-device-detect";
import React from "react";
class Thread extends React.Component<any> {
  render() {
    return (
        <Box sx={{backgroundColor: 'primary.dark', minHeight: '100vh', display: 'flex', flexDirection: 'row'}}>
          {!isMobile ? <div style={{width: '30vw'}}>
            <Menu id={this.props.params.id}/>
          </div> : <div/>}
          <div key={this.props.params.id} style={{width: isMobile ? '100vw' : '70vw'}}>
            <Conversation id={this.props.params.id}/>
          </div>
        </Box>)}}
export default (props:any) => (
  <Thread params={useParams()}/>);