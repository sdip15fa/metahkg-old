import Conversation from "../components/conversation";
import { Box } from "@mui/material";
import { useParams } from "react-router";
import Menu from "../components/menu";
import { isMobile } from "react-device-detect";
import { useCat, useId, useSearch } from "../components/MenuProvider";
export default function Thread() {
  const params: any = useParams();
  const [category, setCategory] = useCat();
  const [search, setSearch] = useSearch();
  const [id, setId] = useId();
  if (!category && !id) {
    const i = window.location.pathname.split("/");
    setId(i.pop() || i.pop());
  }
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {!isMobile && (
        <div style={{ width: "30vw" }}>
          <Menu
            key={category && search}
          />
        </div>
      )}
      <div key={params.id} style={{ width: isMobile ? "100vw" : "70vw" }}>
        <Conversation id={params.id} />
      </div>
    </Box>
  );
}
