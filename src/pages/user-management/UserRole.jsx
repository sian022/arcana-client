import { Box } from "@mui/material";
import React from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import { userAccountTableHeads } from "../../utils/TableHeads";
import { dummyTableData } from "../../utils/DummyData";

function UserRole() {
  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd pageTitle="User Role" />
      <CommonTable mapData={dummyTableData} />
    </Box>
  );
}

export default UserRole;
