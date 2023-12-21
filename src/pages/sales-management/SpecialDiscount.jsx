import { Box } from "@mui/material";
import React, { useContext, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { AppContext } from "../../context/AppContext";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import useDisclosure from "../../hooks/useDisclosure";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { dummyTableData } from "../../utils/DummyData";

function SpecialDiscount() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  // const [listingFeeStatus, setListingFeeStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const { notifications } = useContext(AppContext);

  //Disclosures
  const {
    isOpen: isSpDiscountOpen,
    onOpen: onSpDiscountOpen,
    onClose: onSpDiscountClose,
  } = useDisclosure();

  //Constants
  const spDiscountNavigation = [
    {
      case: 1,
      name: "Pending Sp. Discount",
      listingFeeStatus: "Under review",
      badge: notifications["pendingSpDiscount"],
    },
    {
      case: 2,
      name: "Approved Sp. Discount",
      listingFeeStatus: "Approved",
      badge: notifications["approvedSpDiscount"],
    },
    {
      case: 3,
      name: "Rejected Sp. Discount",
      listingFeeStatus: "Rejected",
      badge: notifications["rejectedSpDiscount"],
    },
  ];

  const isFetching = false;

  return (
    <Box className="commonPageLayout">
      <PageHeaderTabs
        wide
        pageTitle="Special Discount"
        tabsList={spDiscountNavigation}
        tabViewing={tabViewing}
        setTabViewing={setTabViewing}
      />

      <AddSearchMixin
        addTitle="Special Discount"
        onAddOpen={onSpDiscountOpen}
        setSearch={setSearch}
      />

      {isFetching ? (
        <CommonTableSkeleton moreCompact />
      ) : (
        <CommonTable
          mapData={dummyTableData}
          moreCompact
          // excludeKeysDisplay={excludeKeysDisplay}
          count={count}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          setPage={setPage}
          editable
          // onView={onViewOpen}
          // tableHeads={tableHeads}
          // pesoArray={pesoArray}
          // onEdit={handleOpenEdit}
          // onHistory={onHistoryOpen}
        />
      )}
    </Box>
  );
}

export default SpecialDiscount;
