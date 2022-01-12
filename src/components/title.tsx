import { Box, IconButton } from "@mui/material";
import ReplyIcon from '@mui/icons-material/Reply';
import { Link } from "react-router-dom";
export default function Title(props:any) {
    return (
        <Box sx={{backgroundColor: 'primary.main', height: '60px'}}>
          <div style={{display: 'flex', flexDirection: 'row', marginLeft: '20px', marginRight: '20px', justifyContent: 'end', alignItems: 'center'}}>
          <div style={{width: '100%', display: 'flex', justifyContent: 'left', textOverflow: 'ellipsis', paddingLeft: '20px'}}>
            <p style={{color:'#F5BD1F', fontSize: '18px'}}>{props.title}</p>
          </div>
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
            <Link to={`/comment/${window.location.href.split('/').pop()}`}>
            <IconButton>
              <ReplyIcon color="secondary"/>
            </IconButton>
            </Link>
          </Box>
          </div>
        </Box>)}