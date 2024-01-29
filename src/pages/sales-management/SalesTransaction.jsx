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
import AddItemModal from "../../components/modals/sales-management/AddItemModal";
import useDisclosure from "../../hooks/useDisclosure";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";
import SwipeableItem from "../../components/sales-transaction/SwipeableItem";
import CashoutModal from "../../components/modals/sales-management/CashoutModal";
import TransactionsList from "../../components/sales-transaction/TransactionsList";

function SalesTransaction() {
  const [search, setSearch] = useState("");
  const [quickAdd, setQuickAdd] = useState(false);
  const [viewFilters, setViewFilters] = useState(false);
  const [transactionsMode, setTransactionsMode] = useState(
    sessionStorage.getItem("transactionsMode") || false
  );
  const [currentTime, setCurrentTime] = useState(
    moment().format("M/DD/YY h:mm a")
  );

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

  const {
    isOpen: isCashoutOpen,
    onOpen: onCashoutOpen,
    onClose: onCashoutClose,
  } = useDisclosure();

  //React Hook Form
  const {
    formState: { errors, isValid },
    reset,
    control,
    watch,
    getValues,
    setValue,
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

    watch("items").forEach((item) => {
      total += item.itemId?.priceChangeHistories?.[0]?.price * item.quantity;
    });

    return total;
  }, [watch("items")]);

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
        {transactionsMode ? (
          <TransactionsList setTransactionsMode={setTransactionsMode} />
        ) : (
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

              <Button
                color="white"
                variant="contained"
                onClick={() => {
                  setTransactionsMode(true);
                  sessionStorage.setItem("transactionsMode", true);
                }}
              >
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

                    <SecondaryButton
                      onClick={() => setViewFilters((prev) => !prev)}
                    >
                      Filters &nbsp;
                      <Tune />
                    </SecondaryButton>

                    <Box
                      sx={{
                        display: viewFilters ? "flex" : "none",
                        position: "absolute",
                        right: 0,
                        top: "40px",
                        zIndex: 2,
                        backgroundColor: "white !important",
                        border: "1px solid #dee2e6 !important",
                        boxShadow:
                          "0 4px 12px -4px hsla(0, 0%, 8%, 0.1), 0 4px 6px -5px hsla(0, 0%, 8%, 0.05) !important",
                        borderRadius: "5px",
                        padding: "20px",
                      }}
                    >
                      Under construction
                    </Box>
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
                        setValue={(newValue) =>
                          setValue(
                            `items[${index}].quantity`,
                            parseInt(newValue)
                          )
                        }
                        orderItem={watch("items")[index]}
                        // orderItem={orderItem}
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

                  <SecondaryButton
                    size="large"
                    disabled={!isValid}
                    onClick={onCashoutOpen}
                  >
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
        )}
      </Box>

      <AddItemModal
        open={isAddItemOpen}
        onClose={onAddItemClose}
        onSubmit={handleAddItem}
      />

      <CashoutModal
        total={totalAmount}
        resetTransaction={reset}
        orderData={getValues()}
        open={isCashoutOpen}
        onClose={onCashoutClose}
      />
    </>
  );
}

export default SalesTransaction;
