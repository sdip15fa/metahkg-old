import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, Divider, IconButton } from "@mui/material";
import { Link } from "react-router-dom";

export function PopUp(props: {
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  button: {text: string; link: string};
  withbutton: boolean;
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <Dialog open={props.open}
    PaperProps={{
        style: {
          backgroundImage: 'none',
        },
      }}>
        <DialogTitle sx={{alignItems: 'center', display: 'flex', justifyContent: 'flex-end', padding: '0px', marginTop: '5px', marginBottom: '5px', minWidth: '300px'}}>
            <div style={{width: '100%', justifyContent: 'flex-start', marginLeft: '20px', display: 'flex'}}>
              {props.title}
            </div>
            <IconButton onClick={() => {props.setOpen(false)}}>
                <Close sx={{color: 'white', fontSize: '18px'}}/>
            </IconButton>
        </DialogTitle>
        <Divider/>
        <DialogContent sx={{padding: '0'}}>
            <div style={{width: '100%', display: 'flex', justifyContent: 'center', fontSize: '20px', marginTop: '5px', marginBottom: '5px', textAlign: 'center'}}>
                {props.children}
            </div>
            {props.withbutton && <Divider/>}
            {props.withbutton && <Link style={{textDecoration: 'none'}} to={props.button.link}>
              <Button sx={{textTransform: 'none', fontSize: '18px'}} color="secondary" variant="text" fullWidth>
                  {props.button.text}
              </Button>
            </Link>}
        </DialogContent>
    </Dialog>
  )
}
