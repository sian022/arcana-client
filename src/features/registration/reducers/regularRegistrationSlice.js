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
      attachments: {
        requirementsMode: null,
        ownersRequirements: {
          signature: null,
          storePhoto: null,
          businessPermit: null,
          photoIdOwner: null,
        },
        representativesRequirements: {
          signature: null,
          storePhoto: null,
          businessPermit: null,
          photoIdOwner: null,
          photoIdRepresentative: null,
          authorizationLetter: null,
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

export const { setTermsAndConditions } = regularRegistrationSlice.actions;

export default regularRegistrationSlice.reducer;
