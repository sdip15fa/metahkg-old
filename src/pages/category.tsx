import { Box, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { AccountCircle as AccountCircleIcon, Create as CreateIcon, Info as InfoIcon, Code as CodeIcon } from '@mui/icons-material';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { useParams } from 'react-router';
import Menu from '../components/menu';
import { Link } from 'react-router-dom';
class Category extends React.Component <any> {
    listitems = ['Create Topic', 'About', 'Source code'];
    links = ['/create', '/about', '/source'];
    icons:JSX.Element[] = [<CreateIcon/>, <InfoIcon/>, <CodeIcon/>]
    render() {
        return (
            <Paper sx={{overflow: "auto", maxHeight: "100vh"}}>
            <Box sx={{backgroundColor : "primary.dark", display: 'flex', flexDirection: 'row'}}>
                <div style={{width: isMobile ? '100vw' : '30vw'}}>
                    <Menu category={Number(this.props.params.category)}/>
                </div>
                {!isMobile ? <div style={{width: '70vw', justifyContent: 'center', alignItems: 'center'}}>
                                <div style={{margin: '50px'}}>
                                    <h1 style={{color: 'white'}}>Metahkg</h1>
                                    <List>
                                        <Link style={{textDecoration: 'none', color: 'white'}} to={localStorage.signedin ? '/logout' : '/signin'}>
                                            <ListItem button style={{width: '100%'}}>
                                                <ListItemIcon><AccountCircleIcon/></ListItemIcon>
                                                <ListItemText>{localStorage.signedin ? 'Logout' : 'Sign in / Register'}</ListItemText>
                                            </ListItem>
                                        </Link>
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
                        </Box>
                        </Paper>
                        )}}
export default (props:any) => (
    <Category params={useParams()}/>);