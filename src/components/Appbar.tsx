import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Toolbar, Typography, Menu, Container, Button, MenuItem, IconButton} from '@mui/material';
import axios from 'axios';
const pages = ['Sign in', 'Register'];
const links = ["/signin", "/register"];
async function logout () {
  await axios.get('/api/logout').then(()=>{localStorage.clear();window.location.reload();})}
const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event:any) => {
    setAnchorElNav(event.currentTarget);};
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);};
  return (
    <AppBar sx={{width: '100%'}} position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        <Typography
            variant="h6" noWrap component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
        Metahkg</Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large" aria-label="account of current user"
              aria-controls="menu-appbar" aria-haspopup="true"
              onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Menu id="menu-appbar" anchorEl={anchorElNav}
              anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
              keepMounted transformOrigin={{vertical: 'top',
                horizontal: 'left'}}
              open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}
              sx={{display: { xs: 'block', md: 'none' }}}>
              {localStorage.signedin ? 
                <MenuItem onClick={logout}>
                  <Typography textAlign="center">Log out</Typography>
                </MenuItem> : pages.map((page) => 
                <MenuItem onClick={() => {window.location.href = links[pages.indexOf(page)]}}>
                    <Typography textAlign="center">{page}</Typography>
                </MenuItem>)}
            </Menu>
          </Box>
          <Typography
            variant="h6" noWrap component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              Metahkg
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {localStorage.signedin ? <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={logout}>Log out</Button> :
            pages.map((page) => (
              <Button key={page} onClick={() => {window.location.href = links[pages.indexOf(page)]}}
                sx={{ my: 2, color: 'white', display: 'block' }}>{page}
              </Button>))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>);};
export default ResponsiveAppBar;
