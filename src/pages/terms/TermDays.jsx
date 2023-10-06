import React from "react";
import { dummyTableData } from "../../utils/DummyData";
import CommonTable from "../../components/CommonTable";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import { Box } from "@mui/material";

function TermDays() {
  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd pageTitle="Products" />
      <CommonTable mapData={dummyTableData} />
    </Box>
  );
}

export default TermDays;
