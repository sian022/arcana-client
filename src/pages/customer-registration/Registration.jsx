import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import SearchFilterMixin from "../../components/mixins/SearchFilterMixin";
import CommonTable from "../../components/CommonTable";
import useDisclosure from "../../hooks/useDisclosure";
import PageHeaderAddTabs from "../../components/PageHeaderAddTabs";
import DirectRegisterForm from "./registration/DirectRegisterForm";
import {
  useGetAllClientsQuery,
  usePatchUpdateRegistrationStatusMutation,
} from "../../features/registration/api/registrationApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import ViewRegistrationDetailsModal from "../../components/modals/view-registration-modal/ViewRegistrationDetailsModal";
import CommonDialog from "../../components/CommonDialog";
import useSnackbar from "../../hooks/useSnackbar";
import { useSelector } from "react-redux";

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

  const { showSnackbar } = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

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

  //RTK Query
  const { data: pendingData, isLoading: isPendingLoading } =
    useGetAllClientsQuery({
      Status: status,
      RegistrationStatus: "Under review",
    });

  const { data: approvedData, isLoading: isApprovedLoading } =
    useGetAllClientsQuery({
      Status: status,
      RegistrationStatus: "Approved",
    });

  const { data: rejectedData, isLoading: isRejectedLoading } =
    useGetAllClientsQuery({
      Status: status,
      RegistrationStatus: "Rejected",
    });

  const { data, isLoading } = useGetAllClientsQuery({
    Search: search,
    Status: status,
    RegistrationStatus: clientStatus,
    Origin: origin,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  console.log(selectedRowData);

  const [patchUpdateRegistrationStatus, { isLoading: isUpdateStatusLoading }] =
    usePatchUpdateRegistrationStatusMutation();

  //Constants
  const registrationNavigation = [
    {
      case: 1,
      name: "Pending Clients",
      registrationStatus: "Under review",
      badge: pendingData?.totalCount || 0,
    },
    {
      case: 2,
      name: "Approved Clients",
      registrationStatus: "Approved",
      badge: approvedData?.totalCount || 0,
    },
    {
      case: 3,
      name: "Rejected Clients",
      registrationStatus: "Rejected",
      badge: rejectedData?.totalCount || 0,
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
  ];

  const tableHeads = [
    "Owner's Name",
    "Contact Number",
    "Email Address",
    "Business Name",
    "Business Type",
    "Requested By",
  ];

  const handleEditOpen = () => {
    setEditMode(true);
    onRegisterOpen();
  };

  const onArchiveSubmit = async () => {
    try {
      await patchUpdateRegistrationStatus(selectedRowData?.id).unwrap();
      onArchiveClose();
      console.log(selectedRowData?.id);
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

  useEffect(() => {
    const foundItem = registrationNavigation.find(
      (item) => item.case === tabViewing
    );

    setClientStatus(foundItem?.registrationStatus);
  }, [tabViewing]);

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  console.log(selectedRowData);

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

        {isLoading ? (
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
            // onArchive={true}
            status={status}
            onEdit={handleEditOpen}
            onArchive={onArchiveOpen}
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
    </>
  );
}

export default DirectRegistration;
