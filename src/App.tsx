import "./App.css";
import Theme from "./lib/theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { isIE, isSafari, isEdge } from "react-device-detect";
import Home from "./pages";
import Register from "./pages/signup";
import Signin from "./pages/signin";
import Thread from "./pages/thread";
import AddComment from "./pages/AddComment";
import Create from "./pages/create";
import Category from "./pages/category";
import Logout from "./components/logout";
import Source from "./pages/source";
import NotSupported from "./pages/notsupported";
export default function App() {
  if (isSafari && !localStorage.continuens) {
    return <Theme
    primary={{ main: "#2a2a2a" }}
    secondary={{ main: "#F5BD1F", dark: "#ffc100" }}
  ><NotSupported/></Theme>}
  if (isIE) {
    return <p>IE is not supported. Please use  
    <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a> or 
    <a href="https://www.google.com/chrome/">Chrome</a></p>}
  return (
    <Theme
      primary={{ main: "#2a2a2a" }}
      secondary={{ main: "#F5BD1F", dark: "#ffc100" }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/thread/:id" element={<Thread />} />
          <Route path="/comment/:id" element={<AddComment />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/create" element={<Create />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/source" element={<Source />} />
        </Routes>
      </Router>
    </Theme>);}
