import React from "react";
import CommonTable from "../../components/CommonTable";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import { Box } from "@mui/material";
import { dummyTableData } from "../../utils/DummyData";

function Department() {
  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd pageTitle="Department" />
      <CommonTable mapData={dummyTableData} />
    </Box>
  );
}

export default Department;
