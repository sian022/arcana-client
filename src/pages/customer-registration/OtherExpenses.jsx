import React, { useContext, useEffect, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box } from "@mui/material";
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
import { useGetAllExpensesQuery } from "../../features/otherExpenses/api/otherExpensesRegApi";
import ViewExpensesModal from "../../components/modals/ViewExpensesModal";

function OtherExpenses() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [expenseStatus, setExpenseStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const { showSnackbar } = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const { notifications } = useContext(AppContext);

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
    isOpen: isArchiveOpen,
    onOpen: onArchiveOpen,
    onClose: onArchiveClose,
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

  //Constants
  const expenseNavigation = [
    {
      case: 1,
      name: "Pending Expenses",
      expenseStatus: "Under review",
      badge: notifications["pendingOtherExpenses"],
    },
    {
      case: 2,
      name: "Approved Expenses",
      expenseStatus: "Approved",
      badge: notifications["approvedOtherExpenses"],
    },
    {
      case: 3,
      name: "Rejected Expenses",
      expenseStatus: "Rejected",
      badge: notifications["rejectedOtherExpenses"],
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
  ];

  const pesoArray = ["amount"];

  //Misc Functions
  const handleOpenEdit = () => {
    setEditMode(true);
    onListingFeeOpen();
  };

  useEffect(() => {
    const foundItem = expenseNavigation.find(
      (item) => item.case === tabViewing
    );

    setExpenseStatus(foundItem?.expenseStatus);
  }, [tabViewing]);

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

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

        <AddSearchMixin
          addTitle="Other Expenses"
          onAddOpen={onListingFeeOpen}
          setSearch={setSearch}
        />

        {isFetching ? (
          <CommonTableSkeleton moreCompact />
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
            onEdit={handleOpenEdit}
            onHistory={onHistoryOpen}
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
        open={isArchiveOpen}
        onClose={onArchiveClose}
        // isLoading={isUpdateStatusLoading}
        // onYes={onArchiveSubmit}
      >
        Are you sure you want to {status ? "archive" : "restore"} client{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.businessName}
        </span>
        ?
      </CommonDialog>

      <ApprovalHistoryModal
        open={isHistoryOpen}
        onClose={onHistoryClose}
        // variant="listingFee"
      />
    </>
  );
}

export default OtherExpenses;
