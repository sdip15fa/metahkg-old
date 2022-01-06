import './App.css';
import Theme from './lib/theme';
import { Box } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages';
import Register from './pages/signup';
function App() {
  return (
    <Theme>
        <Router>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/register' element={<Register/>}/>
          </Routes> 
        </Router>
    </Theme>
  );
}

export default App;