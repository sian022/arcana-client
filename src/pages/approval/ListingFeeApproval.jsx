import { useContext, useEffect, useMemo, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box, TextField, debounce } from "@mui/material";
import CommonTable from "../../components/CommonTable";
import useDisclosure from "../../hooks/useDisclosure";
import ViewListingFeeModal from "../../components/modals/ViewListingFeeModal";
import { useGetAllListingFeeQuery } from "../../features/listing-fee/api/listingFeeApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import { AppContext } from "../../context/AppContext";

function ListingFeeApproval() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [listingFeeStatus, setListingFeeStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const { notifications, isNotificationFetching } = useContext(AppContext);

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
  // const { data: pendingData, isLoading: isPendingLoading } =
  //   useGetAllListingFeeQuery({
  //     Status: true,
  //     ListingFeeStatus: "Under review",
  //   });

  // const { data: approvedData, isLoading: isApprovedLoading } =
  //   useGetAllListingFeeQuery({
  //     Status: true,
  //     ListingFeeStatus: "Approved",
  //   });

  // const { data: rejectedData, isLoading: isRejectedLoading } =
  //   useGetAllListingFeeQuery({
  //     Status: true,
  //     ListingFeeStatus: "Rejected",
  //   });

  const { data, isFetching } = useGetAllListingFeeQuery({
    Search: search,
    Status: true,
    ListingFeeStatus: listingFeeStatus,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  // const [patchReadNotification] = usePatchReadNotificationMutation();

  //Constants
  const listingFeeNavigation = useMemo(
    () => [
      {
        case: 1,
        name: "Pending Listing Fee",
        listingFeeStatus: "Under review",
        badge: notifications["pendingListingFee"],
      },
      {
        case: 2,
        name: "Approved Listing Fee",
        listingFeeStatus: "Approved",
        // badge: notifications["approvedListingFee"],
      },
      {
        case: 3,
        name: "Rejected Listing Fee",
        listingFeeStatus: "Rejected",
        // badge: notifications["rejectedListingFee"],
      },
    ],
    [notifications]
  );

  const tableHeads = [
    "Business Name",
    "Business Name",
    "Transaction Number",
    "Total Amount",
    "Requested By",
  ];

  const customOrderKeys = [
    "businessName",
    "clientName",
    "listingFeeId",
    "total",
    "requestor",
  ];

  const pesoArray = ["total"];

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  useEffect(() => {
    const foundItem = listingFeeNavigation.find(
      (item) => item.case === tabViewing
    );

    setListingFeeStatus(foundItem?.listingFeeStatus);
  }, [tabViewing, listingFeeNavigation]);

  // useEffect(() => {
  //   if (listingFeeStatus === "Under review") {
  //     patchReadNotification({ Tab: "Pending Listing Fee" });
  //   }
  // }, [listingFeeStatus, patchReadNotification]);

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [tabViewing, search, rowsPerPage]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderTabs
          wide
          pageTitle="Listing Fee Approval"
          tabsList={listingFeeNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
          isNotificationFetching={isNotificationFetching}
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
            mapData={data?.listingFees}
            compact
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
            moveNoDataUp
          />
        )}
      </Box>

      <ViewListingFeeModal
        open={isViewOpen}
        // open={true}
        onClose={onViewClose}
        underReview={listingFeeStatus === "Under review"}
        approval
        listingFeeStatus={listingFeeStatus}
      />

      <ApprovalHistoryModal
        open={isHistoryOpen}
        onClose={onHistoryClose}
        variant="listingFee"
      />
    </>
  );
}

export default ListingFeeApproval;
