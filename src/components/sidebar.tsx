import React from 'react';
import { Box, List, ListItem, Drawer, Divider, ListItemIcon, ListItemText, Button } from '@mui/material';
import { Menu as MenuIcon, AccountCircle as AccountCircleIcon, Create as CreateIcon, Info as InfoIcon, Code as CodeIcon } from '@mui/icons-material';
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
        1 : ['/signin', '/register', '/create'],
        2 : ['/about', 'https://gitlab.com/wcyat-me/metahkg']}
    render () {
        return (
            <div>
            <div>
              <Button sx={{height: '40px', width:'40px'}} variant="text" onClick={this.toggleDrawer(true)}><MenuIcon style={{color : 'white'}}/></Button>
            </div>
            <Drawer anchor='left' open={this.state.open} onClose={this.toggleDrawer(false)}>
            <Box sx={{width: 250}} role="presentation" onClick={this.toggleDrawer(false)} onKeyDown={this.toggleDrawer(false)}>
               <List>
        {['Sign in', 'Register', 'Create Topic'].map((text, index) => (
          <a style={{textDecoration: "none", color: 'white'}} href={this.links[1][index]}><ListItem button key={text}>
            <ListItemIcon>
                {index === 2 ? <CreateIcon/> : <AccountCircleIcon/>}
            </ListItemIcon>
            <ListItemText primary={text}/>
          </ListItem></a>))}
      </List>
      <Divider/>
      <List>
        {['About', 'Source code'].map((text, index) => (
          <a style={{textDecoration: "none", color: 'white'}} href={this.links[2][index]}><ListItem button key={text}>
            <ListItemIcon>
                {index === 0 ? <InfoIcon/> : <CodeIcon/>}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem></a>))}
      </List>
    </Box>
    </Drawer>
    </div>)}}