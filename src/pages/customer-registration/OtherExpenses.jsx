import React, { useContext, useEffect, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box, TextField, Typography } from "@mui/material";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import CommonTable from "../../components/CommonTable";
import useDisclosure from "../../hooks/useDisclosure";
import ViewListingFeeModal from "../../components/modals/ViewListingFeeModal";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import CommonDialog from "../../components/CommonDialog";
import useSnackbar from "../../hooks/useSnackbar";
import { useSelector } from "react-redux";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import { AppContext } from "../../context/AppContext";
import OtherExpensesDrawer from "../../components/drawers/OtherExpensesDrawer";
import {
  useGetAllExpensesQuery,
  usePatchVoidExpenseRequestMutation,
} from "../../features/otherExpenses/api/otherExpensesRegApi";
import ViewExpensesModal from "../../components/modals/ViewExpensesModal";
import AddVoidSearchMixin from "../../components/mixins/AddVoidSearchMixin";
import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";

function OtherExpenses() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [expenseStatus, setExpenseStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const [voidConfirmBox, setVoidConfirmBox] = useState("");

  const { showSnackbar } = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const { notifications, setModuleName } = useContext(AppContext);

  //Disclosures
  const {
    isOpen: isListingFeeOpen,
    onOpen: onListingFeeOpen,
    onClose: onListingFeeClose,
  } = useDisclosure();

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure();

  //RTK Query

  const { data, isLoading, isFetching } = useGetAllExpensesQuery({
    Search: search,
    Status: true,
    ExpenseStatus: expenseStatus,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  const [patchVoidExpenseRequest, { isLoading: isVoidLoading }] =
    usePatchVoidExpenseRequestMutation();

  const [patchReadNotification] = usePatchReadNotificationMutation();

  //Constants
  const expenseNavigation = [
    {
      case: 1,
      name: "Pending Expenses",
      expenseStatus: "Under review",
      // badge: notifications["pendingOtherExpenses"],
    },
    {
      case: 2,
      name: "Approved Expenses",
      expenseStatus: "Approved",
      // badge: notifications["approvedOtherExpenses"],
    },
    {
      case: 3,
      name: "Rejected Expenses",
      expenseStatus: "Rejected",
      badge: notifications["rejectedExpenses"],
    },
  ];

  const selectOptions = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "prospecting",
      label: "Prospect",
    },
    {
      value: "direct",
      label: "Direct",
    },
  ];

  const excludeKeysDisplay = [
    "id",
    "status",
    "requestId",
    "registrationStatus",
    "approvalHistories",
    "updateHistories",
    "expenses",
    "clientId",
    "approvers",
  ];

  const pesoArray = ["amount"];

  //Misc Functions
  const handleOpenEdit = () => {
    setEditMode(true);
    onListingFeeOpen();
  };

  const onDeleteSubmit = async () => {
    try {
      await patchVoidExpenseRequest(selectedRowData?.requestId).unwrap();
      onDeleteClose();
      showSnackbar("Expense request cancelled successfully", "success");
    } catch (error) {
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error voiding expense request", "error");
      }
    }
  };

  //UseEffects
  useEffect(() => {
    const foundItem = expenseNavigation.find(
      (item) => item.case === tabViewing
    );

    setExpenseStatus(foundItem?.expenseStatus);
  }, [tabViewing]);

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  // useEffect(() => {
  //   setModuleName("Other Expenses");
  // }, []);

  useEffect(() => {
    if (expenseStatus === "Rejected") {
      patchReadNotification({ Tab: "Rejected Expenses" });
    }
  }, [expenseStatus]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderTabs
          wide
          pageTitle="Other Expenses"
          tabsList={expenseNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
        />

        {/* <AddVoidSearchMixin
          addTitle="Other Expenses"
          onAddOpen={onListingFeeOpen}
          setSearch={setSearch}
          status={expenseStatus}
          setStatus={setExpenseStatus}
        /> */}

        <AddSearchMixin
          addTitle="Other Expenses"
          onAddOpen={onListingFeeOpen}
          setSearch={setSearch}
        />

        {isFetching ? (
          <CommonTableSkeleton moreCompact mt={"-20px"} />
        ) : (
          <CommonTable
            mapData={data?.expenses}
            moreCompact
            excludeKeysDisplay={excludeKeysDisplay}
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            editable
            onView={onViewOpen}
            // tableHeads={tableHeads}
            pesoArray={pesoArray}
            onEdit={expenseStatus !== "Approved" && handleOpenEdit}
            onHistory={onHistoryOpen}
            onCancel={expenseStatus === "Rejected" && onDeleteOpen}
            mt={"-20px"}
          />
        )}
      </Box>

      <OtherExpensesDrawer
        isExpensesOpen={isListingFeeOpen}
        onExpensesClose={onListingFeeClose}
        editMode={editMode}
        setEditMode={setEditMode}
      />

      <ViewExpensesModal
        expenseStatus={expenseStatus}
        open={isViewOpen}
        onClose={onViewClose}
      />

      <CommonDialog
        open={isDeleteOpen}
        onClose={onDeleteClose}
        isLoading={isVoidLoading}
        onYes={onDeleteSubmit}
        // disableYes={voidConfirmBox !== selectedRowData?.businessName}
      >
        Are you sure you want to cancel expenses request for{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.businessName}
        </span>
        ?
        {/* <br />
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          (This action cannot be reversed)
        </span>
        <br />
        <Box
          sx={{ display: "flex", flexDirection: "column", marginTop: "20px" }}
        >
          <Typography sx={{ textAlign: "left", fontWeight: "bold" }}>
            To confirm, type "{selectedRowData?.businessName}" in the box below
          </Typography>
          <TextField
            size="small"
            // fullWidth
            autoComplete="off"
            onChange={(e) => {
              setVoidConfirmBox(e.target.value);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "error.main", // Set your desired border color here
                },
              },
            }}
          />
        </Box> */}
      </CommonDialog>

      <ApprovalHistoryModal
        open={isHistoryOpen}
        onClose={onHistoryClose}
        variant="otherExpenses"
      />
    </>
  );
}

export default OtherExpenses;
