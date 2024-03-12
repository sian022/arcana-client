import { createSlice } from "@reduxjs/toolkit";

export const regularRegistrationSlice = createSlice({
  name: "regularRegistration",
  initialState: {
    value: {
      termsAndConditions: {
        freezer: null,
        freezerAssetTag: "",
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
      },
      listingFeeForRegistration: {
        listingItems: [],
        isValid: false,
      },
      expensesForRegistration: {
        expenses: [],
        isValid: false,
      },
      isAgree: false,
      toggleFees: false,
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
        freezerAssetTag: "",
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
      };
    },
    setFreebies: (state, action) => {
      state.value.directFreebie.freebies = action.payload;
    },
    resetFreebies: (state) => {
      state.value.directFreebie.freebies = [];
    },
    setListingFeeForRegistration: (state, action) => {
      state.value.listingFeeForRegistration.listingItems = action.payload;
    },
    resetListingFeeForRegistration: (state) => {
      state.value.listingFeeForRegistration = {
        listingItems: [],
        isValid: false,
        total: null,
      };
    },
    setExpensesForRegistration: (state, action) => {
      state.value.expensesForRegistration.expenses = action.payload;
    },
    resetExpensesForRegistration: (state) => {
      state.value.expensesForRegistration = {
        expenses: [],
        isValid: false,
        total: null,
      };
    },
    setIsAgree: (state, action) => {
      state.value.isAgree = action.payload;
    },
    setIsListingFeeValid: (state, action) => {
      state.value.listingFeeForRegistration.isValid = action.payload;
    },
    setIsExpensesValid: (state, action) => {
      state.value.expensesForRegistration.isValid = action.payload;
    },
    toggleFeesToStore: (state) => {
      state.value.toggleFees = !state.value.toggleFees;
    },
  },
});

export const {
  setTermsAndConditions,
  resetTermsAndConditions,
  setFreebies,
  resetFreebies,
  setWholeTermsAndConditions,
  setListingFeeForRegistration,
  resetListingFeeForRegistration,
  setExpensesForRegistration,
  resetExpensesForRegistration,
  setIsAgree,
  setIsListingFeeValid,
  setIsExpensesValid,
  toggleFeesToStore,
} = regularRegistrationSlice.actions;

export default regularRegistrationSlice.reducer;
