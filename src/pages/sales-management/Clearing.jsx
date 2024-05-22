import { Box } from "@mui/material";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext";
import CommonTable from "../../components/CommonTable";
import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";
import SearchActionMixin from "../../components/mixins/SearchActionMixin";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import {
  useClearPaymentTransactionMutation,
  useGetAllPaymentHistoriesQuery,
} from "../../features/sales-management/api/paymentTransactionApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";

function Clearing() {
  const [tabViewing, setTabViewing] = useState(1);
  const [clearingStatus, setClearingStatus] = useState("For Clearing");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const [checkedArray, setCheckedArray] = useState([]);

  //Hooks
  const { notifications, isNotificationFetching } = useContext(AppContext);
  const confirm = useConfirm();
  const snackbar = useSnackbar();

  //Constants
  const tabsList = useMemo(() => {
    return [
      {
        case: 1,
        name: "For Clearing",
        clearingStatus: "For Clearing",
        badge: notifications["forClearing"],
      },
      {
        case: 2,
        name: "Cleared",
        clearingStatus: "Cleared",
        badge: notifications["cleared"],
      },
    ];
  }, [notifications]);

  const customOrderKeys = [
    "id",
    "businessName",
    "date",
    "amount",
    "paymentType",
  ];
  const tableHeads = [
    "Tx Number",
    "Business Name",
    "Date",
    "Amount",
    "Payment Type",
  ];
  const pesoArray = ["amount"];

  //RTK Query
  const [clearPaymentTransaction] = useClearPaymentTransactionMutation();
  const [patchReadNotification] = usePatchReadNotificationMutation();
  const { data: paymentData, isFetching: isPaymentFetching } =
    useGetAllPaymentHistoriesQuery({
      // PaymentStatus: clearingStatus === "Cleared" ? "Cleared" : "Received",
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      Search: search,
      Status: true,
    });

  //Functions
  const onClear = async () => {
    try {
      await confirm({
        children: <>Are you sure you want to clear selected transactions?</>,
        question: true,
        callback: () =>
          clearPaymentTransaction({
            transactions: checkedArray?.map(
              (item) => paymentData?.transactions?.[item]?.id
            ),
          }).unwrap(),
      });

      snackbar({
        message: "Transaction cleared successfully",
        variant: "success",
      });
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }
    }
  };

  //UseEffect
  useEffect(() => {
    if (paymentData) {
      setCount(paymentData.totalCount);
    }
  }, [paymentData]);

  useEffect(() => {
    const foundItem = tabsList.find((item) => item.case === tabViewing);

    setClearingStatus(foundItem?.clearingStatus);
  }, [tabViewing, tabsList]);

  useEffect(() => {
    if (notifications["forClearing"] > 0 && clearingStatus === "For Clearing") {
      patchReadNotification({ Tab: "For Clearing" });
    }
  }, [clearingStatus, patchReadNotification, notifications]);

  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage, tabViewing]);

  return (
    <Box className="commonPageLayout">
      <PageHeaderTabs
        wide
        pageTitle="Clearing"
        tabsList={tabsList}
        tabViewing={tabViewing}
        setTabViewing={setTabViewing}
        isNotificationFetching={isNotificationFetching}
      />

      <SearchActionMixin
        setSearch={setSearch}
        actionTitle="Clear"
        actionCallback={onClear}
        removeAction={clearingStatus === "Cleared"}
        disableAction={checkedArray.length === 0}
      />

      {isPaymentFetching ? (
        <CommonTableSkeleton lowerCompact />
      ) : (
        <CommonTable
          mapData={paymentData?.transactions}
          customOrderKeys={customOrderKeys}
          tableHeads={tableHeads}
          pesoArray={pesoArray}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={count}
          lowerCompact
          checkboxSelection={clearingStatus === "For Clearing"}
          includeActions={false}
          checkedArray={checkedArray}
          setCheckedArray={setCheckedArray}
        />
      )}
    </Box>
  );
}

export default Clearing;
