import { createContext, useContext, useState } from "react";
const HistoryContext = createContext<any>({});
export default function HistoryProvider(props: { children: JSX.Element }) {
  const [history, setHistory] = useState("");
  return (
    <HistoryContext.Provider
      value={{
        history: [history, setHistory],
      }}
    >
      {props.children}
    </HistoryContext.Provider>
  );
}
export function useHistory() {
  const { history } = useContext(HistoryContext);
  return history;
}
