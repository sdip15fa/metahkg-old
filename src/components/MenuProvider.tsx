import { createContext, useContext, useState } from "react";
const MenuContext = createContext<any>({});
export default function MenuProvider(props: { children: JSX.Element }) {
  const [category, setCategory] = useState(0);
  const [id, setId] = useState(0);
  const [search, useSearch] = useState(false);
  console.log("rerender menuprovider");
  return (
    <MenuContext.Provider
      key={category && id}
      value={{
        category: [category, setCategory],
        id: [id, setId],
        search: [search, useSearch],
      }}
    >
      {props.children}
    </MenuContext.Provider>
  );
}
export function useCat() {
  const { category } = useContext(MenuContext);
  return category;
}
export function useId() {
  const { id } = useContext(MenuContext);
  return id;
}
export function useSearch() {
  const { search } = useContext(MenuContext);
  return search;
}
