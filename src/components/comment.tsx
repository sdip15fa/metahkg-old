import { Box } from "@mui/material";
function Tag(props: {
  op: boolean;
  sex: boolean;
  id: number;
  children: string | JSX.Element | JSX.Element[];
  time: string;
}) {
  return (
    <div style={{ display: "flex", fontSize: "17px" }}>
      <p
        style={{
          color: props.op ? "#F5BD1F" : "grey",
          marginTop: "15px",
          marginBottom: "0px",
        }}
      >
        #{props.id}
      </p>
      <p
        style={{
          color: props.sex ? "#0277bd" : "red",
          marginLeft: "10px",
          marginTop: "15px",
          marginBottom: "0px",
        }}
      >
        {props.children}
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "gray",
          marginLeft: "10px",
          marginTop: "15px",
          marginBottom: "0px",
        }}
      >
        {props.time}
      </p>
    </div>
  );
}
export default function Comment(props: {
  op: boolean;
  sex: boolean;
  id: number;
  name: string;
  children: string | JSX.Element | JSX.Element[];
  time: string;
}) {
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        textAlign: "left",
        marginTop: "5px",
      }}
    >
      <div style={{ marginLeft: "20px" }}>
        <Tag op={props.op} sex={props.sex} id={props.id} time={props.time}>
          {props.name}
        </Tag>
        <p style={{ color: "white" }}>{props.children}</p>
        <div style={{ height: "5px" }} />
      </div>
    </Box>
  );
}
