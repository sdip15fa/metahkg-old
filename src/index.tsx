import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import MenuProvider from "./components/MenuProvider";
ReactDOM.render(
    <MenuProvider><App/></MenuProvider>,
 document.getElementById("root"));
