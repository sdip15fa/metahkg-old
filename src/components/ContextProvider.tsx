import React from "react";
import { createContext, useContext, useState } from "react";
const Context = createContext<any>({});
/*
 * allows components to access and change variables "history" and "width"
 * width is used to rerender the app to fit device size
 * history is used for the thread arrow
 */
export default function ContextProvider(props: { children: JSX.Element }) {
  const [history, setHistory] = useState("");
  const [query, setQuery] = useState("");
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  function updateSize() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }
  window.addEventListener("resize", updateSize);
  return (
    <Context.Provider
      value={{
        history: [history, setHistory],
        width: [width, setWidth],
        query: [query, setQuery],
        height: [height, setHeight],
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
export function useQuery() {
  const { query } = useContext(Context);
  return query;
}
export function useHeight() {
  const { height } = useContext(Context);
  return height;
}
