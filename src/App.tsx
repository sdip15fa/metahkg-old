import './App.css';
import Theme from './lib/theme';
import Conversation from './components/conversation';
import { Box } from '@mui/material'
function App() {
  return (
    <Theme>
      <Box id="App" sx={{backgroundColor: 'primary.dark', minHeight: '100vh'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Conversation id={1}/>
        </div>
      </Box>
    </Theme>
  );
}

export default App;