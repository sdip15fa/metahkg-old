import "./App.css";
import Theme from "./lib/theme";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { isIE } from "react-device-detect";
import Register from "./pages/signup";
import Signin from "./pages/signin";
import Thread from "./pages/thread";
import AddComment from "./pages/AddComment";
import Create from "./pages/create";
import Category from "./pages/category";
import Logout from "./components/logout";
import Source from "./pages/source";
import Search from "./pages/search";
import Profile from "./pages/profile";
export default function App() {
  if (isIE) {
    return (
      <p>
        IE is not supported. Please use
        <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a> or
        <a href="https://www.google.com/chrome/">Chrome</a>
      </p>
    );
  }
  return (
    <div style={{ maxHeight: "100vh" }}>
      <Theme
        primary={{ main: "#222222" }}
        secondary={{ main: "#F5BD1F", dark: "#ffc100" }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/category/1" />} />
            <Route path="/thread/:id" element={<Thread />} />
            <Route path="/comment/:id" element={<AddComment />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/create" element={<Create />} />
            <Route path="/search" element={<Search />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/source" element={<Source />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </Router>
      </Theme>
    </div>
  );
}
