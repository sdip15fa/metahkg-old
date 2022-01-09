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
export default function Theme(props:any) {
  const theme = createTheme({
    palette: {
      primary: props.primary,
      secondary: props.secondary
    }})
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>)}