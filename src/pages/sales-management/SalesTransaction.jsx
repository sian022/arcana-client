import "../../assets/styles/salesTransaction.styles.scss";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Popover,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import SecondaryButton from "../../components/SecondaryButton";
import { KeyboardDoubleArrowRight, Tune } from "@mui/icons-material";
import { yupResolver } from "@hookform/resolvers/yup";
import { salesTransactionSchema } from "../../schema/schema";
import { useFieldArray, useForm } from "react-hook-form";
import moment from "moment";
import { debounce } from "../../utils/CustomFunctions";
import { useDispatch, useSelector } from "react-redux";
import NoProductFound from "../../assets/images/NoProductFound.svg";
import AddItemModal from "../../components/modals/sales-management/AddItemModal";
import useDisclosure from "../../hooks/useDisclosure";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";
import SwipeableItem from "../../components/sales-transaction/SwipeableItem";
import CashoutModal from "../../components/modals/sales-management/CashoutModal";
import TransactionsList from "../../components/sales-transaction/TransactionsList";
import UnderConstruction from "../../assets/images/under-construction.svg";
import { useGetAllClientsForPOSQuery } from "../../features/sales-management/api/salesTransactionApi";
import { useGetAllItemsByPriceModeIdQuery } from "../../features/setup/api/priceModeItemsApi";
import NoImage from "../../assets/images/NoImage.png";
// import SisigSample from "../../assets/images/SisigSample.png";

function SalesTransaction() {
  const [search, setSearch] = useState("");
  const [quickAdd, setQuickAdd] = useState(false);
  const [viewFilters, setViewFilters] = useState(false);
  const [transactionsMode, setTransactionsMode] = useState(
    sessionStorage.getItem("transactionsMode") || false
  );
  const [isLoading, setIsLoading] = useState(false);

  const [currentTime, setCurrentTime] = useState(
    moment().format("M/D/YY h:m a")
  );

  const fullName = useSelector((state) => state.login.fullname);

  const dispatch = useDispatch();
  const filterRef = useRef();

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

  //RTK Query: Autocomplete
  const { data: clientData, isLoading: isClientLoading } =
    useGetAllClientsForPOSQuery();
  const { data: productData, isFetching: isProductFetching } =
    useGetAllItemsByPriceModeIdQuery({
      Status: true,
      Page: 1,
      PageSize: 1000,
      Search: search,
      PriceModeId: watch("clientId") ? watch("clientId").priceModeId : -1,
    });

  //Functions
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  const totalAmount = useMemo(() => {
    let total = 0;

    watch("items").forEach((item) => {
      total += item.itemId?.currentPrice * item.quantity;
    });

    return total;
  }, [watch, watch("items"), watch()]);

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
      setCurrentTime(moment().format("M/D/YY h:m a"));
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run effect only once on mount

  useEffect(() => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    // Clear the timeout if the component unmounts before the timeout
    return () => clearTimeout(timeoutId);
  }, [watch("clientId")]);

  return (
    <>
      <Box className="commonPageLayout">
        {transactionsMode ? (
          <TransactionsList setTransactionsMode={setTransactionsMode} />
        ) : (
          <Box className="salesTransaction">
            <Box className="salesTransaction__header">
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
                className="salesTransaction__header__transactionsButton"
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
                  options={clientData || []}
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

                    <Tooltip title="Filters">
                      <Box ref={filterRef}>
                        <IconButton
                          onClick={() => setViewFilters((prev) => !prev)}
                          sx={{ height: "100%" }}
                        >
                          {/* Filters &nbsp; */}
                          <Tune />
                        </IconButton>
                      </Box>
                    </Tooltip>

                    <Popover
                      open={viewFilters}
                      anchorEl={filterRef.current}
                      onClose={() => setViewFilters(false)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        // vertical: "bottom",
                        horizontal: "right",
                      }}
                      elevation={3}
                    >
                      <Box sx={{ padding: "20px" }}>
                        <img src={UnderConstruction} width="150px" />
                        <Typography sx={{ mt: 1 }}>
                          Under construction!
                        </Typography>
                      </Box>
                    </Popover>
                  </Box>
                </Box>

                <Box
                  className={
                    "salesTransaction__body__itemsForm__itemsList" +
                    (productData?.priceModeItems?.length === 0 &&
                    !isProductFetching &&
                    !isLoading
                      ? " noProductFound"
                      : "")
                  }
                  sx={{
                    overflow:
                      isProductFetching || isLoading ? "hidden" : "auto",
                  }}
                >
                  {isProductFetching || isLoading ? (
                    <>
                      {Array.from({ length: 12 }).map((_, index) => (
                        <Skeleton
                          height="220"
                          key={index}
                          sx={{ transform: "none" }}
                        />
                      ))}
                    </>
                  ) : !watch("clientId") ? (
                    <Typography className="salesTransaction__body__itemsForm__itemsList__selectClientFirst">
                      Select client first
                    </Typography>
                  ) : productData?.priceModeItems?.length === 0 ? (
                    <Box className="salesTransaction__body__itemsForm__itemsList__noProductFound">
                      <img
                        width="200px"
                        src={NoProductFound}
                        alt="no-product-found"
                      />
                    </Box>
                  ) : (
                    productData?.priceModeItems?.map((item) => (
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
                        <Box className="salesTransaction__body__itemsForm__itemsList__itemCard__imageWrapper">
                          <img src={NoImage} alt="no-img" />
                        </Box>
                        <Box className="salesTransaction__body__itemsForm__itemsList__itemCard__labels">
                          <Typography
                            fontSize="1.2rem"
                            fontWeight="700"
                            textTransform="none"
                          >
                            {item.itemCode}
                          </Typography>

                          <Box className="salesTransaction__body__itemsForm__itemsList__itemCard__labels__price">
                            <Typography
                              fontWeight="700"
                              whiteSpace="nowrap"
                              color="white !important"
                            >
                              <span style={{ whiteSpace: "nowrap" }}>
                                ₱{" "}
                                {item.currentPrice?.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </Typography>
                          </Box>
                        </Box>

                        <Box className="salesTransaction__body__itemsForm__itemsList__itemCard__description">
                          <Typography fontSize="12px">
                            {item.itemDescription}
                          </Typography>
                        </Box>
                      </Button>
                    ))
                  )}
                </Box>

                {/* <Box className="salesTransaction__body__itemsForm__itemsList">
                  {isProductFetching || isLoading ? (
                    // <Box className="salesTransaction__body__itemsForm__itemsList__skeletons">
                    <>
                      {Array.from({ length: 7 }).map((_, index) => (
                        <Skeleton
                          height="60px"
                          key={index}
                          sx={{ transform: "none" }}
                        />
                      ))}
                    </>
                  ) : // </Box>
                  productData?.priceModeItems?.length === 0 ? (
                    <Box className="salesTransaction__body__itemsForm__itemsList__noProductFound">
                      <img
                        width="200px"
                        src={NoProductFound}
                        alt="no-product-found"
                      />
                    </Box>
                  ) : (
                    productData?.priceModeItems?.map((item) => (
                      <Button
                        key={item.id}
                        className="salesTransaction__body__itemsForm__itemsList__itemCard"
                        disableRipple
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
                                {item.currentPrice?.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </Typography>
                          </Box>

                          <Add />
                        </Box>
                      </Button>
                    ))
                  )}
                </Box> */}
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
                        remove={() => remove(index)}
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
