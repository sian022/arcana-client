import { Box } from "@mui/material";
import PageNotFoundImage from "../assets/images/PageNotFound.svg";

function PageNotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <img
        src={PageNotFoundImage}
        alt="404-not-found"
        width="80%"
        height="80%"
      />
    </Box>
  );
}

export default PageNotFound;
