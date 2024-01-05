import React, { useContext, useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import SearchFilterMixin from "../../components/mixins/SearchFilterMixin";
import CommonTable from "../../components/CommonTable";
import useDisclosure from "../../hooks/useDisclosure";
import PageHeaderAddTabs from "../../components/PageHeaderAddTabs";
import DirectRegisterForm from "./registration/DirectRegisterForm";
import {
  useGetAllClientsQuery,
  usePatchUpdateRegistrationStatusMutation,
  usePutVoidClientRegistrationMutation,
} from "../../features/registration/api/registrationApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import ViewRegistrationDetailsModal from "../../components/modals/view-registration-modal/ViewRegistrationDetailsModal";
import CommonDialog from "../../components/CommonDialog";
import useSnackbar from "../../hooks/useSnackbar";
import { useSelector } from "react-redux";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import PrintFreebiesModal from "../../components/modals/PrintFreebiesModal";
import { AppContext } from "../../context/AppContext";

function DirectRegistration() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("");
  const [clientStatus, setClientStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [voidConfirmBox, setVoidConfirmBox] = useState("");

  const { showSnackbar } = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const { notifications } = useContext(AppContext);

  //Disclosures
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
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
    isOpen: isVoidOpen,
    onOpen: onVoidOpen,
    onClose: onVoidClose,
  } = useDisclosure();

  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure();

  const {
    isOpen: isPrintOpen,
    onOpen: onPrintOpen,
    onClose: onPrintClose,
  } = useDisclosure();

  //RTK Query
  // const { data: pendingData, isLoading: isPendingLoading } =
  //   useGetAllClientsQuery({
  //     Status: status,
  //     RegistrationStatus: "Under review",
  //   });

  // const { data: approvedData, isLoading: isApprovedLoading } =
  //   useGetAllClientsQuery({
  //     Status: status,
  //     RegistrationStatus: "Approved",
  //   });

  // const { data: rejectedData, isLoading: isRejectedLoading } =
  //   useGetAllClientsQuery({
  //     Status: status,
  //     RegistrationStatus: "Rejected",
  //   });

  const { data, isLoading, isFetching } = useGetAllClientsQuery({
    Search: search,
    Status: status,
    RegistrationStatus: clientStatus,
    Origin: origin,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  const [patchUpdateRegistrationStatus, { isLoading: isUpdateStatusLoading }] =
    usePatchUpdateRegistrationStatusMutation();
  const [putVoidClientRegistration, { isLoading: isVoidLoading }] =
    usePutVoidClientRegistrationMutation();

  //Constants
  const registrationNavigation = [
    {
      case: 1,
      name: "Pending Clients",
      registrationStatus: "Under review",
      badge: notifications["pendingClient"],
    },
    {
      case: 2,
      name: "Approved Clients",
      registrationStatus: "Approved",
      badge: notifications["approvedClient"],
    },
    {
      case: 3,
      name: "Rejected Clients",
      registrationStatus: "Rejected",
      badge: notifications["rejectedClient"],
    },
  ];

  const selectOptions = [
    {
      value: " ",
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
    "requestId",
    "businessAddress",
    "fixedDiscount",
    "ownersAddress",
    "attachments",
    "terms",
    "tinNumber",
    "authorizedRepresentative",
    "authorizedRepresentativePosition",
    "cluster",
    "freezer",
    "typeOfCustomer",
    "directDelivery",
    "bookingCoverage",
    "modeOfPayment",
    "variableDiscount",
    "longitude",
    "latitude",
    // "storeType",
    "dateOfBirth",
    "clientApprovalHistories",
    "freebies",
    "modeOfPayments",
    "updateHistories",
    "listingFees",
    "createdAt",
    "origin",
    "approvers",
  ];

  const tableHeads = [
    "Owner's Name",
    "Contact Number",
    "Email Address",
    "Business Name",
    // "Origin",
    "Business Type",
    "Requested By",
  ];

  const disableActions = ["printFreebies"];

  const handleEditOpen = () => {
    setEditMode(true);
    onRegisterOpen();
  };

  const onArchiveSubmit = async () => {
    try {
      await patchUpdateRegistrationStatus(selectedRowData?.id).unwrap();
      onArchiveClose();
      showSnackbar(
        `Client ${status ? "archived" : "restored"} successfully`,
        "success"
      );
    } catch (error) {
      if (error?.data?.messages) {
        showSnackbar(error?.data?.messages[0], "error");
      } else {
        showSnackbar("Error archiving client", "error");
      }
    }
  };

  const onVoidSubmit = async () => {
    try {
      await patchUpdateRegistrationStatus(selectedRowData?.id).unwrap();
      onVoidClose();
      showSnackbar("Client voided successfully", "success");
    } catch (error) {
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error voiding client", "error");
      }
    }
  };

  useEffect(() => {
    const foundItem = registrationNavigation.find(
      (item) => item.case === tabViewing
    );

    setClientStatus(foundItem?.registrationStatus);
  }, [tabViewing]);

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderAddTabs
          pageTitle="Registration"
          tabsList={registrationNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
          onOpen={onRegisterOpen}
          addTitle="Register Direct"
        />
        {/* <Box>
          <TextField type="search" placeholder="Search" size="small" />
        </Box> */}
        <SearchFilterMixin
          setSearch={setSearch}
          selectOptions={selectOptions}
          setSelectValue={setOrigin}
        />

        {isFetching ? (
          <CommonTableSkeleton moreCompact />
        ) : (
          <CommonTable
            mapData={data?.regularClient}
            excludeKeysDisplay={excludeKeysDisplay}
            moreCompact
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            tableHeads={tableHeads}
            editable
            onView={onViewOpen}
            onHistory={onHistoryOpen}
            // onArchive={true}
            status={status}
            onEdit={handleEditOpen}
            // onArchive={onArchiveOpen}
            onVoid={clientStatus === "Rejected" && onVoidOpen}
            onPrintFreebies={onPrintOpen}
            disableActions={
              (!selectedRowData?.freebies ||
                selectedRowData?.freebies?.length === 0) &&
              disableActions
            }
          />
        )}
      </Box>

      <DirectRegisterForm
        open={isRegisterOpen}
        onClose={onRegisterClose}
        editMode={editMode}
        setEditMode={setEditMode}
      />

      <ViewRegistrationDetailsModal
        open={isViewOpen}
        // open={true}
        onClose={onViewClose}
        onRegisterOpen={onRegisterOpen}
        editMode={editMode}
        setEditMode={setEditMode}
      />

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        isLoading={isUpdateStatusLoading}
        onYes={onArchiveSubmit}
      >
        Are you sure you want to {status ? "archive" : "restore"} client{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.businessName}
        </span>
        ?
      </CommonDialog>

      <CommonDialog
        open={isVoidOpen}
        onClose={onVoidClose}
        isLoading={isVoidLoading}
        onYes={onVoidSubmit}
        disableYes={voidConfirmBox !== selectedRowData?.businessName}
      >
        Are you sure you want to void client{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.businessName}
        </span>
        ? <br />
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
        </Box>
      </CommonDialog>

      <ApprovalHistoryModal open={isHistoryOpen} onClose={onHistoryClose} />

      <PrintFreebiesModal
        open={isPrintOpen}
        // open={true}
        onClose={onPrintClose}
      />
    </>
  );
}

export default DirectRegistration;
