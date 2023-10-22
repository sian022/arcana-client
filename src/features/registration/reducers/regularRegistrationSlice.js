import { createSlice } from "@reduxjs/toolkit";

export const regularRegistrationSlice = createSlice({
  name: "regularRegistration",
  initialState: {
    value: {
      termsAndConditions: {
        freezer: null,
        typeOfCustomer: null,
        directDelivery: null,
        bookingCoverage: null,
        terms: null,
        modeOfPayment: null,
        discount: null,
        termDays: 10,
        creditLimit: "",
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
