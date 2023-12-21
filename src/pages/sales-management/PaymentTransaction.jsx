import { Box, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import { dummyTableData } from "../../utils/DummyData";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import TabsMixin from "../../components/mixins/TabsMixin";
import { AppContext } from "../../context/AppContext";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";

function PaymentTransaction() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  // const [listingFeeStatus, setListingFeeStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const { notifications } = useContext(AppContext);

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  //Constants
  const paymentNavigation = [
    {
      case: 1,
      name: "Receivable",
      listingFeeStatus: "Under review",
      badge: notifications["pendingListingFee"],
    },
    {
      case: 2,
      name: "Paid",
      listingFeeStatus: "Approved",
      badge: notifications["approvedListingFee"],
    },
    {
      case: 3,
      name: "Voided",
      listingFeeStatus: "Rejected",
      badge: notifications["rejectedListingFee"],
    },
    {
      case: 4,
      name: "Cleared",
      listingFeeStatus: "All",
      badge: notifications["allListingFee"],
    },
  ];

  const isFetching = false;

  //Functions
  // const handleAddOpen = () => {
  //   setDrawerMode("add");
  //   onDrawerOpen();
  // };

  // const handleDrawerClose = () => {
  //   // reset();
  //   onDrawerClose();
  //   setSelectedId("");
  // };

  return (
    <Box className="commonPageLayout">
      <PageHeaderTabs
        pageTitle="Payment Transaction"
        // onOpen={handleAddOpen}
        setSearch={setSearch}
        tabsList={paymentNavigation}
        setTabViewing={setTabViewing}
        tabViewing={tabViewing}
        small
        // setStatus={setStatus}
      />

      <AddSearchMixin
        addTitle="Payment"
        // onAddOpen={onSpDiscountOpen}
        setSearch={setSearch}
      />
      {/* <PageHeaderAdd
        pageTitle="Payment Transaction"
        // onOpen={handleAddOpen}
        setSearch={setSearch}
        // setStatus={setStatus}
      /> */}

      {/* <TabsMixin
        tabViewing={tabViewing}
        setTabViewing={setTabViewing}
        tabsList={paymentNavigation}
      /> */}

      {isFetching ? (
        <CommonTableSkeleton />
      ) : (
        <CommonTable
          mapData={dummyTableData}
          moreCompact
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
        // onClose={handleDrawerClose}
        // drawerHeader={
        //   (drawerMode === "add" ? "Add" : "Edit") + " Business Type"
        // }
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
      {/* <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
        isLoading={isArchiveLoading}
        noIcon={!status}
      >
        Are you sure you want to {status ? "archive" : "restore"}{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.storeTypeName}
        </span>
        ?
      </CommonDialog> */}
    </Box>
  );
}

export default PaymentTransaction;
