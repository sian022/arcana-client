import { Box } from "@mui/material";
import React from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import { dummyTableData } from "../../utils/DummyData";

function UnitOfMeasurements() {
  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd pageTitle="Unit of Measurements" />
      <CommonTable mapData={dummyTableData} />
    </Box>
  );
}

export default UnitOfMeasurements;
