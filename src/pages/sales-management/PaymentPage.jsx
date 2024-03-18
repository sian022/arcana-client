import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
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

function PaymentPage({ setPaymentMode }) {
  const [client, setClient] = useState(null);

  // Disclosures
  const {
    isOpen: isModalFormOpen,
    onOpen: onModalFormOpen,
    onClose: onModalFormClose,
  } = useDisclosure();

  //RTK Query
  const { data: clientData, isFetching: isClientFetching } =
    useGetAllClientsQuery({
      RegistrationStatus: "Approved",
      PageNumber: 1,
      PageSize: 1000,
    });

  //Functions

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
            <Box className="paymentPage__body__transactions__transactionsList">
              {dummyPaymentData.map((item, index) => (
                <Box
                  key={index}
                  className="paymentPage__body__transactions__transactionsList__item"
                >
                  a
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
