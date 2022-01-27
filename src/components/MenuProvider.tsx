import React, { createContext, useContext, useState } from "react";
const MenuContext = createContext<any>({});
/*
* PRovide global values for controlling the menu
*/
export default function MenuProvider(props: { children: JSX.Element }) {
  const [category, setCategory] = useState(0);
  const [id, setId] = useState(0);
  const [profile, setProfile] = useState<number | "self">(0);
  const [search, useSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  return (
    <MenuContext.Provider
      value={{
        category: [category, setCategory],
        id: [id, setId],
        search: [search, useSearch],
        profile: [profile, setProfile],
        menu: [menu, setMenu],
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
export function useProfile() {
  const { profile } = useContext(MenuContext);
  return profile;
}
export function useMenu() {
  const { menu } = useContext(MenuContext);
  return menu;
}
