import { Box, IconButton, Tooltip } from "@mui/material";
import { Reply as ReplyIcon } from "@mui/icons-material";
import { useNavigate } from "react-router";
import reactElementToJSXString from 'react-element-to-jsx-string';
export default function Comment(props: {
  op: boolean;
  sex: boolean;
  id: number;
  name: string;
  children: string | JSX.Element | JSX.Element[];
  time: string;
}) {
  function Tag(tprops: {
    children: string | JSX.Element | JSX.Element[];
    }) {
    const navigate = useNavigate();
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
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            overflow: 'hidden',
            lineHeight: '22px',
            maxHeight: '22px',
            wordBreak: 'keep-all'
          }}
        >
          {tprops.children}
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
        <Tooltip title="Quote">
          <IconButton onClick={() => {localStorage.reply = reactElementToJSXString(props.children); console.log(localStorage.reply); navigate(`/comment/${props.id}`);}}>
            <ReplyIcon/>
          </IconButton>
        </Tooltip>
      </div>
    );
  }
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        textAlign: "left",
        marginTop: "5px",
      }}
    >
      <div style={{ marginLeft: "20px", marginRight: '20px' }}>
        <Tag>
          {props.name}
        </Tag>
        <p style={{ color: "white", wordBreak: 'break-word' }}>{props.children}</p>
        <div style={{ height: "5px" }} />
      </div>
    </Box>
  );
}
