import React from "react";
import { useNavigate, useParams } from "react-router";
import {
  useMenu,
  useProfile,
  useSearch,
  useSelected,
} from "../components/MenuProvider";
import { useHistory, useWidth } from "../components/ContextProvider";
/*
 * History component for /history/:id
 * Controls the menu to show ProfileMenu, retrns nothing
 * Does its work only if width < 760
 */
export default function History() {
  const navigate = useNavigate();
  const params = useParams();
  const [profile, setProfile] = useProfile();
  const [search, setSearch] = useSearch();
  const [menu, setMenu] = useMenu();
  const [history, setHistory] = useHistory();
  const [width] = useWidth();
  const [selected, setSelected] = useSelected();
  if (![0, 1].includes(selected)) {
    setSelected(0);
  }
  if (!(width < 760)) {
    navigate(`/profile/${params.id}`);
  } else {
    if (!menu) {
      setMenu(true);
    }
    if (history !== window.location.pathname) {
      setHistory(window.location.pathname);
    }
    if (profile !== Number(params.id) || "self") {
      setProfile(Number(params.id) || "self");
    }
    if (search) {
      setSearch(false);
    }
  }
  return <div />;
}
