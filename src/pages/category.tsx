import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountCircle as AccountCircleIcon, Create as CreateIcon, Info as InfoIcon, Code as CodeIcon } from '@mui/icons-material';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { useParams } from 'react-router';
import Menu from '../components/menu';
import { Link } from 'react-router-dom';
class Category extends React.Component <any> {
    listitems = ['Sign in', 'Register', 'Create Topic', 'About', 'Source code'];
    links = ['/signin', '/register', '/create', '/about', 'https://gitlab.com/wcyat-me/metahkg'];
    icons:JSX.Element[] = [<AccountCircleIcon/>, <AccountCircleIcon/>, <CreateIcon/>, <InfoIcon/>, <CodeIcon/>]
    render() {
        return (
            <Box sx={{backgroundColor : "primary.dark", display: 'flex', flexDirection: 'row'}}>
                <div style={{width: isMobile ? '100vw' : '30vw'}}>
                    <Menu category={Number(this.props.params.category)}/>
                </div>
                {!isMobile ? <div style={{width: '70vw', justifyContent: 'center', alignItems: 'center'}}>
                                <div style={{margin: '50px'}}>
                                    <h1 style={{color: 'white'}}>Metahkg</h1>
                                    <List>
                                        {this.listitems.map((item, index) => (
                                            <Link style={{textDecoration: 'none', color: 'white'}} to={this.links[index]}>
                                            <ListItem button style={{width: '100%'}}>
                                              <ListItemIcon>
                                                  {this.icons[index]}
                                              </ListItemIcon>
                                              <ListItemText>{item}</ListItemText>
                                            </ListItem>
                                            </Link>))}
                                    </List>
                                </div>
                            </div> : <div/>}
                        </Box>)}}
export default (props:any) => (
    <Category params={useParams()}/>);