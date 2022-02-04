import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";

export default function PageTop(props: {
  pages: number;
  page: number;
  onChange: (e: SelectChangeEvent<number>) => void;
}) {
  return (
    <Box
      sx={{
        height: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.page}
        label="Age"
        onChange={props.onChange}
        color="secondary"
        variant="standard"
      >
        {[...Array(props.pages)].map((p, index) => (
          <MenuItem value={index + 1}>Page {index + 1}</MenuItem>
        ))}
      </Select>
    </Box>
  );
}
