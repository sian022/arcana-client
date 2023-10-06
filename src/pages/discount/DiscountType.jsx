import { Box } from "@mui/material";
import React from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import { dummyTableData } from "../../utils/DummyData";

function DiscountType() {
  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd pageTitle="Discount Type" />
      <CommonTable mapData={dummyTableData} />
    </Box>
  );
}

export default DiscountType;
