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
      isAgree: false,
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
      };
    },
    setIsAgree: (state, action) => {
      state.value.isAgree = action.payload;
    },
    setIsListingFeeValid: (state, action) => {
      state.value.listingFeeForRegistration.isValid = action.payload;
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
  setIsAgree,
  setIsListingFeeValid,
} = regularRegistrationSlice.actions;

export default regularRegistrationSlice.reducer;
