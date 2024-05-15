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
import {
  KeyboardDoubleArrowRight,
  NoPhotography,
  ShoppingCartCheckout,
  Tune,
} from "@mui/icons-material";
import { yupResolver } from "@hookform/resolvers/yup";
import { salesTransactionSchema } from "../../schema/schema";
import { useFieldArray, useForm } from "react-hook-form";
import { debounce } from "../../utils/CustomFunctions";
import { useDispatch } from "react-redux";
import NoProductFound from "../../assets/images/NoProductFound.svg";
import AddItemModal from "../../components/modals/sales-management/AddItemModal";
import useDisclosure from "../../hooks/useDisclosure";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";
import SwipeableItem from "../../components/page-components/sales-management/sales-transaction/SwipeableItem";
import CashoutModal from "../../components/modals/sales-management/CashoutModal";
import TransactionsList from "../../components/page-components/sales-management/sales-transaction/TransactionsList";
import UnderConstruction from "../../assets/images/under-construction.svg";
import { useGetAllClientsForPOSQuery } from "../../features/sales-management/api/salesTransactionApi";
import { useGetAllItemsByPriceModeIdQuery } from "../../features/setup/api/priceModeItemsApi";

function SalesTransaction() {
  const [search, setSearch] = useState("");
  const [quickAdd, setQuickAdd] = useState(false);
  const [viewFilters, setViewFilters] = useState(false);
  const [transactionsMode, setTransactionsMode] = useState(
    sessionStorage.getItem("transactionsMode") || false
  );
  const [isLoading, setIsLoading] = useState(false);

  // const [currentTime, setCurrentTime] = useState(
  //   moment().format("M/D/YY h:m a")
  // );

  // const fullName = useSelector((state) => state.login.fullname);

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
    formState: { isValid },
    reset,
    control,
    watch,
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(salesTransactionSchema.schema),
    mode: "onChange",
    defaultValues: salesTransactionSchema.defaultValues,
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  //Hook Form Constant Values
  const watchAllValues = watch();
  const watchClientId = watch("clientId");

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
    return watchAllValues["items"].reduce((total, item) => {
      return total + (item.itemId?.currentPrice || 0) * item.quantity;
    }, 0);
  }, [watchAllValues]);

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

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentTime(moment().format("M/D/YY h:m a"));
  //   }, 1000); // Update every second

  //   // Cleanup interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []); // Empty dependency array to run effect only once on mount

  useEffect(() => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    // Clear the timeout if the component unmounts before the timeout
    return () => clearTimeout(timeoutId);
  }, [watchClientId]);

  return (
    <>
      <Box className="commonPageLayout">
        {transactionsMode ? (
          <TransactionsList setTransactionsMode={setTransactionsMode} />
        ) : (
          <Box className="salesTransaction">
            <Box className="salesTransaction__header">
              <Typography className="salesTransaction__header__title">
                Sales Transaction
              </Typography>

              <Button
                color="white"
                // color="secondary"
                variant="contained"
                className="salesTransaction__header__transactionsButton"
                onClick={() => {
                  setTransactionsMode(true);
                  sessionStorage.setItem("transactionsMode", true);
                }}
                endIcon={<KeyboardDoubleArrowRight />}
                size="small"
              >
                Transactions List
              </Button>
            </Box>

            {/* <Divider sx={{ mb: "15px" }} /> */}

            <Box className="salesTransaction__body">
              <Box className="salesTransaction__body__itemsForm">
                <Tooltip
                  followCursor
                  title={
                    watch("items")?.length > 0
                      ? "Clear items first before changing client"
                      : ""
                  }
                >
                  <>
                    <ControlledAutocomplete
                      name={`clientId`}
                      control={control}
                      options={clientData || []}
                      disabled={watch("items")?.length > 0}
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
                          placeholder="Business Name - Owner's Name"
                          sx={{
                            pointerEvents:
                              watch("items")?.length > 0 ? "none" : "auto",
                          }}
                          // helperText={errors?.clientId?.message}
                          // error={!!errors?.clientId}
                        />
                      )}
                    />
                  </>
                </Tooltip>

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
                        vertical: "center",
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
                    // <Box className="salesTransaction__body__itemsForm__itemsList__selectClientFirst">
                    //   <img src={SelectClientFirst} alt="select-client-first" />
                    // </Box>
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
                        key={item.itemId}
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
                          {item.itemImageLink ? (
                            <img src={item.itemImageLink} alt="product-img" />
                          ) : (
                            <NoPhotography
                              sx={{
                                padding: "10px",
                                fontSize: "120px",
                                color: "#7D8B99",
                              }}
                            />
                          )}
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
                                ₱
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
              </Box>

              <Box className="salesTransaction__body__orderDetails">
                <Box className="salesTransaction__body__orderDetails__header">
                  <Typography fontSize="1.2rem" fontWeight="700">
                    Order Details
                  </Typography>

                  <Button onClick={() => remove()}>Clear All</Button>
                </Box>

                <Divider />

                <Box
                  className="salesTransaction__body__orderDetails__itemsList"
                  // ref={animationParent}
                >
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
                        key={orderItem.id}
                        setValue={(newValue) =>
                          setValue(
                            `items[${index}].quantity`,
                            parseInt(newValue)
                          )
                        }
                        remove={() => remove(index)}
                        orderItem={watch("items")[index]}
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
                        ₱
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
                    endIcon={<ShoppingCartCheckout />}
                  >
                    Cashout
                  </SecondaryButton>
                </Box>
              </Box>
            </Box>

            <Box className="salesTransaction__footer">
              {/* <Typography>User: {fullName}</Typography>

              <Typography>Date: {currentTime}</Typography> */}
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
