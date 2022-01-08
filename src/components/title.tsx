import { Box } from "@mui/material";
export default function Title(props:any) {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column' ,backgroundColor: 'primary.main', height:'auto'}}>
          <p style={{color:'#F5BD1F', fontSize: '22px', margin: '20px'}}>{props.title}</p>
        </Box>)}