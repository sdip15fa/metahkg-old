import Conversation from "../components/conversation"
import { Box } from '@mui/material';
import { useParams } from "react-router";
import Menu from '../components/menu';
import { isMobile } from "react-device-detect";
export default function Thread () {
    const { id } = useParams();
    return (
        <Box sx={{backgroundColor: 'primary.dark', minHeight: '100vh', display: 'flex', flexDirection: 'row'}}>
          {!isMobile ? <div style={{width: '30vw'}}>
            <Menu id={id}/>
          </div> : <div/>}
          <div style={{width: isMobile ? '100vw' : '70vw'}}>
            <Conversation id={id}/>
          </div>
        </Box>)}