import { useEffect, useState } from "react";
import { Box, Divider, IconButton, TextField, Typography } from "@mui/material";
import { KeyboardDoubleArrowLeft, Search } from "@mui/icons-material";
import CommonTable from "../CommonTable";
import { dummyTransactionsData } from "../../utils/DummyData";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import SecondaryButton from "../SecondaryButton";
import useDisclosure from "../../hooks/useDisclosure";
import ViewTransactionModal from "../modals/sales-management/ViewTransactionModal";
import ViewAttachmentModal from "../modals/sales-management/ViewAttachmentModal";
import { debounce, handleCatchErrorMessage } from "../../utils/CustomFunctions";
import {
  useGetAllSalesTransactionQuery,
  useVoidSalesTransactionMutation,
} from "../../features/sales-management/api/salesTransactionApi";
import CommonTableSkeleton from "../CommonTableSkeleton";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { useSelector } from "react-redux";

function TransactionsList({ setTransactionsMode }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [dateFrom, setDateFrom] = useState(moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [dateFromTemp, setDateFromTemp] = useState(moment());
  const [dateToTemp, setDateToTemp] = useState(moment());

  // Hooks
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //Disclosures
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const {
    isOpen: isAttachmentOpen,
    onOpen: onAttachmentOpen,
    onClose: onAttachmentClose,
  } = useDisclosure();

  //Constants
  const tableHeads = [
    "Tx Number",
    "Time",
    "Amount",
    "Business Name",
    "CI No.",
    "CI Status",
  ];
  const customOrderKeys = [
    "txNumber",
    "time",
    "amount",
    "businessName",
    "CINo.",
    "attachmentStatus",
  ];
  const pesoArray = ["amount"];

  //RTK Query
  const { data: transactionsData, isFetching: isTransactionsFetching } =
    useGetAllSalesTransactionQuery({
      Search: search,
      DateFrom: moment(dateFrom).format("YYYY-MM-DD"),
      DateTo: moment(dateTo).format("YYYY-MM-DD"),
    });
  const [voidSalesTransaction] = useVoidSalesTransactionMutation();

  //Functions: API Submit
  const onVoid = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to void transaction number{" "}
            <span style={{ fontWeight: "700" }}>
              {selectedRowData?.txNumber}
            </span>
            ?
          </>
        ),
        question: false,
        callback: () =>
          voidSalesTransaction({ id: selectedRowData?.id }).unwrap(),
      });

      snackbar({
        message: "Transaction voided successfully",
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }
    }
  };

  //Functions: Others
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  const handleSubmitDate = () => {
    setDateFrom(dateFromTemp);
    setDateTo(dateToTemp);
  };

  //UseEffect
  useEffect(() => {
    setCount(transactionsData?.totalCount);
  }, [transactionsData]);

  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage, dateFrom, dateTo]);

  return (
    <>
      <Box className="transactionsList">
        <Box className="transactionsList__header">
          <Box className="transactionsList__header__left">
            <IconButton
              onClick={() => {
                setTransactionsMode(false);
                sessionStorage.removeItem("transactionsMode");
              }}
              // sx={{ ml: "30px", height: "100%" }}
            >
              <KeyboardDoubleArrowLeft sx={{ fontSize: "1.6rem" }} />
            </IconButton>

            <Typography className="transactionsList__header__left__title">
              Transactions List
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box className="transactionsList__filters">
          <TextField
            type="search"
            size="small"
            label="Search"
            onChange={(e) => {
              debouncedSetSearch(e.target.value);
            }}
            autoComplete="off"
          />

          <Box className="transactionsList__filters__right">
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Date From"
                value={dateFromTemp}
                onChange={setDateFromTemp}
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
                sx={{ width: "200px" }}
                maxDate={dateToTemp}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Date To"
                value={dateToTemp}
                onChange={setDateToTemp}
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
                sx={{ width: "200px" }}
                minDate={dateFromTemp}
              />
            </LocalizationProvider>

            <SecondaryButton
              size="medium"
              onClick={handleSubmitDate}
              sx={{ ml: "10px", height: "100%" }}
            >
              <Search />
            </SecondaryButton>
          </Box>
        </Box>

        {isTransactionsFetching ? (
          <CommonTableSkeleton lessCompact />
        ) : (
          <CommonTable
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            mapData={transactionsData || dummyTransactionsData}
            pesoArray={pesoArray}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
            attachKey="attachmentStatus"
            onView={onViewOpen}
            onAttach={onAttachmentOpen}
            onVoid={onVoid}
            lessCompact
          />
        )}

        {/* <Box className="transactionsList__footer">
          <DangerButton
            size="medium"
            onClick={() => {
              setTransactionsMode(false);
              sessionStorage.removeItem("transactionsMode");
            }}
          >
            <KeyboardDoubleArrowLeft /> Back to POS
          </DangerButton>

          <Box className="transactionsList__footer__right">
            <TertiaryButton size="medium" onClick={onAttachmentOpen}>
              View Attachment
            </TertiaryButton>

            <SecondaryButton size="medium" onClick={onViewOpen}>
              View
            </SecondaryButton>
          </Box>
        </Box> */}
      </Box>

      <ViewTransactionModal open={isViewOpen} onClose={onViewClose} />

      <ViewAttachmentModal
        open={isAttachmentOpen}
        onClose={onAttachmentClose}
      />
    </>
  );
}

export default TransactionsList;
