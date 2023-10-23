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
        termDaysId: 1,
        creditLimit: null,
        fixedDiscounts: {
          discountPercentage: "",
        },
      },
    },
  },
  reducers: {
    setTermsAndConditions: (state, action) => {
      const { property, value } = action.payload;
      state.value.termsAndConditions[property] = value;
    },
  },
});

export const {
  setTermsAndConditions,
  setRequirementsMode,
  setOwnersRequirementsProperty,
  setRepresentativesRequirementsProperty,
} = regularRegistrationSlice.actions;

export default regularRegistrationSlice.reducer;
