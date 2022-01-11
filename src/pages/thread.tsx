import Conversation from "../components/conversation"
import { Box } from '@mui/material';
import { useParams } from "react-router";
import Menu from '../components/menu';
export default function Thread () {
    const { id } = useParams();
    return (
        <Box sx={{backgroundColor: 'primary.dark', minHeight: '100vh', display: 'flex', flexDirection: 'row'}}>
          <div style={{width: '30vw'}}>
            <Menu/>
          </div>
          <div style={{width: '70vw'}}>
            <Conversation id={id}/>
          </div>
        </Box>)}