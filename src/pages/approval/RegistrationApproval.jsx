import React, { useEffect, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box, Button } from "@mui/material";
import SearchFilterMixin from "../../components/mixins/SearchFilterMixin";
import CommonTable from "../../components/CommonTable";
import { dummyTableData } from "../../utils/DummyData";
import ViewRegistrationDetailsModal from "../../components/modals/view-registration-modal/ViewRegistrationDetailsModal";
import useDisclosure from "../../hooks/useDisclosure";
import CommonDialog from "../../components/CommonDialog";
import { useSelector } from "react-redux";

function RegistrationApproval() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("");
  const [clientStatus, setClientStatus] = useState("pending");

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //Disclosures
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  //Constants
  const registrationNavigation = [
    {
      case: 1,
      name: "Pending Client",
      // badge: badges["forFreebies"],
    },
    {
      case: 2,
      name: "Approved Client",
      // badge: badges["forReleasing"],
    },
    {
      case: 3,
      name: "Rejected Client",
      // badge: badges["forReleasing"],
    },
  ];

  const selectOptions = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "prospect",
      label: "Prospect",
    },
    {
      value: "direct",
      label: "Direct",
    },
  ];

  //Misc Functions

  useEffect(() => {
    const foundItem = registrationNavigation.find(
      (item) => item.case === tabViewing
    );

    setClientStatus(foundItem?.name);
  }, [tabViewing]);

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
        <CommonTable mapData={dummyTableData} moreCompact />
      </Box>

      <ViewRegistrationDetailsModal
        open={
          // isViewOpen
          true
        }
        onClose={onViewClose}
      />
    </>
  );
}

export default RegistrationApproval;
