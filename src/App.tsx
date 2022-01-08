import './App.css';
import Theme from './lib/theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages';
import Register from './pages/signup';
import Signin from './pages/signin';
function App() {
  return (
    <Theme>
        <Router>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/signin' element={<Signin/>}/>
          </Routes> 
        </Router>
    </Theme>
  );
}

export default App;