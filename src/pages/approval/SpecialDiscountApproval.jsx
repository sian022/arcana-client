import React, { useEffect, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box, Button, TextField, debounce } from "@mui/material";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import CommonTable from "../../components/CommonTable";
import { dummyTableData } from "../../utils/DummyData";
import useDisclosure from "../../hooks/useDisclosure";
import SearchFilterMixin from "../../components/mixins/SearchFilterMixin";

function SpecialDiscountApproval() {
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
  const specialDiscountNavigation = [
    {
      case: 1,
      name: "Pending Sp. Discount",
      // badge: badges["forFreebies"],
    },
    {
      case: 2,
      name: "Approved Sp. Discount",
      // badge: badges["forReleasing"],
    },
    {
      case: 3,
      name: "Rejected Sp. Discount",
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
    const foundItem = specialDiscountNavigation.find(
      (item) => item.case === tabViewing
    );

    setClientStatus(foundItem?.name);
  }, [tabViewing]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderTabs
          wide
          pageTitle="Special Discount Approval"
          tabsList={specialDiscountNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
        />

        <Box sx={{ padding: "15px", my: "-20px" }}>
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

        <CommonTable mapData={dummyTableData} compact />
      </Box>
    </>
  );
}

export default SpecialDiscountApproval;
