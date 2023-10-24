import { createSlice } from "@reduxjs/toolkit";

export const regularRegistrationSlice = createSlice({
  name: "regularRegistration",
  initialState: {
    value: {
      termsAndConditions: {
        freezer: null,
        typeOfCustomer: null,
        directDelivery: null,
        bookingCoverageId: null,
        terms: null,
        modeOfPayment: null,
        variableDiscount: null,
        termDaysId: null,
        creditLimit: null,
        fixedDiscounts: {
          discountPercentage: null,
        },
      },
    },
  },
  reducers: {
    setTermsAndConditions: (state, action) => {
      const { property, value } = action.payload;
      state.value.termsAndConditions[property] = value;
    },
    resetTermsAndConditions: (state) => {
      state.value.termsAndConditions = {
        freezer: null,
        typeOfCustomer: null,
        directDelivery: null,
        bookingCoverageId: null,
        terms: null,
        modeOfPayment: null,
        variableDiscount: null,
        termDaysId: null,
        creditLimit: null,
        fixedDiscounts: {
          discountPercentage: null,
        },
      };
    },
  },
});

export const { setTermsAndConditions, resetTermsAndConditions } =
  regularRegistrationSlice.actions;

export default regularRegistrationSlice.reducer;
