import React from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRef } from "react";
const Input = styled("input")({
  display: "none",
});
export default function UploadAvatar() {
  //button for uploading avatar
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Box>
      <form
        ref={formRef}
        name="avatar"
        id="avatar"
        method="post"
        action="/api/avatar"
        encType="multipart/form-data"
      >
        <label htmlFor="contained-button-file">
          <Input
            accept="image/*"
            id="contained-button-file"
            type="file"
            name="avatar"
            onChange={() => {
              formRef?.current?.submit();
            }}
          />
          <Button color="secondary" variant="contained" component="span">
            Upload
          </Button>
        </label>
      </form>
    </Box>
  );
}
