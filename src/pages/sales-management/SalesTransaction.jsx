import "../../assets/styles/salesTransaction.styles.scss";
import {
  Box,
  Button,
  Card,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import SecondaryButton from "../../components/SecondaryButton";
import { Add, KeyboardDoubleArrowRight, Sort } from "@mui/icons-material";
import { useGetAllClientsForListingFeeQuery } from "../../features/registration/api/registrationApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { salesTransactionSchema } from "../../schema/schema";
import { useForm } from "react-hook-form";
import TertiaryButton from "../../components/TertiaryButton";
import moment from "moment";
import { useGetAllProductsQuery } from "../../features/setup/api/productsApi";
import { debounce } from "../../utils/CustomFunctions";

function SalesTransaction() {
  const [search, setSearch] = useState("");

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    register,
    setValue,
    reset,
    control,
    watch,
    getValues,
  } = useForm({
    resolver: yupResolver(salesTransactionSchema.schema),
    mode: "onSubmit",
    defaultValues: salesTransactionSchema.defaultValues,
  });

  //RTK Query
  const {
    data: clientData,
    isLoading: isClientLoading,
    refetch: refetchClients,
  } = useGetAllClientsForListingFeeQuery({
    Status: true,
    PageNumber: 1,
    PageSize: 1000,
    // IncludeRejected: drawerMode === "edit" ? true : "",
  });

  const { data: productData, isFetching: isProductFetching } =
    useGetAllProductsQuery({
      Status: true,
      Page: 1,
      PageSize: 1000,
      Search: search,
    });

  //Functions
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    <Box className="commonPageLayout">
      {/* <Typography>Sales Transaction</Typography> */}
      <Box
        sx={{
          display: "flex",
          // flex: 1,
          // mb: "20px",
          flexDirection: "column",
          borderRadius: "5px",
          bgcolor: "primary.main",
          height: "580px",
        }}
      >
        <Box
          sx={{
            // height: "70px",
            height: "60px",
            mx: "15px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography color="white !important">Transaction No:</Typography>
            <Typography
              color="white !important"
              fontSize="1.4rem"
              fontWeight="700"
            >
              62291
            </Typography>
          </Box>

          <Button color="white" variant="contained">
            Transactions List &nbsp; <KeyboardDoubleArrowRight />
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flex: 1,
            mx: "15px",
            p: "15px",
            gap: "10px",
            bgcolor: "#fdfdfd",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: "15px",
              // overflow: "auto",
              overflow: "hidden",
              height: "100% !important",
            }}
          >
            <ControlledAutocomplete
              name={`clientId`}
              control={control}
              options={clientData?.regularClient || []}
              getOptionLabel={(option) =>
                option.businessName?.toUpperCase() +
                  " - " +
                  option.ownersName?.toUpperCase() || ""
              }
              disableClearable
              loading={isClientLoading}
              isOptionEqualToValue={() => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  // label="Business Name - Owner's Name"
                  placeholder="Business Name - Owner's Name"
                  helperText={errors?.clientId?.message}
                  error={errors?.clientId}
                />
              )}
              // onChange={(_, value) => {
              //   if (watch("clientId") && watch("listingItems")[0]?.itemId) {
              //     onClientConfirmationOpen();
              //     setConfirmationValue(value);
              //     return watch("clientId");
              //   } else {
              //     return value;
              //   }
              // }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TextField
                type="search"
                size="small"
                placeholder="Search"
                sx={{ width: "300px", bgcolor: "white !important" }}
                autoComplete="off"
                onChange={(e) => {
                  debouncedSetSearch(e.target.value);
                }}
              />

              <SecondaryButton>
                Sort &nbsp;
                <Sort />
              </SecondaryButton>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                pb: "5px",
              }}
            >
              {productData?.items?.map((item) => (
                <Button
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: "5px 20px",
                    color: "black",
                    boxShadow:
                      "0 4px 12px -4px hsla(0, 0%, 8%, 0.1), 0 4px 6px -5px hsla(0, 0%, 8%, 0.05)!important",

                    bgcolor: "white !important",
                    border: "1px solid #dee2e6!important",
                  }}
                >
                  {/* <Box className="ribbon red">
                      <span>Hot</span>
                    </Box> */}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "left",
                    }}
                  >
                    <Typography
                      fontSize="1.2rem"
                      fontWeight="700"
                      textTransform="none"
                    >
                      {item.itemCode}
                    </Typography>
                    <Typography fontSize="12px">
                      {item.itemDescription}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "success.main",
                        p: "5px 10px",
                        borderRadius: "10px",
                      }}
                    >
                      <Typography
                        fontWeight="700"
                        // fontSize="1.3rem"
                        whiteSpace="nowrap"
                        // color="green"
                        color="white !important"
                      >
                        ₱ {item.priceChangeHistories?.[0]?.price}
                      </Typography>
                    </Box>

                    <Add />
                  </Box>
                </Button>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "300px",
              // width: "400px",
              boxShadow:
                "0 4px 12px -4px hsla(0, 0%, 8%, 0.1), 0 4px 6px -5px hsla(0, 0%, 8%, 0.05)!important",

              bgcolor: "white !important",
              border: "1px solid #dee2e6!important",
              borderRadius: "5px",
            }}
          ></Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "40px",
            bgcolor: "primary.main",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            px: "15px",
            py: "5px",
          }}
        >
          <Typography color="white !important">User: Sian Dela Cruz</Typography>

          <Box sx={{ display: "flex", gap: "10px" }}>
            <Typography color="white !important">
              Date: {moment().format("M/DD/YY h:mm a")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SalesTransaction;
