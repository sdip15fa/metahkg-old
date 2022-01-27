import React from "react";
import { createContext, useContext, useState } from "react";
const Context = createContext<any>({});
export default function ContextProvider(props: { children: JSX.Element }) {
  const [history, setHistory] = useState("");
  const [width, setWidth] = useState(window.innerWidth);
  function updateSize() {
    setWidth(window.innerWidth);
  }
  window.addEventListener("resize", updateSize);
  return (
    <Context.Provider
      value={{
        history: [history, setHistory],
        width: [width, setWidth],
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
export function useHistory() {
  const { history } = useContext(Context);
  return history;
}
export function useWidth() {
  const { width } = useContext(Context);
  return width;
}
