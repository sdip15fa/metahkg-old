import {
  Box,
  Paper,
} from "@mui/material";
import { isMobile } from "react-device-detect";
import { useParams } from "react-router";
import Empty from "../components/empty";
import Menu from "../components/menu";
export default function Category() {
  const params = useParams();
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
        <Menu key={params.category} id={0} category={Number(params.category)} />
      </div>
      {!isMobile ? (
            <Empty/>
      ) : (
        <div />
      )}
    </Box>
  );
}
