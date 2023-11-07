import React, { useEffect, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box, Button, TextField, debounce } from "@mui/material";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import CommonTable from "../../components/CommonTable";
import { dummyTableData } from "../../utils/DummyData";
import useDisclosure from "../../hooks/useDisclosure";
import ListingFeeModal from "../../components/modals/ListingFeeModal";
import ListingFeeDrawer from "../../components/drawers/ListingFeeDrawer";
import SearchFilterMixin from "../../components/mixins/SearchFilterMixin";
import ViewListingFeeModal from "../../components/modals/ViewListingFeeModal";

function ListingFeeApproval() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("");
  const [clientStatus, setClientStatus] = useState("pending");

  //Disclosures
  const {
    isOpen: isViewListingFeeOpen,
    onOpen: onViewListingFeeOpen,
    onClose: onViewListingFeeClose,
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
    {
      case: 3,
      name: "Rejected Listing Fee",
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

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

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
          pageTitle="Listing Fee Approval"
          tabsList={listingFeeNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
        />

        <Box sx={{ padding: "15px" }}>
          <TextField
            type="search"
            size="small"
            label="Search"
            onChange={(e) => {
              debouncedSetSearch(e.target.value);
            }}
            autoComplete="off"
          />
        </Box>

        <CommonTable mapData={dummyTableData} moreCompact />
      </Box>

      <ViewListingFeeModal
        // open={isViewListingFeeOpen}
        open={true}
        onClose={onViewListingFeeClose}
      />
    </>
  );
}

export default ListingFeeApproval;
