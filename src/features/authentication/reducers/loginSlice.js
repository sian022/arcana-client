import { createSlice } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";
import { saltkey } from "../../../utils/saltkey";

const storedFullname = sessionStorage.getItem("fullname");

const initialState = {
  fullname: storedFullname || "",
  token: "",
};

export const loginSlice = createSlice({
  name: "login",
  // initialState: {
  //   fullname: storedFullname || "",
  //   token: "",
  // },
  initialState: initialState,
  reducers: {
    setFullname: (state, action) => {
      state.fullname = action.payload;
      // localStorage.setItem("fullname", action.payload);
      sessionStorage.setItem("fullname", action.payload);
    },
    setToken: (state, action) => {
      console.log(action.payload);
      state.token = action.payload;
      const ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(action.payload),
        saltkey
      ).toString();
      // localStorage.setItem("token", ciphertext);
      sessionStorage.setItem("token", ciphertext);
    },
  },
});

export const { setFullname, setToken } = loginSlice.actions;
