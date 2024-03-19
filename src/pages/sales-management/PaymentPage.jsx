import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import { useState } from "react";
import DangerButton from "../../components/DangerButton";
import SecondaryButton from "../../components/SecondaryButton";
import useDisclosure from "../../hooks/useDisclosure";
import { dummyPaymentData } from "../../utils/DummyData";
import PaymentModalForm from "../../components/modals/sales-management/PaymentModalForm";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { paymentTransactionSchema } from "../../schema/schema";

function PaymentPage({ setPaymentMode }) {
  const [client, setClient] = useState(null);

  // Disclosures
  const {
    isOpen: isModalFormOpen,
    onOpen: onModalFormOpen,
    onClose: onModalFormClose,
  } = useDisclosure();

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

  //Functions
  const onSubmit = async (data) => {
    console.log(data);
  };

  //RTK Query
  const { data: clientData, isFetching: isClientFetching } =
    useGetAllClientsQuery({
      RegistrationStatus: "Approved",
      PageNumber: 1,
      PageSize: 1000,
    });

  //Functions
  const handleTransactionClick = (transactionId) => {
    const currentTransactionIds = watch("transactionIds") || [];
    const transactionIndex = currentTransactionIds.indexOf(transactionId);

    if (transactionIndex === -1) {
      // If not already selected, add it to the array
      setValue("transactionIds", [...currentTransactionIds, transactionId]);
    } else {
      // If already selected, remove it from the array
      setValue(
        "transactionIds",
        currentTransactionIds.filter((id) => id !== transactionId)
      );
    }
  };

  const handleSelectAll = (e) => {
    const { checked } = e.target;

    const allTransactionIds = dummyPaymentData.map(
      (transaction) => transaction.transactionNo
    );

    if (checked) {
      // If checkbox is checked, select all transaction IDs
      setValue("transactionIds", allTransactionIds);
    } else {
      // If checkbox is unchecked, deselect all transaction IDs
      setValue("transactionIds", []);
    }
  };

  return (
    <>
      <Box className="paymentPage">
        <Box className="paymentPage__header">
          <Box className="paymentPage__header__left">
            <IconButton onClick={() => setPaymentMode(false)}>
              <KeyboardDoubleArrowLeft sx={{ fontSize: "1.6rem" }} />
            </IconButton>

            <Typography className="paymentPage__header__left__title">
              Payment Transaction
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box className="paymentPage__filters">
          <Autocomplete
            options={clientData?.regularClient || []}
            getOptionLabel={(option) =>
              option.businessName?.toUpperCase() +
                " - " +
                option.ownersName?.toUpperCase() || ""
            }
            disableClearable
            loading={isClientFetching}
            isOptionEqualToValue={() => true}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Business Name - Owner's Name"
              />
            )}
            value={client}
            onChange={(_, value) => setClient(value)}
            sx={{ width: "40%" }}
          />

          <TextField
            type="search"
            size="small"
            label="Search"
            // onChange={(e) => {
            //   debouncedSetSearch(e.target.value);
            // }}
            autoComplete="off"
          />
        </Box>

        <Box className="paymentPage__body">
          <Box className="paymentPage__body__transactions">
            <Box className="paymentPage__body__transactions__checkAll">
              <Checkbox
                onChange={handleSelectAll}
                checked={
                  watch("transactionIds")?.length === dummyPaymentData.length
                }
                indeterminate={
                  watch("transactionIds").length > 0 &&
                  watch("transactionIds").length !== dummyPaymentData.length
                }
              />

              <Typography className="paymentPage__body__transactions__checkAll__label">
                Select All
              </Typography>
            </Box>

            <Box className="paymentPage__body__transactions__transactionsList">
              {dummyPaymentData.map((item) => (
                <Box
                  key={item.transactionNo}
                  className="paymentPage__body__transactions__transactionsList__item"
                  onClick={() => handleTransactionClick(item.transactionNo)}
                  sx={{
                    bgcolor: watch("transactionIds")?.includes(
                      item.transactionNo
                    )
                      ? "primary.light"
                      : "inherit",
                  }}
                >
                  <Typography className="paymentPage__body__transactions__transactionsList__item__date">
                    {item.date}
                  </Typography>

                  <Box className="paymentPage__body__transactions__transactionsList__item__identifiers">
                    <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__transactionNumber">
                      <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__transactionNumber__label">
                        Transaction Number:
                      </Box>

                      <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__transactionNumber__value">
                        {item.transactionNo}
                      </Box>
                    </Box>

                    <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__invoiceNumber">
                      <Typography className="paymentPage__body__transactions__transactionsList__item__identifiers__invoiceNumber__label">
                        Invoice Number:
                      </Typography>

                      <Typography className="paymentPage__body__transactions__transactionsList__item__identifiers__invoiceNumber__value">
                        {item.chargeInvoiceNo}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider variant="inset" />

                  <Box className="paymentPage__body__transactions__transactionsList__item__numbers">
                    <Box className="paymentPage__body__transactions__transactionsList__item__numbers__discount">
                      <Typography className="paymentPage__body__transactions__transactionsList__item__numbers__discount__label">
                        Discount:
                      </Typography>

                      <Typography className="paymentPage__body__transactions__transactionsList__item__numbers__discount__value">
                        10.00%
                      </Typography>
                    </Box>

                    <Box className="paymentPage__body__transactions__transactionsList__item__numbers__amount">
                      <Typography className="paymentPage__body__transactions__transactionsList__item__numbers__amount__label">
                        Amount:
                      </Typography>

                      <Typography className="paymentPage__body__transactions__transactionsList__item__numbers__amount__value">
                        ₱
                        {item.amount?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionsDigits: 2,
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box className="paymentPage__body__transactions__actions">
              <DangerButton>Void</DangerButton>
              <SecondaryButton>Pay</SecondaryButton>
            </Box>
          </Box>

          <Box className="paymentPage__body__payments"></Box>
        </Box>
      </Box>

      <PaymentModalForm open={isModalFormOpen} onClose={onModalFormClose} />
    </>
  );
}

export default PaymentPage;
