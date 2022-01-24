import "./App.css";
import Theme from "./lib/theme";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import History from "./pages/history";
export default function App() {
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
            <Route path="/history/:id" element={<History />} />
          </Routes>
        </Router>
      </Theme>
    </div>
  );
}
