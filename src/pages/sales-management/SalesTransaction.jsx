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
import { useSwipeable } from "react-swipeable";
import SwipeableItem from "../../components/sales-transaction/SwipeableItem";

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

  // //React Swipeable
  // const { ref: swipeableRef } = useSwipeable({
  //   onSwipedLeft: (eventData) => alert("User Swiped!"),
  //   trackMouse: true,
  // });

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
    mode: "onSubmit",
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

  const handleAddItem = (item, quantity) => {
    const existingItemIndex = watch("items").findIndex(
      (existingItem) => existingItem.itemId?.itemCode === item.itemCode
    );

    if (existingItemIndex !== -1) {
      // Item with the same itemCode already exists, so increment the quantity
      update(existingItemIndex, {
        itemId: watch("items")[existingItemIndex]?.itemId,
        quantity: quantity
          ? parseInt(watch("items")[existingItemIndex].quantity) +
            parseInt(quantity)
          : parseInt(watch("items")[existingItemIndex].quantity) + 1,
      });
    } else {
      // Item with the itemCode does not exist, so add a new item with quantity 1
      append({
        itemId: item,
        quantity: quantity ? parseInt(quantity) : 1,
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
        <Box className="salesTransaction">
          <Box className="salesTransaction__header">
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

            <Button color="white" variant="contained">
              Transactions List &nbsp; <KeyboardDoubleArrowRight />
            </Button>
          </Box>

          <Box className="salesTransaction__body">
            <Box className="salesTransaction__body__itemsForm">
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

              <Box className="salesTransaction__body__itemsForm__searchFilter">
                <TextField
                  className="salesTransaction__body__itemsForm__searchFilter__search"
                  type="search"
                  size="small"
                  placeholder="Search"
                  autoComplete="off"
                  onChange={(e) => {
                    debouncedSetSearch(e.target.value);
                  }}
                />

                <Box className="salesTransaction__body__itemsForm__searchFilter__right">
                  <Box className="salesTransaction__body__itemsForm__searchFilter__right__quickAdd">
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
                </Box>
              </Box>

              <Box className="salesTransaction__body__itemsForm__itemsList">
                {isProductFetching ? (
                  <Box className="salesTransaction__body__itemsForm__itemsList__skeletons">
                    {Array.from({ length: 7 }).map((_, index) => (
                      <Skeleton
                        height="60px"
                        key={index}
                        sx={{ transform: "none" }}
                      />
                    ))}
                  </Box>
                ) : productData?.items?.length === 0 ? (
                  <Box className="salesTransaction__body__itemsForm__itemsList__noProductFound">
                    <img
                      width="200px"
                      src={NoProductFound}
                      alt="no-product-found"
                    />
                  </Box>
                ) : (
                  productData?.items?.map((item) => (
                    <Button
                      className="salesTransaction__body__itemsForm__itemsList__itemCard"
                      key={item.id}
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

                      <Box className="salesTransaction__body__itemsForm__itemsList__itemCard__labels">
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

                      <Box className="salesTransaction__body__itemsForm__itemsList__itemCard__right">
                        <Box className="salesTransaction__body__itemsForm__itemsList__itemCard__right__price">
                          <Typography
                            fontWeight="700"
                            whiteSpace="nowrap"
                            color="white !important"
                          >
                            <span style={{ whiteSpace: "nowrap" }}>
                              ₱{" "}
                              {item.priceChangeHistories?.[0]?.price?.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </span>
                          </Typography>
                        </Box>

                        <Add />
                      </Box>
                    </Button>
                  ))
                )}
              </Box>
            </Box>

            <Box className="salesTransaction__body__orderDetails">
              <Box className="salesTransaction__body__orderDetails__header">
                <Typography fontSize="1.2rem" fontWeight="700">
                  Order Details
                </Typography>

                <Button onClick={() => remove()}>Clear All</Button>
              </Box>

              <Divider />

              <Box className="salesTransaction__body__orderDetails__itemsList">
                {fields.length === 0 ? (
                  <Box className="salesTransaction__body__orderDetails__itemsList__noProductFound">
                    <img
                      // width="200px"
                      width="150px"
                      src={NoProductFound}
                      alt="no-product-found"
                    />
                  </Box>
                ) : (
                  fields.map((orderItem, index) => (
                    <SwipeableItem
                      key={index}
                      orderItem={orderItem}
                      onMinus={() => {
                        watch("items")[index]?.quantity > 1
                          ? update(index, {
                              itemId: watch("items")[index]?.itemId,
                              quantity: watch("items")[index]?.quantity - 1,
                            })
                          : remove(index);
                      }}
                      onPlus={() => {
                        update(index, {
                          itemId: watch("items")[index]?.itemId,
                          quantity:
                            parseInt(watch("items")[index].quantity) + 1,
                        });
                      }}
                      onSwipeLeft={() => remove(index)}
                    />
                    // <Box
                    //   key={index}
                    //   ref={swipeableRef}
                    //   className="salesTransaction__body__orderDetails__itemsList__item"
                    // >
                    //   <Box>
                    //     <Tooltip
                    //       title={orderItem.itemId?.itemDescription}
                    //       sx={{ cursor: "pointer" }}
                    //     >
                    //       <Box className="salesTransaction__body__orderDetails__itemsList__item__labels">
                    //         <Typography fontSize="1rem" color="gray">
                    //           {orderItem.itemId?.itemCode}
                    //         </Typography>

                    //         <Info fontSize="" sx={{ color: "gray" }} />
                    //       </Box>
                    //     </Tooltip>

                    //     <Typography fontSize="1rem" fontWeight="600">
                    //       <span style={{ whiteSpace: "nowrap" }}>
                    //         ₱{" "}
                    //         {(
                    //           orderItem.itemId?.priceChangeHistories?.[0]
                    //             ?.price * orderItem.quantity
                    //         ).toLocaleString(undefined, {
                    //           minimumFractionDigits: 2,
                    //           maximumFractionDigits: 2,
                    //         })}
                    //       </span>
                    //     </Typography>
                    //   </Box>

                    //   <Box className="salesTransaction__body__orderDetails__itemsList__item__right">
                    //     <IconButton
                    //       color="warning"
                    //       onClick={() => {
                    //         watch("items")[index]?.quantity > 1
                    //           ? update(index, {
                    //               itemId: watch("items")[index]?.itemId,
                    //               quantity: watch("items")[index]?.quantity - 1,
                    //             })
                    //           : remove(index);
                    //       }}
                    //     >
                    //       <Remove />
                    //     </IconButton>

                    //     {/* <input
                    //   className="input-quantity"
                    //   type="number"
                    //   {...register(`items[${index}].quantity`)}
                    //   onChange={(e) => {
                    //     setValue(`items[${index}].quantity`, e.target.value);
                    //   }}
                    // /> */}
                    //     <Typography
                    //       sx={{ cursor: "pointer" }}
                    //       onClick={handleClickQuantity}
                    //     >
                    //       {orderItem.quantity.toLocaleString()}
                    //     </Typography>

                    //     <Popover
                    //       open={isQuantityOpen}
                    //       anchorEl={anchorEl}
                    //       onClose={handleCloseQuantity}
                    //       anchorOrigin={{
                    //         vertical: "top",
                    //         horizontal: "center",
                    //       }}
                    //       transformOrigin={{
                    //         vertical: "bottom",
                    //         horizontal: "left",
                    //       }}
                    //     >
                    //       <Box
                    //         sx={{ display: "flex", flexDirection: "column" }}
                    //       >
                    //         <Controller
                    //           control={control}
                    //           name={`items[${index}].quantity`}
                    //           render={({ field }) => (
                    //             <TextField
                    //               {...field}
                    //               size="small"
                    //               sx={{
                    //                 width: "50px",
                    //                 // "& .MuiInputBase-root": {
                    //                 //   height: "30px",
                    //                 // },
                    //               }}
                    //               // onChange={(e) => {
                    //               //   field.onChange(e);
                    //               // }}
                    //             />
                    //           )}
                    //         />
                    //       </Box>
                    //     </Popover>

                    //     <IconButton
                    //       color="secondary"
                    //       // {...addLongPressEvent(index)}
                    //       onClick={() => {
                    //         update(index, {
                    //           itemId: watch("items")[index]?.itemId,
                    //           quantity:
                    //             parseInt(watch("items")[index].quantity) + 1,
                    //         });
                    //       }}
                    //     >
                    //       <Add />
                    //     </IconButton>
                    //   </Box>
                    // </Box>
                  ))
                )}
              </Box>

              <Divider sx={{ borderStyle: "dashed" }} />

              <Box className="salesTransaction__body__orderDetails__total">
                <Box className="salesTransaction__body__orderDetails__total__amount">
                  <Typography fontSize="1.3rem" color="gray">
                    Total:
                  </Typography>
                  <Typography
                    fontSize="1.3rem"
                    fontWeight="700"
                    color="primary"
                  >
                    <span style={{ whiteSpace: "nowrap" }}>
                      ₱{" "}
                      {totalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </Typography>
                </Box>

                <SecondaryButton size="large" disabled={!isValid}>
                  Cashout
                </SecondaryButton>
              </Box>
            </Box>
          </Box>

          <Box className="salesTransaction__footer">
            <Typography>User: {fullName}</Typography>

            <Typography>Date: {currentTime}</Typography>
          </Box>
        </Box>
      </Box>

      <AddItemModal
        open={isAddItemOpen}
        onClose={onAddItemClose}
        onSubmit={handleAddItem}
      />
    </>
  );
}

export default SalesTransaction;
