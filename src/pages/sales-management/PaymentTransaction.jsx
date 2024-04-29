import "../../assets/styles/paymentTransaction.styles.scss";
import { Box } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import CommonTable from "../../components/CommonTable";
import { AppContext } from "../../context/AppContext";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import {
  useGetAllSalesTransactionQuery,
  useVoidSalesTransactionMutation,
} from "../../features/sales-management/api/salesTransactionApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import PaymentPage from "./PaymentPage";
import PaymentHistoriesBySalesInvoiceModal from "../../components/modals/sales-management/PaymentHistoriesBySalesInvoiceModal";
import useDisclosure from "../../hooks/useDisclosure";
import { useSelector } from "react-redux";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import moment from "moment";

function PaymentTransaction() {
  const [paymentMode, setPaymentMode] = useState(false);
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("Pending");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const { notifications } = useContext(AppContext);

  //Hooks
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //Disclosures
  const {
    isOpen: isPaymentHistoriesOpen,
    onOpen: onPaymentHistoriesOpen,
    onClose: onPaymentHistoriesClose,
  } = useDisclosure();

  //RTK Query
  const { data: transactionData, isFetching: isTransactionFetching } =
    useGetAllSalesTransactionQuery({
      Page: page + 1,
      PageSize: rowsPerPage,
      Search: search,
      TransactionStatus: transactionStatus,
    });
  const [voidSalesTransaction] = useVoidSalesTransactionMutation();

  //Constants
  const paymentNavigation = useMemo(
    () => [
      {
        case: 1,
        name: "Receivable",
        transactionStatus: "Pending",
        badge: notifications["receivableTransaction"],
      },
      {
        case: 2,
        name: "Paid",
        transactionStatus: "Paid",
        badge: notifications["paidTransaction"],
      },
      {
        case: 3,
        name: "Voided",
        transactionStatus: "Voided",
        badge: notifications["voidedTransaction"],
      },
      {
        case: 4,
        name: "Cleared",
        transactionStatus: "Cleared",
        badge: notifications["clearedTransaction"],
      },
    ],
    [notifications]
  );

  //Constants
  const customOrderKeys = [
    "createdAt",
    "transactionNo",
    "businessName",
    "fullName",
    "chargeInvoiceNo",
    "totalAmountDue",
    "balance",
  ];

  const tableHeads = [
    "Date",
    "Tx No.",
    "Business Name",
    "Owner's Name",
    "CI No.",
    "Total Amount Due",
    "Remaining Balance",
  ];

  const pesoArray = ["totalAmountDue", "balance"];
  const disableActions = ["void"];

  //Functions
  const onVoid = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to void transaction number{" "}
            <span style={{ fontWeight: "bold" }}>
              {selectedRowData?.transactionNo}
            </span>
            ?
          </>
        ),
        question: false,
        callback: () =>
          voidSalesTransaction({ id: selectedRowData?.transactionNo }).unwrap(),
      });

      snackbar({
        message: "Transaction voided successfully",
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const checkIsVoidable = (date, totalAmount, balance) => {
    const isVoidable =
      moment(date).isAfter(moment().subtract(1, "days")) &&
      totalAmount - balance === 0;

    return isVoidable;
  };

  //UseEffect
  useEffect(() => {
    const foundItem = paymentNavigation.find(
      (item) => item.case === tabViewing
    );

    setTransactionStatus(foundItem?.transactionStatus);
  }, [tabViewing, paymentNavigation]);

  useEffect(() => {
    if (transactionData) {
      setCount(setCount(transactionData?.totalCount));
    }
  }, [transactionData]);

  useEffect(() => {
    if (transactionData) {
      setCount(transactionData?.totalCount);
    }
  }, [transactionData]);

  useEffect(() => {
    setPage(0);
  }, [rowsPerPage, search, transactionStatus]);

  return (
    <>
      <Box className="commonPageLayout">
        {paymentMode ? (
          <PaymentPage setPaymentMode={setPaymentMode} />
        ) : (
          <>
            <PageHeaderTabs
              pageTitle="Sales Invoices"
              setSearch={setSearch}
              tabsList={paymentNavigation}
              setTabViewing={setTabViewing}
              tabViewing={tabViewing}
              small
            />

            <AddSearchMixin
              title="Pay Now"
              endIcon={<KeyboardDoubleArrowRight />}
              setSearch={setSearch}
              onAddOpen={() => setPaymentMode(true)}
            />

            {isTransactionFetching ? (
              <CommonTableSkeleton lowerCompact mt={"-20px"} />
            ) : (
              <CommonTable
                mapData={transactionData?.transactions}
                customOrderKeys={customOrderKeys}
                tableHeads={tableHeads}
                includeActions
                lowerCompact
                moveNoDataUp
                pesoArray={pesoArray}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                count={count}
                mt={"-20px"}
                disableActions={
                  selectedRowData?.totalAmountDue !==
                    selectedRowData?.remainingBalance && disableActions
                }
                onVoid={
                  transactionStatus === "Pending" &&
                  checkIsVoidable(
                    selectedRowData?.createdAt,
                    selectedRowData?.totalAmountDue,
                    selectedRowData?.remainingBalance
                  ) &&
                  onVoid
                }
                onPaymentHistories={onPaymentHistoriesOpen}
              />
            )}
          </>
        )}
      </Box>

      <PaymentHistoriesBySalesInvoiceModal
        open={isPaymentHistoriesOpen}
        onClose={onPaymentHistoriesClose}
      />
    </>
  );
}

export default PaymentTransaction;
