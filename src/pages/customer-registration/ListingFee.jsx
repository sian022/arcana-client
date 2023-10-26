import React, { useEffect, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box, Button, TextField } from "@mui/material";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import CommonTable from "../../components/CommonTable";
import { dummyTableData } from "../../utils/DummyData";
import useDisclosure from "../../hooks/useDisclosure";
import ListingFeeModal from "../../components/modals/ListingFeeModal";

function ListingFee() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("");
  const [clientStatus, setClientStatus] = useState("pending");

  //Disclosures
  const {
    isOpen: isListingFeeOpen,
    onOpen: onListingFeeOpen,
    onClose: onListingFeeClose,
  } = useDisclosure();

  //Constants
  const listingFeeNavigation = [
    {
      case: 1,
      name: "Pending Listing Fee",
      // badge: badges["forFreebies"],
    },
    {
      case: 2,
      name: "Approved Listing Fee",
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

  useEffect(() => {
    const foundItem = listingFeeNavigation.find(
      (item) => item.case === tabViewing
    );

    setClientStatus(foundItem?.name);
  }, [tabViewing]);

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

        <AddSearchMixin addTitle="Listing Fee" onAddOpen={onListingFeeOpen} />

        <CommonTable mapData={dummyTableData} moreCompact />
      </Box>

      <ListingFeeModal open={isListingFeeOpen} onClose={onListingFeeClose} />
    </>
  );
}

export default ListingFee;
