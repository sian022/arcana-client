import React, { useEffect, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box } from "@mui/material";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import CommonTable from "../../components/CommonTable";
import useDisclosure from "../../hooks/useDisclosure";
import ViewListingFeeModal from "../../components/modals/ViewListingFeeModal";
import ListingFeeDrawer from "../../components/drawers/ListingFeeDrawer";
import { useGetAllListingFeeQuery } from "../../features/listing-fee/api/listingFeeApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";

function ListingFee() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [listingFeeStatus, setListingFeeStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

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

  //Constants
  const listingFeeNavigation = [
    {
      case: 1,
      name: "Pending Listing Fee",
      listingFeeStatus: "Under review",
      // badge: badges["forFreebies"],
    },
    {
      case: 2,
      name: "Approved Listing Fee",
      listingFeeStatus: "Approved",
      // badge: badges["forReleasing"],
    },
    {
      case: 3,
      name: "Rejected Listing Fee",
      listingFeeStatus: "Rejected",
    },
  ];

  const selectOptions = [
    {
      value: "all",
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

  const excludeKeysDisplay = ["listingFee", "clientId"];

  //RTK Query
  const { data: pendingData, isLoading: isPendingLoading } =
    useGetAllListingFeeQuery({
      Status: true,
      ListingFeeStatus: "Under review",
    });

  const { data: approvedData, isLoading: isApprovedLoading } =
    useGetAllListingFeeQuery({
      Status: true,
      ListingFeeStatus: "Approved",
    });

  const { data: rejectedData, isLoading: isRejectedLoading } =
    useGetAllListingFeeQuery({
      Status: true,
      ListingFeeStatus: "Rejected",
    });

  const { data, isLoading } = useGetAllListingFeeQuery({
    Search: search,
    Status: true,
    ListingFeeStatus: listingFeeStatus,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  useEffect(() => {
    const foundItem = listingFeeNavigation.find(
      (item) => item.case === tabViewing
    );

    setListingFeeStatus(foundItem?.listingFeeStatus);
  }, [tabViewing]);

  useEffect(() => {
    setCount(data?.count);
  }, [data]);

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

        <AddSearchMixin
          addTitle="Listing Fee"
          onAddOpen={onListingFeeOpen}
          setSearch={setSearch}
        />

        {isLoading ? (
          <CommonTableSkeleton moreCompact />
        ) : (
          <CommonTable
            mapData={data?.listingFees}
            moreCompact
            excludeKeysDisplay={excludeKeysDisplay}
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            editable
            onView={onViewOpen}
          />
        )}
      </Box>

      {/* <ListingFeeModal open={isListingFeeOpen} onClose={onListingFeeClose} /> */}
      <ListingFeeDrawer
        isListingFeeOpen={isListingFeeOpen}
        onListingFeeClose={onListingFeeClose}
      />

      <ViewListingFeeModal open={isViewOpen} onClose={onViewClose} />
    </>
  );
}

export default ListingFee;
