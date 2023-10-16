import React from "react";
import CommonTable from "../../components/CommonTable";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import { Box } from "@mui/material";

function Prospect() {
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <PageHeaderAdd />
      <CommonTable />
    </Box>
  );
}

export default Prospect;
