import { createTheme, ThemeProvider } from '@mui/material/styles'; 
declare module '@mui/material/styles' {
    interface Theme {
      status: {
        danger: string;
      };}
    interface ThemeOptions {
      status?: {
        danger?: string;
      };}}
  const theme = createTheme({
    palette: {
      primary: {
        main: '#2a2a2a'},
      secondary: {
        main: '#F5BD1F',
        dark: '#ffc100'}}})
export default function Theme(props:any) {
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>)}