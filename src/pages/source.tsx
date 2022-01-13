import { Box } from "@mui/material";
export default function Source() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "primary.dark",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <span style={{ color: "white" }}>
          <h1 style={{ textAlign: "center" }}>Source code</h1>
          <div style={{ textAlign: "left", fontSize: "20px" }}>
            <p>
              Metahkg is written in Typescript and Javascript.
              <br />
            </p>
            <p>
              Licensed in MIT, everyone is welcome to contribute to its
              development.
              <br />
            </p>
            <p>
              You can find the source code{" "}
              <a href="https://gitlab.com/wcyat-me/metahkg">here</a>, on gitlab
              <br />
            </p>
            <p>
              And <a href="https://gitea.wcyat.me/wcyat/metahkg">here</a>, on
              gitea.
            </p>
          </div>
        </span>
      </div>
    </Box>
  );
}
