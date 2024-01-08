import React, { useContext, useEffect, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box } from "@mui/material";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import CommonTable from "../../components/CommonTable";
import useDisclosure from "../../hooks/useDisclosure";
import ViewListingFeeModal from "../../components/modals/ViewListingFeeModal";
import ListingFeeDrawer from "../../components/drawers/ListingFeeDrawer";
import {
  useDeleteCancelListingFeeMutation,
  useGetAllListingFeeQuery,
} from "../../features/listing-fee/api/listingFeeApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import CommonDialog from "../../components/CommonDialog";
import useSnackbar from "../../hooks/useSnackbar";
import { useDispatch, useSelector } from "react-redux";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import { AppContext } from "../../context/AppContext";
import { notificationApi } from "../../features/notification/api/notificationApi";
import { registrationApi } from "../../features/registration/api/registrationApi";
import SearchVoidFilterMixin from "../../components/mixins/SearchVoidFilterMixin";
import AddVoidSearchMixin from "../../components/mixins/AddVoidSearchMixin";

function ListingFee() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [listingFeeStatus, setListingFeeStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const { showSnackbar } = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const { notifications } = useContext(AppContext);
  const dispatch = useDispatch();

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

  const { data, isLoading, isFetching } = useGetAllListingFeeQuery({
    Search: search,
    Status: true,
    ListingFeeStatus: listingFeeStatus,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  const [deleteCancelListingFee, { isLoading: isDeleteLoading }] =
    useDeleteCancelListingFeeMutation();

  //Constants
  const listingFeeNavigation = [
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
      badge: notifications["approvedListingFee"],
    },
    {
      case: 3,
      name: "Rejected Listing Fee",
      listingFeeStatus: "Rejected",
      badge: notifications["rejectedListingFee"],
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
    "listingFeeApprovalHistories",
    "registrationStatus",
    "approvers",
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

  const onDeleteSubmit = async () => {
    try {
      const res = await deleteCancelListingFee(
        selectedRowData?.listingFeeId
      ).unwrap();

      showSnackbar("Listing Fee cancelled successfully", "success");
      dispatch(notificationApi.util.invalidateTags(["Notification"]));
      dispatch(registrationApi.util.invalidateTags(["Clients For Listing"]));
      onDeleteClose();
    } catch (error) {
      console.log(error);
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error cancelling listing fee", "error");
      }
    }
  };

  useEffect(() => {
    const foundItem = listingFeeNavigation.find(
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
          pageTitle="Listing Fee"
          tabsList={listingFeeNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
        />

        {/* <AddVoidSearchMixin
          addTitle="Listing Fee"
          onAddOpen={onListingFeeOpen}
          setSearch={setSearch}
          status={listingFeeStatus}
          setStatus={setListingFeeStatus}
        /> */}
        <AddSearchMixin
          addTitle="Listing Fee"
          onAddOpen={onListingFeeOpen}
          setSearch={setSearch}
        />

        {isFetching ? (
          <CommonTableSkeleton moreCompact mt={"-20px"} />
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
            onEdit={listingFeeStatus !== "Approved" && handleOpenEdit}
            onHistory={onHistoryOpen}
            onCancel={listingFeeStatus === "Rejected" && onDeleteOpen}
            mt={"-20px"}
          />
        )}
      </Box>

      {/* <ListingFeeModal open={isListingFeeOpen} onClose={onListingFeeClose} /> */}
      <ListingFeeDrawer
        isListingFeeOpen={isListingFeeOpen}
        onListingFeeClose={onListingFeeClose}
        editMode={editMode}
        setEditMode={setEditMode}
        onListingFeeViewClose={onViewClose}
      />

      <ViewListingFeeModal
        onListingFeeDrawerOpen={onListingFeeOpen}
        setEditMode={setEditMode}
        open={isViewOpen}
        onClose={onViewClose}
      />

      <CommonDialog
        open={isDeleteOpen}
        onClose={onDeleteClose}
        isLoading={isDeleteLoading}
        onYes={onDeleteSubmit}
      >
        Are you sure you want to cancel listing fee request for{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.businessName}
        </span>
        ?
      </CommonDialog>

      <ApprovalHistoryModal
        open={isHistoryOpen}
        onClose={onHistoryClose}
        variant="listingFee"
      />
    </>
  );
}

export default ListingFee;
