import "../../assets/styles/paymentTransaction.styles.scss";
import { Box } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import CommonTable from "../../components/CommonTable";
import { dummyPaymentData } from "../../utils/DummyData";
import { AppContext } from "../../context/AppContext";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import { useGetAllSalesTransactionQuery } from "../../features/sales-management/api/salesTransactionApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import PaymentPage from "./PaymentPage";

function PaymentTransaction() {
  const [paymentMode, setPaymentMode] = useState(false);
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("Receivable");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const { notifications } = useContext(AppContext);

  //RTK Query
  const { data: transactionData, isFetching: isTransactionFetching } =
    useGetAllSalesTransactionQuery({
      Page: page + 1,
      PageSize: rowsPerPage,
      Search: search,
      TransactionStatus: transactionStatus,
    });

  //Constants
  const paymentNavigation = useMemo(
    () => [
      {
        case: 1,
        name: "Receivable",
        transactionStatus: "Receivable",
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
  const tableHeads = [
    "Date",
    "Tx No.",
    "Business Name",
    "Owner's Name",
    "CI No.",
    "Amount",
    "Balance",
  ];

  const pesoArray = ["amount", "amountBalance"];

  //Functions

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

  return (
    <>
      <Box className="commonPageLayout">
        {paymentMode ? (
          <PaymentPage setPaymentMode={setPaymentMode} />
        ) : (
          <>
            <PageHeaderTabs
              pageTitle="Transactions"
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
              <CommonTableSkeleton compact mt={"-20px"} />
            ) : (
              <CommonTable
                mapData={dummyPaymentData}
                includeActions={
                  transactionStatus === "Receivable" ||
                  transactionStatus === "Paid"
                }
                compact
                tableHeads={tableHeads}
                pesoArray={pesoArray}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                count={count}
                mt={"-20px"}
              />
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default PaymentTransaction;
