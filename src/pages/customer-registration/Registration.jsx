import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import SearchFilterMixin from "../../components/mixins/SearchFilterMixin";
import CommonTable from "../../components/CommonTable";
import useDisclosure from "../../hooks/useDisclosure";
import PageHeaderAddTabs from "../../components/PageHeaderAddTabs";
import DirectRegisterForm from "./registration/DirectRegisterForm";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";

function DirectRegistration() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("");
  const [clientStatus, setClientStatus] = useState("pending");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  //Disclosures
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  //RTK Query
  const { data: pendingData, isLoading: isPendingLoading } =
    useGetAllClientsQuery({
      Status: true,
      RegistrationStatus: "Under Review",
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

  const { data, isLoading } = useGetAllClientsQuery({
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
      registrationStatus: "Under Review",
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
    "businessAddress",
    "fixedDiscount",
    "ownersAddress",
    "attachments",
    "terms",
  ];

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
          />
        )}

        <DirectRegisterForm open={isRegisterOpen} onClose={onRegisterClose} />
      </Box>
    </>
  );
}

export default DirectRegistration;
