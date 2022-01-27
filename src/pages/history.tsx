import React from "react";

import { useNavigate, useParams } from "react-router";
import { useMenu, useProfile, useSearch } from "../components/MenuProvider";
import { useHistory, useWidth } from "../components/ContextProvider";
export default function History() {
  const navigate = useNavigate();
  const params = useParams();
  const [profile, setProfile] = useProfile();
  const [search, setSearch] = useSearch();
  const [menu, setMenu] = useMenu();
  const [history, setHistory] = useHistory();
  const [width, setWidth] = useWidth();
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
