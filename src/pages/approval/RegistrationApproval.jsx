import React, { useEffect, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box } from "@mui/material";
import SearchFilterMixin from "../../components/mixins/SearchFilterMixin";
import CommonTable from "../../components/CommonTable";
import ViewRegistrationDetailsModal from "../../components/modals/view-registration-modal/ViewRegistrationDetailsModal";
import useDisclosure from "../../hooks/useDisclosure";
import { useSelector } from "react-redux";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";

function RegistrationApproval() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [origin, setOrigin] = useState("");
  const [clientStatus, setClientStatus] = useState("under review");
  const [count, setCount] = useState(0);

  const selectedRowData = useSelector((state) => state.selectedRow.value);

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
  const { data: pendingData, isLoading: isPendingLoading } =
    useGetAllClientsQuery({
      Status: true,
      RegistrationStatus: "Under review",
    });

  const { data: approvedData, isLoading: isApprovedLoading } =
    useGetAllClientsQuery({
      Status: true,
      RegistrationStatus: "Approved",
    });

  const { data: rejectedData, isLoading: isRejectedLoading } =
    useGetAllClientsQuery({
      Status: true,
      RegistrationStatus: "Rejected",
    });

  const { data, isLoading, isFetching } = useGetAllClientsQuery({
    Search: search,
    Status: true,
    RegistrationStatus: clientStatus,
    Origin: origin,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

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

  const tableHeads = [
    "Owner's Name",
    "Contact Number",
    "Email Address",
    "Business Name",
    "Business Type",
    "Requested By",
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
  ];

  //Misc Functions

  useEffect(() => {
    const foundItem = registrationNavigation.find(
      (item) => item.case === tabViewing
    );

    setClientStatus(foundItem?.registrationStatus);
  }, [tabViewing]);

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  console.log(isHistoryOpen);
  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderTabs
          pageTitle="Registration Approval"
          tabsList={registrationNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
        />

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
            tableHeads={tableHeads}
            moreCompact
            editable
            onView={onViewOpen}
            onHistory={onHistoryOpen}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
          />
        )}
      </Box>

      <ViewRegistrationDetailsModal
        open={
          isViewOpen
          // true
        }
        onClose={onViewClose}
        approval
        clientStatus={clientStatus}
      />

      <ApprovalHistoryModal open={isHistoryOpen} onClose={onHistoryClose} />
    </>
  );
}

export default RegistrationApproval;
