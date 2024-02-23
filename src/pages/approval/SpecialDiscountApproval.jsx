import { useContext, useEffect, useMemo, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { Box, Checkbox, TextField, Typography, debounce } from "@mui/material";
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
import CommonDialog from "../../components/CommonDialog";
import { useSendMessageMutation } from "../../features/misc/api/rdfSmsApi";

function SpecialDiscountApproval() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const [reason, setReason] = useState("");
  const [confirmReason, setConfirmReason] = useState(false);

  //Hooks
  const { notifications } = useContext(AppContext);
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const messageReceiverNumberApproved =
    selectedRowData?.nextApproverMobileNumber
      ? selectedRowData?.nextApproverMobileNumber
      : selectedRowData?.requestorMobileNumber;
  const messageReceiverNumberRejected = selectedRowData?.requestorMobileNumber;

  const messageReceiverNameApproved = selectedRowData?.nextApprover
    ? selectedRowData?.nextApprover
    : selectedRowData?.requestor;
  const messageReceiverNameRejected = selectedRowData?.requestor;

  const messageReceiverMessageApproved = selectedRowData?.nextApprover
    ? "You have a new listing fee approval."
    : `${selectedRowData?.businessName}'s listing fee request has been approved.`;
  const messageReceiverMessageRejected = `${selectedRowData?.businessName}'s listing fee request has been rejected.`;

  //Disclosures
  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure();

  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onClose: onRejectClose,
  } = useDisclosure();

  //Constants
  const customOrderKeys = [
    // "id",
    "businessName",
    "clientName",
    "discount",
    "isOneTime",
    "requestedBy",
  ];
  const tableHeads = [
    // "Request No.",
    "Business Name",
    "Owner's Name",
    "Discount",
    "One Time Only",
    "Requested By",
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
  const [rejectSpecialDiscount, { isLoading: isRejectLoading }] =
    useRejectSpecialDiscountMutation();
  const [sendMessage, { isLoading: isSendMessageLoading }] =
    useSendMessageMutation();

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
        // callback: () =>
        //   approveSpecialDiscount({ id: selectedRowData?.requestId }).unwrap(),
        callback: async () => {
          await approveSpecialDiscount({
            id: selectedRowData?.requestId,
          }).unwrap();

          await sendMessage({
            message: `Fresh morning ${messageReceiverNameApproved}! ${messageReceiverMessageApproved}`,
            mobile_number: `+63${messageReceiverNumberApproved}`,
          }).unwrap();
        },
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
      await rejectSpecialDiscount({
        id: selectedRowData?.requestId,
        reason,
      }).unwrap();

      await sendMessage({
        message: `Fresh morning ${messageReceiverNameRejected}! ${messageReceiverMessageRejected}`,
        mobile_number: `+63${messageReceiverNumberRejected}`,
      }).unwrap();

      snackbar({
        message: "Special Discount rejected successfully",
        variant: "success",
      });

      handleRejectConfirmClose();
    } catch (error) {
      if (error.function !== "sendMessage") {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }

      snackbar({
        message:
          "Sp. discount rejected successfully but failed to send message.",
        variant: "warning",
      });
      handleRejectConfirmClose();
    }
  };

  // Functions: Other
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  const handleRejectConfirmClose = () => {
    setReason("");
    setConfirmReason(false);
    onRejectClose();
  };

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
            onReject={approvalStatus === "Under review" ? onRejectOpen : null}
            onHistory={onHistoryOpen}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
            moveNoDataUp
          />
        )}
      </Box>

      <ApprovalHistoryModal
        open={isHistoryOpen}
        onClose={onHistoryClose}
        variant="specialDiscount"
      />

      <CommonDialog
        onClose={handleRejectConfirmClose}
        open={isRejectOpen}
        onYes={onReject}
        disableYes={!confirmReason || !reason.trim()}
        isLoading={isRejectLoading || isSendMessageLoading}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Box>
            Are you sure you want to reject listing fee for{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.businessName || "client"}
            </span>
            ?
          </Box>

          <TextField
            size="small"
            label="Reason"
            autoComplete="off"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value.toUpperCase());
            }}
            multiline
            rows={3}
          />

          <Box sx={{ display: "flex", justifyContent: "end", gap: "5x" }}>
            <Typography>Confirm reason</Typography>
            <Checkbox
              checked={confirmReason}
              onChange={(e) => {
                setConfirmReason(e.target.checked);
              }}
              disabled={!reason.trim()}
            />
          </Box>
        </Box>
      </CommonDialog>
    </>
  );
}

export default SpecialDiscountApproval;
