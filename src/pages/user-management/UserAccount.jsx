import React from "react";
import CommonTable from "../../components/CommonTable";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import { Box, TextField } from "@mui/material";
import { dummyTableData } from "../../utils/DummyData";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";

function UserAccount() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd pageTitle="User Account" onOpen={onOpen} />
      <CommonTable mapData={dummyTableData} />

      <CommonDrawer
        modalHeader={`Add User Account`}
        open={isOpen}
        onClose={onClose}
      >
        <TextField label="Hey" size="small" />
        <TextField label="Hey" size="small" />
        <TextField label="Hey" size="small" />
        <TextField label="Hey" size="small" />
      </CommonDrawer>
    </Box>
  );
}

export default UserAccount;
