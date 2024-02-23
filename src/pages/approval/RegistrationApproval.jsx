import { useContext, useEffect, useMemo, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box } from "@mui/material";
import SearchFilterMixin from "../../components/mixins/SearchFilterMixin";
import CommonTable from "../../components/CommonTable";
import ViewRegistrationDetailsModal from "../../components/modals/view-registration-modal/ViewRegistrationDetailsModal";
import useDisclosure from "../../hooks/useDisclosure";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import { AppContext } from "../../context/AppContext";
// import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";

function RegistrationApproval() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [origin, setOrigin] = useState("");
  const [clientStatus, setClientStatus] = useState("Under review");
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

  const { data, isFetching } = useGetAllClientsQuery({
    Search: search,
    // Status: true,
    RegistrationStatus: clientStatus,
    Origin: origin,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  // const [patchReadNotification] = usePatchReadNotificationMutation();

  //Constants
  const registrationNavigation = useMemo(
    () => [
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
        // badge: notifications["approvedClient"],
      },
      {
        case: 3,
        name: "Rejected Clients",
        registrationStatus: "Rejected",
        // badge: notifications["rejectedClient"],
      },
    ],
    [notifications]
  );

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
    "Business Name",
    "Owner's Name",
    "Contact Number",
    "Business Type",
    "Cluster",
    "Requested By",
    "Origin",
  ];

  const customOrderKeys = [
    "businessName",
    "ownersName",
    "phoneNumber",
    "storeType",
    "clusterName",
    "requestor",
    "origin",
  ];

  //Misc Functions

  useEffect(() => {
    const foundItem = registrationNavigation.find(
      (item) => item.case === tabViewing
    );

    setClientStatus(foundItem?.registrationStatus);
  }, [tabViewing, registrationNavigation]);

  // useEffect(() => {
  //   if (clientStatus === "Under review") {
  //     patchReadNotification({ Tab: "Pending Clients" });
  //   }
  // }, [clientStatus, patchReadNotification]);

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
          pageTitle="Registration Approval"
          tabsList={registrationNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
          isNotificationFetching={isNotificationFetching}
        />

        <SearchFilterMixin
          setSearch={setSearch}
          selectOptions={selectOptions}
          setSelectValue={setOrigin}
        />
        {isFetching ? (
          <CommonTableSkeleton compact />
        ) : (
          <CommonTable
            mapData={data?.regularClient}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            compact
            moveNoDataUp
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
