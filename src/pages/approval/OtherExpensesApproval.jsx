import React, { useContext, useEffect, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box, Button, TextField, debounce } from "@mui/material";
import CommonTable from "../../components/CommonTable";
import useDisclosure from "../../hooks/useDisclosure";
import ViewListingFeeModal from "../../components/modals/ViewListingFeeModal";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import { AppContext } from "../../context/AppContext";
import { useGetAllExpensesQuery } from "../../features/otherExpenses/api/otherExpensesRegApi";
import ViewExpensesModal from "../../components/modals/ViewExpensesModal";
import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";

function OtherExpensesApproval() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("");
  const [expenseStatus, setExpenseStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const { notifications, setModuleName } = useContext(AppContext);

  //Disclosures
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
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

  const [patchReadNotification] = usePatchReadNotificationMutation();

  //Constants
  const otherExpensesNavigation = [
    {
      case: 1,
      name: "Pending Expenses",
      expenseStatus: "Under review",
      badge: notifications["pendingExpenses"],
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
      // badge: notifications["rejectedOtherExpenses"],
    },
  ];

  const tableHeads = [
    "Business Name",
    "Owner's Name",
    "Transaction Number",
    "Total Amount",
    "Requested By",
  ];

  const customOrderKeys = [
    "businessName",
    "ownersName",
    "id",
    "totalAmount",
    "requestedBy",
  ];

  const pesoArray = ["total"];

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  useEffect(() => {
    const foundItem = otherExpensesNavigation.find(
      (item) => item.case === tabViewing
    );

    setExpenseStatus(foundItem?.expenseStatus);
  }, [tabViewing]);

  useEffect(() => {
    if (expenseStatus === "Under review") {
      patchReadNotification({ Tab: "Pending Expenses" });
    }
  }, [expenseStatus]);

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [tabViewing, search, status, rowsPerPage]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderTabs
          wide
          pageTitle="Other Expenses Approval"
          tabsList={otherExpensesNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
        />

        <Box sx={{ padding: "15px", my: "-20px" }}>
          <TextField
            type="search"
            size="small"
            label="Search"
            onChange={(e) => {
              debouncedSetSearch(e.target.value);
            }}
            autoComplete="off"
          />
        </Box>

        {isFetching ? (
          <CommonTableSkeleton moreCompact />
        ) : (
          <CommonTable
            mapData={data?.expenses}
            moreCompact
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            editable
            onView={onViewOpen}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            pesoArray={pesoArray}
            onHistory={onHistoryOpen}
          />
        )}
      </Box>

      <ViewExpensesModal
        open={isViewOpen}
        // open={true}
        onClose={onViewClose}
        underReview={expenseStatus === "Under review"}
        approval
        expenseStatus={expenseStatus}
      />

      <ApprovalHistoryModal
        open={isHistoryOpen}
        onClose={onHistoryClose}
        variant="otherExpenses"
      />
    </>
  );
}

export default OtherExpensesApproval;
