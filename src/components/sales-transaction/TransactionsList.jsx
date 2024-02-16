import React, { useState } from "react";
import DangerButton from "../DangerButton";
import {
  Box,
  Divider,
  IconButton,
  Input,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
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
import { debounce } from "../../utils/CustomFunctions";
import useConfirm from "../../hooks/useConfirm";

function TransactionsList({ setTransactionsMode }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateFrom, setDateFrom] = useState(moment());
  const [dateTo, setDateTo] = useState(moment());
  const [dateFromTemp, setDateFromTemp] = useState(moment());
  const [dateToTemp, setDateToTemp] = useState(moment());

  // Hooks
  const confirm = useConfirm();

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
    "Payment Type",
    "Business Name",
    "CI No.",
    "CI Status",
    // "Attach CI",
  ];
  const pesoArray = ["amount"];

  //Functions
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  const handleSubmitDate = () => {
    setDateFrom(dateFromTemp);
    setDateTo(dateToTemp);
  };

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
                renderInput={(params) => <TextField {...params} />}
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
                renderInput={(params) => <TextField {...params} />}
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

        <CommonTable
          tableHeads={tableHeads}
          mapData={dummyTransactionsData}
          pesoArray={pesoArray}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={dummyTransactionsData.length}
          attachKey="attachmentStatus"
          onView={onViewOpen}
          onAttach={onAttachmentOpen}
          // expanded
          lessCompact
        />

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
