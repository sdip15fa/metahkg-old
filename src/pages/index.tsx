import Conversation from "../components/conversation"
import { Box } from '@mui/material';
export default function Home () {
    return (
        <Box sx={{backgroundColor: 'primary.dark', minHeight: '100vh'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Conversation id={1}/>
          </div>
        </Box>)}