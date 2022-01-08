import './App.css';
import Theme from './lib/theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages';
import Register from './pages/signup';
import Signin from './pages/signin';
import Thread from './pages/thread';
import AddComment from './pages/AddComment';
export default function App() {
  return (
    <Theme>
        <Router>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/thread/:id' element={<Thread/>}/>
            <Route path='/comment/:id' element={<AddComment/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/signin' element={<Signin/>}/>
          </Routes> 
        </Router>
    </Theme>);}