import { Box } from "@mui/material";
import { isMobile } from "react-device-detect";
import { useParams } from "react-router";
import Empty from "../components/empty";
import Menu from "../components/menu";
import {
  useCat,
  useId,
  useProfile,
  useSearch,
} from "../components/MenuProvider";
export default function Category() {
  const params = useParams();
  const [id, setId] = useId();
  const [category, setCategory] = useCat();
  const [search, setSearch] = useSearch();
  const [profile, setProfile] = useProfile();
  if (category !== Number(params.category)) {
    setCategory(Number(params.category));
    setId(0);
  }
  if (search) {
    setSearch(false);
  }
  if (profile) {
    setProfile(0);
  }
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        display: "flex",
        flexDirection: "row",
        maxHeight: "100vh",
      }}
    >
      <div style={{ width: isMobile ? "100vw" : "30vw" }}>
        <Menu key={category} />
      </div>
      {!isMobile && <Empty />}
    </Box>
  );
}
