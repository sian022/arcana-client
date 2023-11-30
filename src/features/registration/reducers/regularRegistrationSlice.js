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
        modeOfPayments: [],
        variableDiscount: null,
        termDaysId: null,
        creditLimit: null,
        fixedDiscount: {
          discountPercentage: null,
        },
      },
      directFreebie: {
        freebies: [],
        // freebies: [
        //   {
        //     itemId: null,
        //     quantity: 1,
        //   },
        // ],
      },
    },
  },
  reducers: {
    setTermsAndConditions: (state, action) => {
      const { property, value } = action.payload;
      state.value.termsAndConditions[property] = value;
    },
    setWholeTermsAndConditions: (state, action) => {
      state.value.termsAndConditions = action.payload;
    },
    resetTermsAndConditions: (state) => {
      state.value.termsAndConditions = {
        freezer: null,
        typeOfCustomer: null,
        directDelivery: null,
        bookingCoverageId: null,
        terms: null,
        modeOfPayment: [],
        variableDiscount: null,
        termDaysId: null,
        creditLimit: null,
        fixedDiscount: {
          discountPercentage: null,
        },
      };
    },
    setFreebies: (state, action) => {
      state.value.directFreebie.freebies = action.payload;
    },
    resetFreebies: (state) => {
      state.value.directFreebie.freebies = [];
    },
  },
});

export const {
  setTermsAndConditions,
  resetTermsAndConditions,
  setFreebies,
  resetFreebies,
  setWholeTermsAndConditions,
} = regularRegistrationSlice.actions;

export default regularRegistrationSlice.reducer;
