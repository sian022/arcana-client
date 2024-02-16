import { useContext, useEffect, useMemo, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box, TextField, debounce } from "@mui/material";
import CommonTable from "../../components/CommonTable";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import { useSelector } from "react-redux";
import {
  useApproveSpecialDiscountMutation,
  useGetAllSpecialDiscountQuery,
  useRejectSpecialDiscountMutation,
} from "../../features/special-discount/api/specialDiscountApi";
import useDisclosure from "../../hooks/useDisclosure";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { AppContext } from "../../context/AppContext";

function SpecialDiscountApproval() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  //Hooks
  const { notifications } = useContext(AppContext);
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //Disclosures
  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure();

  //Constants
  const customOrderKeys = ["id", "businessName", "clientName", "discount"];
  const tableHeads = [
    "Request No.",
    "Business Name",
    "Owner's Name",
    "Discount",
  ];
  const percentageArray = ["discount"];

  const spDiscountNavigation = useMemo(() => {
    return [
      {
        case: 1,
        name: "Pending Sp. Discount",
        approvalStatus: "Under review",
        badge: notifications["pendingSpDiscount"],
      },
      {
        case: 2,
        name: "Approved Sp. Discount",
        approvalStatus: "Approved",
        badge: notifications["approvedSpDiscount"],
      },
      {
        case: 3,
        name: "Rejected Sp. Discount",
        approvalStatus: "Rejected",
        badge: notifications["rejectedSpDiscount"],
      },
    ];
  }, [notifications]);

  //RTK Query: Get Special Discounts
  const { data, isFetching } = useGetAllSpecialDiscountQuery({
    Search: search,
    SpDiscountStatus: approvalStatus,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    Status: true,
  });

  //RTK Query: Approvals
  const [approveSpecialDiscount] = useApproveSpecialDiscountMutation();
  const [rejectSpecialDiscount] = useRejectSpecialDiscountMutation();

  // Functions: API
  const onApprove = async () => {
    try {
      await confirm({
        children: (
          <>
            Confirm approval of{" "}
            <span style={{ fontWeight: "700" }}>
              {selectedRowData?.discount * 100}%
            </span>{" "}
            special discount for <br />
            <span style={{ fontWeight: "700" }}>
              {selectedRowData?.businessName}
            </span>
            ?
          </>
        ),
        question: true,
        callback: () =>
          approveSpecialDiscount({ id: selectedRowData?.id }).unwrap(),
      });

      snackbar({
        message: "Special Discount approved successfully",
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const onReject = async () => {
    try {
      await confirm({
        children: (
          <>
            Confirm rejection of{" "}
            <span style={{ fontWeight: "700" }}>
              {selectedRowData?.discount * 100}%
            </span>{" "}
            special discount for <br />
            <span style={{ fontWeight: "700" }}>
              {selectedRowData?.businessName}
            </span>
            ?
          </>
        ),
        question: false,
        callback: () =>
          rejectSpecialDiscount({ id: selectedRowData?.id }).unwrap(),
      });

      snackbar({
        message: "Special Discount rejected successfully",
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  // Functions: Other
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  // UseEffect
  useEffect(() => {
    const foundItem = spDiscountNavigation.find(
      (item) => item.case === tabViewing
    );

    setApprovalStatus(foundItem?.approvalStatus);
  }, [tabViewing, spDiscountNavigation]);

  useEffect(() => {
    if (data) {
      setCount(data.totalCount);
    }
  }, [data]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderTabs
          wide
          pageTitle="Special Discount Approval"
          tabsList={spDiscountNavigation}
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

        {isFetching ? (
          <CommonTableSkeleton compact />
        ) : (
          <CommonTable
            mapData={data?.specialDiscounts}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            percentageArray={percentageArray}
            compact
            onApprove={approvalStatus === "Under review" ? onApprove : null}
            onReject={approvalStatus === "Under review" ? onReject : null}
            onHistory={onHistoryOpen}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
          />
        )}
      </Box>

      <ApprovalHistoryModal
        open={isHistoryOpen}
        onClose={onHistoryClose}
        variant="specialDiscount"
      />
    </>
  );
}

export default SpecialDiscountApproval;
