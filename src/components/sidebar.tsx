import React from 'react';
import { Box, List, ListItem, Drawer, Divider, ListItemIcon, ListItemText, Button, IconButton } from '@mui/material';
import { Menu as MenuIcon, AccountCircle as AccountCircleIcon, Create as CreateIcon, Info as InfoIcon, Code as CodeIcon, ManageAccounts as ManageAccountsIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
export default class SideBar extends React.Component<any> {
    constructor(props:any) {
        super(props);
        this.state.open = this.props.open || false;
        this.toggleDrawer = this.toggleDrawer.bind(this);}
    state = {
        open : false}
    toggleDrawer =
        (open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
          if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' ||
              (event as React.KeyboardEvent).key === 'Shift')) {return;}
          this.setState({open : open});};
    links = {
        1 : [`/signin?returnto=${window.location.pathname}`, '/register', '/create'],
        2 : ['/about', '/source']}
    render () {
        return (
            <div>
            <div>
              <IconButton sx={{height: '40px', width:'40px'}} onClick={this.toggleDrawer(true)}><MenuIcon style={{color : 'white', paddingTop: '2.5px'}}/></IconButton>
            </div>
            <Drawer anchor='left' open={this.state.open} onClose={this.toggleDrawer(false)}>
            <Box sx={{width: 250}} role="presentation" onClick={this.toggleDrawer(false)} onKeyDown={this.toggleDrawer(false)}>
               <List>
        <Link style={{textDecoration: 'none', color: 'white'}} to={localStorage.signedin ? '/logout' : '/signin'}><ListItem button>
            <ListItemIcon><AccountCircleIcon/></ListItemIcon>
            <ListItemText>{localStorage.signedin ? 'Logout' : 'Sign in / Register'}</ListItemText>
          </ListItem></Link>
        <Link style={{textDecoration: 'none', color: 'white'}} to="/create">
        <ListItem button>
          <ListItemIcon><CreateIcon/></ListItemIcon>
          <ListItemText>Create topic</ListItemText>
        </ListItem>
        </Link>
      </List>
      <Divider/>
      <List>
        {['About', 'Source code'].map((text, index) => (
          <Link style={{textDecoration: "none", color: 'white'}} to={this.links[2][index]}><ListItem button key={text}>
            <ListItemIcon>
                {index === 0 ? <InfoIcon/> : <CodeIcon/>}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem></Link>))}
      </List>
      {localStorage.signedin ?
         <div>
        <Divider/>
          <List>
            <ListItem>
              <ListItemIcon><ManageAccountsIcon/></ListItemIcon>
              <ListItemText>{localStorage.user}</ListItemText>
            </ListItem>
          </List>
          </div>
        : <div/>}
    </Box>
    </Drawer>
    </div>)}}