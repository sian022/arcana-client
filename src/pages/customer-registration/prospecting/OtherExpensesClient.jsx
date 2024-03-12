import { yupResolver } from "@hookform/resolvers/yup";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { expensesForRegistrationSchema } from "../../../schema/schema";
import { useDispatch, useSelector } from "react-redux";
import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import { useGetAllOtherExpensesQuery } from "../../../features/setup/api/otherExpensesApi";
import SecondaryButton from "../../../components/SecondaryButton";
import { NumericFormat } from "react-number-format";
import { RemoveCircleOutline } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import {
  setExpensesForRegistration,
  setIsExpensesValid,
} from "../../../features/registration/reducers/regularRegistrationSlice";

function OtherExpensesClient() {
  const [totalAmount, setTotalAmount] = useState(0);

  //Hooks
  const dispatch = useDispatch();
  const expensesForRegistration = useSelector(
    (state) => state.regularRegistration.value.expensesForRegistration.expenses
  );

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
  } = useForm({
    resolver: yupResolver(expensesForRegistrationSchema.schema),
    mode: "onChange",
    defaultValues: {
      expenses: expensesForRegistration || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  //RTK Query
  const { data: expensesData, isLoading: isExpensesLoading } =
    useGetAllOtherExpensesQuery({ Status: true, page: 1, pageSize: 1000 });

  //Functions
  const handleRecalculateTotalAmount = useCallback(() => {
    let total = 0;
    watch("expenses")?.forEach((item) => {
      const amount = parseInt(item.amount);
      if (!isNaN(amount)) {
        total += amount;
      }
    });

    setTotalAmount(total);
  }, [watch]);

  //UseEffect
  useEffect(() => {
    dispatch(setIsExpensesValid(isValid));
  }, [isValid, dispatch]);

  useEffect(() => {
    handleRecalculateTotalAmount();

    return () => {
      const onSubmit = (data) => {
        dispatch(setExpensesForRegistration(data.expenses));
      };

      handleSubmit(onSubmit)();
    };
  }, [dispatch, handleSubmit, watch, handleRecalculateTotalAmount]);

  return (
    <Box className="feesClient__otherExpensesClient">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
          Other Expenses
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pt: "2px",
          maxHeight: "60%",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {fields.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <ControlledAutocomplete
              name={`expenses[${index}].otherExpenseId`}
              control={control}
              options={expensesData?.otherExpenses || []}
              getOptionLabel={(option) =>
                option.expenseType?.toUpperCase() || ""
              }
              getOptionDisabled={(option) => {
                const otherExpenses = watch("expenses");

                const isExpenseRepeating = Array.isArray(otherExpenses)
                  ? otherExpenses.some(
                      (expense) =>
                        expense?.otherExpenseId?.expenseType ===
                        option.expenseType
                    )
                  : false;

                return isExpenseRepeating;
              }}
              disableClearable
              loading={isExpensesLoading}
              isOptionEqualToValue={() => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Expense Type"
                  // required
                  helperText={errors?.otherExpenseId?.message}
                  error={errors?.otherExpenseId}
                  sx={{ width: "730px" }}
                />
              )}
            />

            <Controller
              control={control}
              name={`expenses[${index}].amount`}
              render={({ field: { onChange, onBlur, value } }) => (
                <NumericFormat
                  label="Amount"
                  type="text"
                  size="small"
                  customInput={TextField}
                  autoComplete="off"
                  onValueChange={(e) => {
                    onChange(Number(e.value));
                    handleRecalculateTotalAmount();
                  }}
                  onBlur={onBlur}
                  value={value || ""}
                  thousandSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  prefix="₱"
                />
              )}
            />

            <IconButton
              sx={{ color: "error.main" }}
              onClick={() => {
                remove(index);
                handleRecalculateTotalAmount();
              }}
              tabIndex={-1}
            >
              <RemoveCircleOutline sx={{ fontSize: "30px" }} />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          mt: "20px",
        }}
      >
        <SecondaryButton
          sx={{ width: "150px" }}
          onClick={() => {
            append({
              otherExpenseId: null,
              amount: null,
            });
          }}
          disabled={!isValid}
        >
          Add Expense
        </SecondaryButton>

        <Box
          sx={{
            display: "flex",
            mr: "50px",
            position: "absolute",
            left: "600px",
            // gap: "23px",
            gap: "16px",
          }}
        >
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Total Amount
          </Typography>

          <Typography sx={{ fontSize: "1rem" }}>
            ₱{totalAmount?.toLocaleString() || 0}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default OtherExpensesClient;
