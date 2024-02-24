import { Box } from "@mui/material";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext";
import CommonTable from "../../components/CommonTable";
import { dummyTransactionsData } from "../../utils/DummyData";
import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";
import SearchActionMixin from "../../components/mixins/SearchActionMixin";

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
    "txNumber",
    "time",
    "amount",
    "paymentType",
    "businessName",
    "CINo.",
  ];

  //RTK Query
  const [patchReadNotification] = usePatchReadNotificationMutation();

  //UseEffect
  useEffect(() => {
    setCount(dummyTransactionsData.length);
  }, [dummyTransactionsData]);

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

  console.log(checkedArray);

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
        actionCallback={() => console.log("Cleared")}
        removeAction={clearingStatus === "Cleared"}
      />

      <CommonTable
        mapData={dummyTransactionsData}
        customOrderKeys={customOrderKeys}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        count={count}
        compact
        checkboxSelection={clearingStatus === "For Clearing"}
        includeActions={false}
        checkedArray={checkedArray}
        setCheckedArray={setCheckedArray}
      />
    </Box>
  );
}

export default Clearing;
