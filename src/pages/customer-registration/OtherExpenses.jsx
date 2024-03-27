import { useContext, useEffect, useMemo, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box } from "@mui/material";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import CommonTable from "../../components/CommonTable";
import useDisclosure from "../../hooks/useDisclosure";
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
import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";

function OtherExpenses() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [expenseStatus, setExpenseStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const { notifications, isNotificationFetching } = useContext(AppContext);

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

  const { data, isFetching } = useGetAllExpensesQuery({
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
  const expenseNavigation = useMemo(
    () => [
      {
        case: 1,
        name: "Pending Expenses",
        expenseStatus: "Under review",
        // badge: notifications["pendingExpenses"],
      },
      {
        case: 2,
        name: "Approved Expenses",
        expenseStatus: "Approved",
        badge: notifications["approvedExpenses"],
      },
      {
        case: 3,
        name: "Rejected Expenses",
        expenseStatus: "Rejected",
        badge: notifications["rejectedExpenses"],
      },
    ],
    [notifications]
  );

  const tableHeads = [
    "Business Name",
    "Owner's Name",
    "Transaction Number",
    "Total Amount",
    // "Requested By",
  ];

  const customOrderKeys = [
    "businessName",
    "ownersName",
    "id",
    "totalAmount",
    // "requestedBy",
  ];

  const pesoArray = ["totalAmount"];

  //Misc Functions
  const handleOpenEdit = () => {
    setEditMode(true);
    onListingFeeOpen();
  };

  const onDeleteSubmit = async () => {
    try {
      await patchVoidExpenseRequest(selectedRowData?.requestId).unwrap();
      onDeleteClose();
      snackbar({
        message: "Expense request cancelled successfully",
        variant: "success",
      });
    } catch (error) {
      if (error?.data?.error?.message) {
        snackbar({ message: error?.data?.error?.message, variant: "error" });
      } else {
        snackbar({
          message: "Error voiding expense request",
          variant: "error",
        });
      }
    }
  };

  //UseEffects
  useEffect(() => {
    const foundItem = expenseNavigation.find(
      (item) => item.case === tabViewing
    );

    setExpenseStatus(foundItem?.expenseStatus);
  }, [tabViewing, expenseNavigation]);

  useEffect(() => {
    if (notifications["rejectedExpenses"] > 0 && expenseStatus === "Rejected") {
      patchReadNotification({ Tab: "Rejected Expenses" });
    }

    if (notifications["approvedExpenses"] > 0 && expenseStatus === "Approved") {
      patchReadNotification({ Tab: "Approved Expenses" });
    }
  }, [expenseStatus, patchReadNotification, notifications]);

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [tabViewing, search, rowsPerPage, expenseStatus]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderTabs
          wide
          pageTitle="Other Expenses"
          tabsList={expenseNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
          isNotificationFetching={isNotificationFetching}
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
          <CommonTableSkeleton lowerCompact mt={"-20px"} />
        ) : (
          <CommonTable
            mapData={data?.expenses}
            lowerCompact
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            onView={onViewOpen}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            pesoArray={pesoArray}
            onEdit={expenseStatus !== "Approved" && handleOpenEdit}
            onHistory={onHistoryOpen}
            onCancel={expenseStatus === "Rejected" && onDeleteOpen}
            mt={"-20px"}
            moveNoDataUp
          />
        )}
      </Box>

      <OtherExpensesDrawer
        isExpensesOpen={isListingFeeOpen}
        onExpensesClose={onListingFeeClose}
        editMode={editMode}
        setEditMode={setEditMode}
        expenseStatus={expenseStatus}
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
