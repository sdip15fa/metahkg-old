import React from 'react';
import { isMobile } from "react-device-detect";
import { useNavigate, useParams } from "react-router";
import { useMenu, useProfile, useSearch } from "../components/MenuProvider";
import { useHistory } from "../components/HistoryProvider";
export default function History() {
  const navigate = useNavigate();
  const params = useParams();
  const [profile, setProfile] = useProfile();
  const [search, setSearch] = useSearch();
  const [menu, setMenu] = useMenu();
  const [history, setHistory] = useHistory();
  if (!isMobile) {
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
