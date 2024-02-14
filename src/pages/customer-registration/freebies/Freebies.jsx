import React, { useEffect, useState } from "react";
import PageHeaderTabs from "../../../components/PageHeaderTabs";
import { Box } from "@mui/material";
import AddSearchMixin from "../../../components/mixins/AddSearchMixin";
import CommonTable from "../../../components/CommonTable";
import useDisclosure from "../../../hooks/useDisclosure";
import ViewListingFeeModal from "../../../components/modals/ViewListingFeeModal";
import ListingFeeDrawer from "../../../components/drawers/ListingFeeDrawer";
import { useGetAllListingFeeQuery } from "../../../features/listing-fee/api/listingFeeApi";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import CommonDialog from "../../../components/CommonDialog";
import useSnackbar from "../../../hooks/useSnackbar";
import { useSelector } from "react-redux";
import ApprovalHistoryModal from "../../../components/modals/ApprovalHistoryModal";
import FreebieForm from "../prospecting/FreebieForm";
import FreebieFormWithUser from "./FreebieFormWithUser";

function Freebies() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [listingFeeStatus, setListingFeeStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const { showSnackbar } = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //Disclosures
  const {
    isOpen: isFreebieFormOpen,
    onOpen: onFreebieFormOpen,
    onClose: onFreebieFormClose,
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
  const { data: pendingData, isLoading: isPendingLoading } =
    useGetAllListingFeeQuery({
      Status: true,
      ListingFeeStatus: "Under review",
    });

  const { data: approvedData, isLoading: isApprovedLoading } =
    useGetAllListingFeeQuery({
      Status: true,
      ListingFeeStatus: "Approved",
    });

  const { data: rejectedData, isLoading: isRejectedLoading } =
    useGetAllListingFeeQuery({
      Status: true,
      ListingFeeStatus: "Rejected",
    });

  const { data, isLoading, isFetching } = useGetAllListingFeeQuery({
    Search: search,
    Status: true,
    ListingFeeStatus: listingFeeStatus,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  //Constants
  const freebiesNavigation = [
    {
      case: 1,
      name: "Pending Freebies",
      listingFeeStatus: "Under review",
      badge: pendingData?.totalCount || 0,
    },
    {
      case: 2,
      name: "Approved Freebies",
      listingFeeStatus: "Approved",
      badge: approvedData?.totalCount || 0,
    },
    {
      case: 3,
      name: "Rejected Freebies",
      listingFeeStatus: "Rejected",
      badge: rejectedData?.totalCount || 0,
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
    "listingItems",
    "clientId",
    "listingFeeId",
    "approvalId",
    "status",
    "cancellationReason",
    "requestId",
  ];

  const tableHeads = [
    "Owner's Name",
    "Business Name",
    "Requested By",
    "Total Amount",
    "Created At",
  ];

  const pesoArray = ["total"];

  //Misc Functions
  const handleOpenEdit = () => {
    setEditMode(true);
    onListingFeeOpen();
  };

  useEffect(() => {
    const foundItem = freebiesNavigation.find(
      (item) => item.case === tabViewing
    );

    setListingFeeStatus(foundItem?.listingFeeStatus);
  }, [tabViewing]);

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderTabs
          wide
          pageTitle="Freebies"
          tabsList={freebiesNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
        />

        <AddSearchMixin
          addTitle="Freebies"
          onAddOpen={onFreebieFormOpen}
          setSearch={setSearch}
        />

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
            includeActions
            onView={onViewOpen}
            tableHeads={tableHeads}
            pesoArray={pesoArray}
            onEdit={handleOpenEdit}
            onHistory={onHistoryOpen}
          />
        )}
      </Box>

      {/* <ListingFeeDrawer
        isListingFeeOpen={isListingFeeOpen}
        onListingFeeClose={onListingFeeClose}
        editMode={editMode}
        setEditMode={setEditMode}
        onListingFeeViewClose={onViewClose}
      /> */}

      <FreebieFormWithUser
        isFreebieFormOpen={isFreebieFormOpen}
        onFreebieFormClose={onFreebieFormClose}
      />

      {/* <ViewListingFeeModal
        onListingFeeDrawerOpen={onListingFeeOpen}
        setEditMode={setEditMode}
        open={isViewOpen}
        onClose={onViewClose}
      /> */}

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

      <ApprovalHistoryModal open={isHistoryOpen} onClose={onHistoryClose} />
    </>
  );
}

export default Freebies;
