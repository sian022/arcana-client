import React, { useContext, useEffect, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box, Button, TextField, debounce } from "@mui/material";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import CommonTable from "../../components/CommonTable";
import { dummyTableData } from "../../utils/DummyData";
import useDisclosure from "../../hooks/useDisclosure";
import ViewListingFeeModal from "../../components/modals/ViewListingFeeModal";
import { useGetAllListingFeeQuery } from "../../features/listing-fee/api/listingFeeApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import { AppContext } from "../../context/AppContext";

function OtherExpensesApproval() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("");
  const [otherExpensesStatus, setOtherExpensesStatus] =
    useState("Under review");
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

  const { data, isLoading, isFetching } = useGetAllListingFeeQuery({
    Search: search,
    Status: true,
    OtherExpensesStatus: otherExpensesStatus,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  //Constants
  const otherExpensesNavigation = [
    {
      case: 1,
      name: "Pending Expenses",
      otherExpensesStatus: "Under review",
      badge: notifications["pendingOtherExpenses"],
    },
    {
      case: 2,
      name: "Approved Expenses",
      otherExpensesStatus: "Approved",
      badge: notifications["approvedOtherExpenses"],
    },
    {
      case: 3,
      name: "Rejected Expenses",
      otherExpensesStatus: "Rejected",
      badge: notifications["rejectedOtherExpenses"],
    },
  ];

  const excludeKeysDisplay = [
    "listingItems",
    "clientId",
    "listingFeeId",
    "approvalId",
    "status",
    "cancellationReason",
    "requestId",
    "listingFeeApprovalHistories",
    "registrationStatus",
  ];

  const tableHeads = [
    "Owner's Name",
    "Business Name",
    "Requested By",
    "Total Amount",
    "Created At",
  ];

  const pesoArray = ["total"];

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  useEffect(() => {
    const foundItem = otherExpensesNavigation.find(
      (item) => item.case === tabViewing
    );

    setOtherExpensesStatus(foundItem?.otherExpensesStatus);
  }, [tabViewing]);

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

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

        <Box sx={{ padding: "15px" }}>
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
            mapData={data?.listingFees}
            moreCompact
            excludeKeysDisplay={excludeKeysDisplay}
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            editable
            onView={onViewOpen}
            tableHeads={tableHeads}
            pesoArray={pesoArray}
            onHistory={onHistoryOpen}
          />
        )}
      </Box>

      <ViewListingFeeModal
        open={isViewOpen}
        // open={true}
        onClose={onViewClose}
        underReview={otherExpensesStatus === "Under review"}
        approval
        otherExpensesStatus={otherExpensesStatus}
      />

      <ApprovalHistoryModal
        open={isHistoryOpen}
        onClose={onHistoryClose}
        variant="listingFee"
      />
    </>
  );
}

export default OtherExpensesApproval;
