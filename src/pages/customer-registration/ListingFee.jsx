import { useContext, useEffect, useMemo, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box } from "@mui/material";
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
import { useSelector } from "react-redux";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import { AppContext } from "../../context/AppContext";
import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import AddButtonSearchMixin from "../../components/mixins/AddButtonSearchMixin";
import ListingFeeBalancesModal from "../../components/modals/registration/ListingFeeBalancesModal";
import { Wallet } from "@mui/icons-material";

function ListingFee() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [listingFeeStatus, setListingFeeStatus] = useState("Under review");
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

  const {
    isOpen: isBalancesOpen,
    onOpen: onBalancesOpen,
    onClose: onBalancesClose,
  } = useDisclosure();

  //RTK Query
  const { data, isFetching } = useGetAllListingFeeQuery({
    Search: search,
    Status: true,
    ListingFeeStatus: listingFeeStatus,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  const [deleteCancelListingFee, { isLoading: isDeleteLoading }] =
    useDeleteCancelListingFeeMutation();

  const [patchReadNotification] = usePatchReadNotificationMutation();

  //Constants
  const listingFeeNavigation = useMemo(
    () => [
      {
        case: 1,
        name: "Pending Listing Fee",
        listingFeeStatus: "Under review",
        // badge: notifications["pendingListingFee"],
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
    ],
    [notifications]
  );

  const tableHeads = [
    "Business Name",
    "Business Name",
    "Transaction Number",
    "Total Amount",
    // "Requested By",
  ];

  const customOrderKeys = [
    "businessName",
    "clientName",
    "listingFeeId",
    "total",
    // "requestedBy",
  ];

  const pesoArray = ["total"];

  //Misc Functions
  const handleOpenEdit = () => {
    setEditMode(true);
    onListingFeeOpen();
  };

  const onDeleteSubmit = async () => {
    try {
      await deleteCancelListingFee(selectedRowData?.listingFeeId).unwrap();

      snackbar({
        message: "Listing Fee cancelled successfully",
        variant: "success",
      });
      onDeleteClose();
    } catch (error) {
      snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
    }
  };

  useEffect(() => {
    const foundItem = listingFeeNavigation.find(
      (item) => item.case === tabViewing
    );

    setListingFeeStatus(foundItem?.listingFeeStatus);
  }, [tabViewing, listingFeeNavigation]);

  useEffect(() => {
    if (
      notifications["rejectedListingFee"] > 0 &&
      listingFeeStatus === "Rejected"
    ) {
      patchReadNotification({ Tab: "Rejected Listing Fee" });
    }

    if (
      notifications["approvedListingFee"] > 0 &&
      listingFeeStatus === "Approved"
    ) {
      patchReadNotification({ Tab: "Approved Listing Fee" });
    }
  }, [listingFeeStatus, patchReadNotification, notifications]);

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
          pageTitle="Listing Fee"
          tabsList={listingFeeNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
          isNotificationFetching={isNotificationFetching}
        />

        <AddButtonSearchMixin
          addTitle="Listing Fee"
          onAddOpen={onListingFeeOpen}
          setSearch={setSearch}
          buttonTitle="Listing Fee Balances"
          buttonIcon={<Wallet />}
          onButtonClick={onBalancesOpen}
        />

        {isFetching ? (
          <CommonTableSkeleton lowerCompact mt={"-20px"} />
        ) : (
          <CommonTable
            moveNoDataUp
            mapData={data?.listingFees}
            lowerCompact
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            pesoArray={pesoArray}
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            onView={onViewOpen}
            onEdit={listingFeeStatus !== "Approved" && handleOpenEdit}
            onHistory={onHistoryOpen}
            onCancel={listingFeeStatus === "Rejected" && onDeleteOpen}
            mt={"-20px"}
          />
        )}
      </Box>

      <ListingFeeDrawer
        isListingFeeOpen={isListingFeeOpen}
        onListingFeeClose={onListingFeeClose}
        editMode={editMode}
        setEditMode={setEditMode}
        onListingFeeViewClose={onViewClose}
        listingFeeStatus={listingFeeStatus}
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

      <ListingFeeBalancesModal
        open={isBalancesOpen}
        onClose={onBalancesClose}
      />
    </>
  );
}

export default ListingFee;
