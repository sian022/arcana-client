import { useContext, useEffect, useMemo, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box, TextField, debounce } from "@mui/material";
import CommonTable from "../../components/CommonTable";
import useDisclosure from "../../hooks/useDisclosure";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import { AppContext } from "../../context/AppContext";
import { useGetAllExpensesQuery } from "../../features/otherExpenses/api/otherExpensesRegApi";
import ViewExpensesModal from "../../components/modals/ViewExpensesModal";
import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";

function OtherExpensesApproval() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [expenseStatus, setExpenseStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const { notifications } = useContext(AppContext);

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

  const { data, isFetching } = useGetAllExpensesQuery({
    Search: search,
    Status: true,
    ExpenseStatus: expenseStatus,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  const [patchReadNotification] = usePatchReadNotificationMutation();

  //Constants
  const otherExpensesNavigation = useMemo(
    () => [
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
    ],
    [notifications]
  );

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
    "requestor",
  ];

  const pesoArray = ["totalAmount"];

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  useEffect(() => {
    const foundItem = otherExpensesNavigation.find(
      (item) => item.case === tabViewing
    );

    setExpenseStatus(foundItem?.expenseStatus);
  }, [tabViewing, otherExpensesNavigation]);

  useEffect(() => {
    if (expenseStatus === "Under review") {
      patchReadNotification({ Tab: "Pending Expenses" });
    }
  }, [expenseStatus, patchReadNotification]);

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
          <CommonTableSkeleton compact />
        ) : (
          <CommonTable
            mapData={data?.expenses}
            compact
            moveNoDataUp
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
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
