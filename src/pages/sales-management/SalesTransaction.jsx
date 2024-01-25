import "../../assets/styles/salesTransaction.styles.scss";
import {
  Box,
  Button,
  Card,
  Checkbox,
  ClickAwayListener,
  Divider,
  IconButton,
  Popover,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import SecondaryButton from "../../components/SecondaryButton";
import {
  Add,
  Info,
  KeyboardDoubleArrowRight,
  Remove,
  Tune,
} from "@mui/icons-material";
import { useGetAllClientsForListingFeeQuery } from "../../features/registration/api/registrationApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { salesTransactionSchema } from "../../schema/schema";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import moment from "moment";
import { useGetAllProductsQuery } from "../../features/setup/api/productsApi";
import { debounce } from "../../utils/CustomFunctions";
import { useDispatch, useSelector } from "react-redux";
import NoProductFound from "../../assets/images/NoProductFound.svg";
import useLongPress from "../../hooks/useLongPress";
import AddItemModal from "../../components/modals/sales-management/AddItemModal";
import useDisclosure from "../../hooks/useDisclosure";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";

function SalesTransaction() {
  const [search, setSearch] = useState("");
  const [quickAdd, setQuickAdd] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    moment().format("M/DD/YY h:mm a")
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const isQuantityOpen = Boolean(anchorEl);

  const fullName = useSelector((state) => state.login.fullname);

  const dispatch = useDispatch();

  //Disclosures
  const {
    isOpen: isAddItemOpen,
    onOpen: onAddItemOpen,
    onClose: onAddItemClose,
  } = useDisclosure();

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
    mode: "onChange",
    defaultValues: salesTransactionSchema.defaultValues,
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
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

  const totalAmount = useMemo(() => {
    let total = 0;

    fields.forEach((item) => {
      total += item.itemId?.priceChangeHistories?.[0]?.price * item.quantity;
    });

    return total;
  }, [fields]);

  const handleClickQuantity = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseQuantity = () => {
    setAnchorEl(null);
  };

  // const handleTotalAmount = () => {
  //   let totalAmount = 0;

  //   fields.forEach((item) => {
  //     totalAmount +=
  //       item.itemId?.priceChangeHistories?.[0]?.price * item.quantity;
  //   });

  //   return totalAmount;
  // };

  // const defaultOptions = {
  //   shouldPreventDefault: true,
  //   delay: 500,
  // };

  const addLongPressEvent = (index) =>
    useLongPress(
      () => {
        update(index, {
          itemId: watch("items")[index]?.itemId,
          quantity: watch("items")[index].quantity + 1,
        });
      },
      () => {
        update(index, {
          itemId: watch("items")[index]?.itemId,
          quantity: watch("items")[index].quantity + 1,
        });
      },
      defaultOptions
    );

  const handleAddItem = (item) => {
    const existingItemIndex = watch("items").findIndex(
      (existingItem) => existingItem.itemId?.itemCode === item.itemCode
    );

    if (existingItemIndex !== -1) {
      // Item with the same itemCode already exists, so increment the quantity
      update(existingItemIndex, {
        itemId: watch("items")[existingItemIndex]?.itemId,
        quantity: parseInt(watch("items")[existingItemIndex].quantity) + 1,
      });
    } else {
      // Item with the itemCode does not exist, so add a new item with quantity 1
      append({
        itemId: item,
        quantity: 1,
      });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("M/DD/YY h:mm a"));
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run effect only once on mount

  return (
    <>
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
            // height: "580px",
            height: "85vh",
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
              {/* <Typography color="white !important">Transaction No:</Typography>
          <Typography
            color="white !important"
            fontSize="1.4rem"
            fontWeight="700"
          >
            62291
          </Typography> */}
              <Typography
                color="white !important"
                fontSize="1.4rem"
                fontWeight="700"
              >
                Sales Transaction
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
                // disableClearable
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
                  sx={{ width: "50%", bgcolor: "white !important" }}
                  autoComplete="off"
                  onChange={(e) => {
                    debouncedSetSearch(e.target.value);
                  }}
                />

                <Box
                  sx={{ display: "flex", gap: "10px", position: "relative" }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <Checkbox
                      checked={quickAdd}
                      onChange={(e) => setQuickAdd(e.target.checked)}
                    />
                    <Typography>Quick Add</Typography>
                  </Box>

                  <SecondaryButton>
                    Filters &nbsp;
                    <Tune />
                  </SecondaryButton>

                  {/* <SecondaryButton>
                <SwapVert />
              </SecondaryButton> */}
                </Box>
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
                {isProductFetching ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      overflow: "hidden",
                    }}
                  >
                    {Array.from({ length: 7 }).map((_, index) => (
                      <Skeleton
                        height="60px"
                        key={index}
                        sx={{ transform: "none" }}
                      />
                    ))}
                  </Box>
                ) : productData?.items?.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    }}
                  >
                    <img
                      width="200px"
                      src={NoProductFound}
                      alt="no-product-found"
                    />
                  </Box>
                ) : (
                  productData?.items?.map((item) => (
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
                      onClick={() => {
                        if (quickAdd) {
                          handleAddItem(item);
                        } else {
                          dispatch(setSelectedRow(item));
                          onAddItemOpen();
                        }
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
                            ₱{" "}
                            {item.priceChangeHistories?.[0]?.price?.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </Typography>
                        </Box>

                        <Add />
                      </Box>
                    </Button>
                  ))
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "300px",
                // width: "400px",
                boxShadow:
                  "0 4px 12px -4px hsla(0, 0%, 8%, 0.1), 0 4px 6px -5px hsla(0, 0%, 8%, 0.05)!important",

                bgcolor: "white !important",
                border: "1px solid #dee2e6!important",
                borderRadius: "5px",
                padding: "10px 20px",
                gap: "5px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontSize="1.2rem" fontWeight="700">
                  Order Details
                </Typography>

                <Button
                  sx={{ textTransform: "none", color: "gray" }}
                  onClick={() => remove()}
                >
                  Clear All
                </Button>
              </Box>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto",
                  gap: "15px",
                  py: "5px",
                  flex: 1,
                }}
              >
                {fields.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    }}
                  >
                    <img
                      // width="200px"
                      width="150px"
                      src={NoProductFound}
                      alt="no-product-found"
                    />
                  </Box>
                ) : (
                  fields.map((orderItem, index) => (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      key={index}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <Typography fontSize="1rem" color="gray">
                            {orderItem.itemId?.itemCode}
                          </Typography>

                          {/* <ClickAwayListener onClickAway={handleTooltipClose}>
                        <div>
                          <Tooltip
                            PopperProps={{
                              disablePortal: true,
                            }}
                            onClose={handleTooltipClose}
                            open={open}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title="Add"
                          >
                            <Button onClick={handleTooltipOpen}>Click</Button>
                          </Tooltip>
                        </div>
                      </ClickAwayListener> */}

                          <Tooltip title={orderItem.itemId?.itemDescription}>
                            <Info
                              fontSize=""
                              sx={{ color: "gray", cursor: "pointer" }}
                            />
                          </Tooltip>
                        </Box>

                        <Typography fontSize="1rem" fontWeight="600">
                          ₱{" "}
                          {(
                            orderItem.itemId?.priceChangeHistories?.[0]?.price *
                            orderItem.quantity
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          // gap: "10px",
                          gap: "15px",
                        }}
                      >
                        <IconButton
                          color="warning"
                          onClick={() => {
                            watch("items")[index]?.quantity > 1
                              ? update(index, {
                                  itemId: watch("items")[index]?.itemId,
                                  quantity: watch("items")[index]?.quantity - 1,
                                })
                              : remove(index);
                          }}
                        >
                          <Remove />
                        </IconButton>

                        {/* <input
                      className="input-quantity"
                      type="number"
                      {...register(`items[${index}].quantity`)}
                      onChange={(e) => {
                        setValue(`items[${index}].quantity`, e.target.value);
                      }}
                    /> */}
                        <Typography
                          sx={{ cursor: "pointer" }}
                          onClick={handleClickQuantity}
                        >
                          {orderItem.quantity}
                        </Typography>

                        <Popover
                          open={isQuantityOpen}
                          anchorEl={anchorEl}
                          onClose={handleCloseQuantity}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                        >
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Controller
                              control={control}
                              name={`items[${index}].quantity`}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  sx={{
                                    width: "50px",
                                    // "& .MuiInputBase-root": {
                                    //   height: "30px",
                                    // },
                                  }}
                                  // onChange={(e) => {
                                  //   field.onChange(e);
                                  // }}
                                />
                              )}
                            />
                          </Box>
                        </Popover>

                        <IconButton
                          color="secondary"
                          // {...addLongPressEvent(index)}
                          onClick={() => {
                            update(index, {
                              itemId: watch("items")[index]?.itemId,
                              quantity:
                                parseInt(watch("items")[index].quantity) + 1,
                            });
                          }}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>

              <Divider sx={{ borderStyle: "dashed" }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  mt: "15px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography fontSize="1.3rem" color="gray">
                    Total:
                  </Typography>
                  <Typography
                    fontSize="1.3rem"
                    fontWeight="700"
                    color="primary"
                    // color="#1E90FF"
                  >
                    ₱{" "}
                    {totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    {/* {handleTotalAmount().toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
                  </Typography>
                </Box>

                <SecondaryButton size="large" disabled={!isValid}>
                  Cashout
                </SecondaryButton>
              </Box>
            </Box>
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
            <Typography color="white !important">User: {fullName}</Typography>

            <Box sx={{ display: "flex", gap: "10px" }}>
              <Typography color="white !important">
                Date: {currentTime}
                {/* Date: {moment().format("M/DD/YY h:mm a")} */}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <AddItemModal open={isAddItemOpen} onClose={onAddItemClose} />
    </>
  );
}

export default SalesTransaction;
