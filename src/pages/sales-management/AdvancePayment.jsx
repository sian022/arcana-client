import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import CommonTable from "../../components/CommonTable";
import { dummyTableData } from "../../utils/DummyData";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import CommonDialog from "../../components/CommonDialog";
import { useSelector } from "react-redux";

function AdvancePayment() {
  const [drawerMode, setDrawerMode] = useState("add");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isArchiveOpen,
    onOpen: onArchiveOpen,
    onClose: onArchiveClose,
  } = useDisclosure();

  const isFetching = false;

  const handleAddOpen = () => {
    setDrawerMode("add");
    onDrawerOpen();
  };

  const handleDrawerClose = () => {
    // reset();
    onDrawerClose();
    setSelectedId("");
  };

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle="Advance Payment"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />
      {isFetching ? (
        <CommonTableSkeleton />
      ) : (
        <CommonTable
          mapData={dummyTableData}
          // excludeKeysDisplay={excludeKeysDisplay}
          // tableHeads={tableHeads}
          editable
          archivable
          // onEdit={handleEditOpen}
          // onArchive={handleArchiveOpen}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={count}
          status={status}
        />
      )}

      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={
          (drawerMode === "add" ? "Add" : "Edit") + " Advance Payment"
        }
        // onSubmit={handleSubmit(onDrawerSubmit)}
        // disableSubmit={!isValid}
        // isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <TextField
          label="Business Type Name"
          size="small"
          autoComplete="off"
          // {...register("storeTypeName")}
          // helperText={errors?.storeTypeName?.message}
          // error={errors?.storeTypeName}
        />
      </CommonDrawer>

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        // onYes={onArchiveSubmit}
        // isLoading={isArchiveLoading}
        noIcon={!status}
      >
        Are you sure you want to {status ? "archive" : "restore"}{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.storeTypeName}
        </span>
        ?
      </CommonDialog>
    </Box>
  );
}

export default AdvancePayment;
