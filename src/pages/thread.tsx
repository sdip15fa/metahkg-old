import Conversation from "../components/conversation"
import { Box } from '@mui/material';
import { useParams } from "react-router";
import Menu from '../components/menu';
import { isMobile } from "react-device-detect";
export default function Thread() {
    const params:any = useParams();
    return (
        <Box sx={{backgroundColor: 'primary.dark', minHeight: '100vh', 
        display: 'flex', flexDirection: 'row'}}>
          {!isMobile ? <div style={{width: '30vw'}}>
            <Menu category={1} id={params.id}/>
          </div> : <div/>}
          <div key={params.id} style={{width: isMobile ? '100vw' : '70vw'}}>
            <Conversation id={params.id}/>
          </div>
        </Box>)}