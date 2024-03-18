import "../../assets/styles/paymentTransaction.styles.scss";
import { Box, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import CommonTable from "../../components/CommonTable";
import { dummyPaymentData } from "../../utils/DummyData";
import useDisclosure from "../../hooks/useDisclosure";
import { AppContext } from "../../context/AppContext";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import { useGetAllSalesTransactionQuery } from "../../features/sales-management/api/salesTransactionApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import CommonModalForm from "../../components/CommonModalForm";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { paymentTransactionSchema } from "../../schema/schema";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { paymentTypes } from "../../utils/Constants";
import { NumericFormat } from "react-number-format";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
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

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(paymentTransactionSchema.schema),
    mode: "onChange",
    defaultValues: paymentTransactionSchema.defaultValues,
  });

  // Disclosures
  const {
    isOpen: isModalFormOpen,
    onOpen: onModalFormOpen,
    onClose: onModalFormClose,
  } = useDisclosure();

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
  const onSubmit = async (data) => {
    console.log(data);
  };

  const handleFormClose = () => {
    reset();
    onModalFormClose();
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

      <CommonModalForm
        title="Payment Transaction"
        open={isModalFormOpen}
        onClose={handleFormClose}
        onSubmit={handleSubmit(onSubmit)}
        disableSubmit={!isValid || !isDirty}
        width="800px"
        height="440px"
      >
        <Box className="paymentTransactionModal">
          <Box className="paymentTransactionModal__header">
            <Box className="paymentTransactionModal__header__item">
              <Typography>Payment Type</Typography>

              <ControlledAutocomplete
                name="paymentType"
                control={control}
                options={paymentTypes}
                getOptionLabel={(option) => option.label.toUpperCase()}
                disableClearable
                isOptionEqualToValue={() => true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Payment Type"
                    helperText={errors?.paymentType?.message}
                    error={errors?.paymentType}
                  />
                )}
                onChange={(_, value) => {
                  if (value?.label !== "Cheque") {
                    setValue("payee", "");
                    setValue("chequeDate", null);
                    setValue("bankName", "");
                    setValue("chequeNumber", "");
                    setValue("dateReceived", null);
                    setValue("chequeAmount", "");
                  } else if (value?.label !== "Online") {
                    setValue("accountName", "");
                    setValue("accountNumber", "");
                  }
                  return value;
                }}
              />
            </Box>

            <Box className="paymentTransactionModal__header__item">
              <Typography>Payment Amount</Typography>

              <Controller
                control={control}
                name={"amount"}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <NumericFormat
                    label="Payment Amount"
                    type="text"
                    size="small"
                    customInput={TextField}
                    autoComplete="off"
                    onValueChange={(e) => {
                      onChange(e.value === "" ? null : Number(e.value));
                    }}
                    inputRef={ref}
                    onBlur={onBlur}
                    value={value || ""}
                    thousandSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    prefix="₱"
                    decimalScale={2}
                  />
                )}
              />
            </Box>
          </Box>

          {watch("paymentType")?.label === "Cheque" && (
            <Box className="paymentTransactionModal__otherFields">
              <Controller
                name="payee"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Payee"
                    size="small"
                    autoComplete="off"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    helperText={errors?.payee?.message}
                    error={errors?.payee}
                  />
                )}
              />

              <Controller
                name="chequeDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      {...field}
                      label="Cheque Date"
                      slotProps={{
                        textField: { size: "small" },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          helperText={errors?.chequeDate?.message}
                          error={errors?.chequeDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />

              <Controller
                name="bankName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Bank Name"
                    size="small"
                    autoComplete="off"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    helperText={errors?.bankName?.message}
                    error={errors?.bankName}
                  />
                )}
              />

              <Controller
                name="chequeNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Cheque No."
                    size="small"
                    autoComplete="off"
                    {...field}
                    helperText={errors?.chequeNumber?.message}
                    error={errors?.chequeNumber}
                    type="number"
                  />
                )}
              />

              <Controller
                name="dateReceived"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      {...field}
                      label="Date Received"
                      slotProps={{
                        textField: { size: "small" },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          helperText={errors?.dateReceived?.message}
                          error={errors?.dateReceived}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />

              <Controller
                control={control}
                name="chequeAmount"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <NumericFormat
                    label="Cheque Amount"
                    type="text"
                    size="small"
                    customInput={TextField}
                    autoComplete="off"
                    onValueChange={(e) => {
                      onChange(e.value === "" ? null : Number(e.value));
                    }}
                    onBlur={onBlur}
                    inputRef={ref}
                    value={value || ""}
                    thousandSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    prefix="₱"
                    decimalScale={2}
                  />
                )}
              />
            </Box>
          )}

          {watch("paymentType")?.label === "Online" && (
            <Box className="paymentTransactionModal__otherFields">
              <Controller
                name="accountName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Account Name"
                    size="small"
                    autoComplete="off"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    helperText={errors?.accountName?.message}
                    error={errors?.accountName}
                  />
                )}
              />

              <Controller
                name="accountNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Account No."
                    size="small"
                    autoComplete="off"
                    {...field}
                    helperText={errors?.accountNumber?.message}
                    error={errors?.accountNumber}
                    type="number"
                  />
                )}
              />
            </Box>
          )}
        </Box>
      </CommonModalForm>
    </>
  );
}

export default PaymentTransaction;
