import { createSlice } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";
import { saltkey } from "../../../utils/saltkey";
import { decryptString } from "../../../utils/CustomFunctions";

const storedFullname = sessionStorage.getItem("fullname");
const storedUserDetails = decryptString(sessionStorage.getItem("userDetails"));

const initialState = {
  fullname: storedFullname || "",
  roleName: "",
  token: "",
  isPasswordChanged: false,
  userDetails: storedUserDetails || {},
  username: "",
};

export const loginSlice = createSlice({
  name: "login",
  // initialState: {
  //   fullname: storedFullname || "",
  //   token: "",
  // },
  initialState: initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
      const ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(action.payload),
        saltkey
      ).toString();
      sessionStorage.setItem("userDetails", ciphertext);
    },
    setFullname: (state, action) => {
      state.fullname = action.payload;
      // sessionStorage.setItem("fullname", action.payload);
      sessionStorage.setItem("fullname", action.payload);
    },
    setToken: (state, action) => {
      state.token = action.payload;
      const ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(action.payload),
        saltkey
      ).toString();
      // sessionStorage.setItem("token", ciphertext);
      sessionStorage.setItem("token", ciphertext);
    },
    setIsPasswordChanged: (state) => {
      state.isPasswordChanged = true;
    },
    setRoleName: (state, action) => {
      state.roleName = action.payload;
    },
    setTokenTemp: (state, action) => {
      state.token = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setUserDetailsTemp: (state, action) => {
      state.userDetails = action.payload;
    },
  },
});

export const {
  setFullname,
  setToken,
  setUserDetails,
  setRoleName,
  setTokenTemp,
  setUsername,
  setUserDetailsTemp,
} = loginSlice.actions;
