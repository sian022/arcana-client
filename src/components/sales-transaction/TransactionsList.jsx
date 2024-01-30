import React, { useState } from "react";
import DangerButton from "../DangerButton";
import { Box, TextField, Typography } from "@mui/material";
import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import CommonTable from "../CommonTable";
import { dummyTransactionsData } from "../../utils/DummyData";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import SecondaryButton from "../SecondaryButton";

function TransactionsList({ setTransactionsMode }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateFrom, setDateFrom] = useState(moment());
  const [dateTo, setDateTo] = useState(moment());
  const [dateFromTemp, setDateFromTemp] = useState(moment());
  const [dateToTemp, setDateToTemp] = useState(moment());

  //Constants
  const pesoArray = ["amount"];

  //Functions
  const handleSubmitDate = () => {
    setDateFrom(dateFromTemp);
    setDateTo(dateToTemp);
  };

  console.log("Date From: ", dateFrom);
  console.log("Date To: ", dateTo);

  return (
    <Box className="transactionsList">
      <Box className="transactionsList__header">
        <Box className="transactionsList__header__left">
          <DangerButton
            size="medium"
            onClick={() => {
              setTransactionsMode(false);
              sessionStorage.removeItem("transactionsMode");
            }}
          >
            <KeyboardDoubleArrowLeft /> Back to POS
          </DangerButton>

          <Typography className="transactionsList__header__left__title">
            Transactions List
          </Typography>
        </Box>

        <Box className="transactionsList__header__right">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Date From"
              value={dateFromTemp}
              onChange={setDateFromTemp}
              slotProps={{
                textField: { size: "small" },
              }}
              sx={{ width: "180px", whiteSpace: "pre-wrap", p: 0, m: 0 }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Date To"
              value={dateToTemp}
              onChange={setDateToTemp}
              slotProps={{
                textField: { size: "small" },
              }}
              sx={{ width: "180px" }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <SecondaryButton
            size="medium"
            onClick={handleSubmitDate}
            sx={{ ml: "10px" }}
          >
            Submit
          </SecondaryButton>
        </Box>
      </Box>

      <CommonTable
        mapData={dummyTransactionsData}
        pesoArray={pesoArray}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        count={dummyTransactionsData.length}
      />
    </Box>
  );
}

export default TransactionsList;
