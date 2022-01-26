import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import MenuProvider from "./components/MenuProvider";
import HistoryProvider from "./components/HistoryProvider";
ReactDOM.render(
  <MenuProvider>
    <HistoryProvider>
      <App />
    </HistoryProvider>
  </MenuProvider>,
  document.getElementById("root")
);
