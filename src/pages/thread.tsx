import Conversation from "../components/conversation"
import { Box } from '@mui/material';
import { useParams } from "react-router";
export default function Thread () {
    const { id } = useParams();
    return (
        <Box sx={{backgroundColor: 'primary.dark', minHeight: '100vh'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Conversation id={id}/>
          </div>
        </Box>)}