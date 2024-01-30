import React, { useState } from "react";
import DangerButton from "../DangerButton";
import { Box, TextField, Typography } from "@mui/material";
import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import CommonTable from "../CommonTable";
import { dummyTransactionsData } from "../../utils/DummyData";
import { DatePicker } from "@mui/lab";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

function TransactionsList({ setTransactionsMode }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //Constants
  const pesoArray = ["amount"];

  return (
    <Box className="transactionsList">
      <Box className="transactionsList__header">
        <Box className="transactionsList__header__left">
          <DangerButton
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
              slotProps={{
                textField: { size: "small", required: true },
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Date From"
              slotProps={{
                textField: { size: "small", required: true },
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
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
