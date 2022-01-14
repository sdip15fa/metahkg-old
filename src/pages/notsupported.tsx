import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
export default function NotSupported () {
    return (
        <Box sx={{backgroundColor: 'primary.dark', minHeight: '100vh'}}>
        <Dialog open={true}>
        <DialogTitle>
          {"Browser not supported."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your browser does not have a proper support for Metahkg and might render some content incorrectly.
            Please consider using&nbsp;
            <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a> or&nbsp;
            <a href="https://www.google.com/chrome/">Chrome</a>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <a href="https://www.mozilla.org/en-US/firefox/new/" style={{textDecoration: 'none'}}>
            <Button color="secondary" variant="text">Download Firefox</Button>
          </a>
            <Button color="secondary" variant="text" onClick={() => {localStorage.continuens = true; window.location.reload();}}>Continue</Button>
        </DialogActions>
      </Dialog>
      </Box>)}