import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

export default function PageTop(props: {
  pages: number;
  page: number;
  onChange: (e: SelectChangeEvent<number>) => void;
  last?: boolean;
  next?: boolean;
  onLastClicked?: React.MouseEventHandler<HTMLSpanElement>;
  onNextClicked?: React.MouseEventHandler<HTMLSpanElement>;
  ref?: string;
  id?: number | string;
}) {
  return (
    <Box
      sx={{
        height: "70px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: "20px",
        marginRight: "20px",
      }}
      id={String(props.id)}
    >
      {props.last ? (
        <Typography
          sx={{ color: "secondary.main", cursor: "pointer" }}
          onClick={props.onLastClicked}
        >
          Last Page
        </Typography>
      ) : (
        <Typography sx={{ color: "rgba(255,255,255,0)", userSelect: "none" }}>
          Last page
        </Typography>
      )}
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
      {props.next ? (
        <Typography
          sx={{ color: "secondary.main", cursor: "pointer" }}
          onClick={props.onNextClicked}
        >
          Next Page
        </Typography>
      ) : (
        <Typography sx={{ color: "rgba(255,255,255,0)", userSelect: "none" }}>
          Next page
        </Typography>
      )}
    </Box>
  );
}
