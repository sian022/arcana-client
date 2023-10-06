import { Box } from "@mui/material";
import React from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import { dummyTableData } from "../../utils/DummyData";

function ProductSubCategory() {
  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd pageTitle="Product Sub Category" />
      <CommonTable mapData={dummyTableData} />
    </Box>
  );
}

export default ProductSubCategory;
