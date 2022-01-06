import React from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Box, TextField, Button } from '@mui/material';
class Register extends React.Component {
    email = '';
    user = '';
    pwd = '';
    render () {
        return (
            <Box sx={{backgroundColor: 'secondary.main', display : 'flex', alignItems: 'center', justifyContent: 'center', height : '100vh'}}>
                <div style={{margin : '50px'}}>
                  <p style={{textAlign : 'center', fontSize: '20px'}}>Register a Metahkg account</p>
                  <TextField variant="standard" type="text" onChange={(e) => {this.user = e.target.value}} label="Username" required fullWidth /> 
                  <TextField variant="standard" type="email" onChange={(e) => {this.email = e.target.value}} label="Email" required fullWidth/>
                  <TextField variant="standard" type="password" onChange={(e) => {this.pwd = e.target.value}} label="Password" required fullWidth/>
                  <Button variant="outlined" onClick={() => {}}>Register</Button>
                </div>
            </Box>
        )
    }
}
export default Register;