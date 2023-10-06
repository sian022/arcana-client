import { Box } from "@mui/material";
import React from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import { dummyTableData } from "../../utils/DummyData";

function StoreType() {
  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd pageTitle="Store Type" />
      <CommonTable mapData={dummyTableData} />
    </Box>
  );
}

export default StoreType;
