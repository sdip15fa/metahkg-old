import { Alert, Box } from "@mui/material";
import axios from "axios";
async function logout() {
    await axios.get('/api/logout');
    localStorage.clear();
    window.history.back();}
export default function Logout () {
    logout();
    return (
        <Box sx={{backgroundColor: 'primary.dark', minHeight: '100vh'}}>
            <div>
              <Alert style={{marginTop: '20px'}} severity="info">Logging you out...</Alert>
            </div>
        </Box>)}