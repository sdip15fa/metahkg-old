import { Box, IconButton, Tooltip } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import ReplyIcon from '@mui/icons-material/Reply';
import { Link } from "react-router-dom";
export default function Title(props:{category: number | string, title: string}) {
    return (
        <Box sx={{backgroundColor: 'primary.main', height: '50px'}}>
          <div style={{display: 'flex', flexDirection: 'row', marginLeft: '10px', marginRight: '20px', justifyContent: 'end', alignItems: 'center'}}>
          <div style={{width: '100%', maxWidth: '100%', display: 'flex', justifyContent: 'left', textOverflow: 'ellipsis', alignItems: 'center', overflow: 'hidden'}}>
            <Link to={`/category/${props.category}`}>
            <IconButton>
              <ArrowBackIcon color="secondary" sx={{paddingTop: '2.5px'}}/>
            </IconButton>
            </Link>
            <p style={{color:'#F5BD1F', fontSize: '18px', marginTop: '0px', marginBottom: '0px', paddingLeft: '10px'}}>{props.title}</p>
          </div>
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <Tooltip title="Comment" arrow>
            <Link to={`/comment/${window.location.href.split('/').pop()}`}>
            <IconButton>
              <ReplyIcon color="secondary" sx={{paddingTop: '2.5px'}}/>
            </IconButton>
            </Link>
          </Tooltip>
          </Box>
          </div>
        </Box>)}