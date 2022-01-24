import { isMobile } from "react-device-detect";
import { useNavigate, useParams } from "react-router";
import { useProfile, useSearch } from "../components/MenuProvider";
import Menu from "../components/menu";
export default function History() {
  const navigate = useNavigate();
  const params = useParams();
  const [profile, setProfile] = useProfile();
  const [search, setSearch] = useSearch();
  if (!isMobile) {
    navigate(`/profile/${params.id}`);
  }
  if (profile !== Number(params.id) || "self") {
    setProfile(Number(params.id) || "self");
  }
  if (search) {
    setSearch(false);
  }
  return <Menu key={profile && search} />;
}
