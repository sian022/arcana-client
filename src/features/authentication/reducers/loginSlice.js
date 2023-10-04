import { createSlice } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";
import { saltkey } from "../../../app/saltkey";
const storedFullname = sessionStorage.getItem("fullname");

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    fullname: storedFullname || "",
    token: "",
  },
  reducers: {
    setFullname: (state, action) => {
      state.token = action.payload;
      sessionStorage.setItem("fullname", action.payload);
    },
    setToken: (state, action) => {
      state.token = action.payload;
      const ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(action.payload),
        saltkey
      ).toString();
      sessionStorage.setItem("token", ciphertext);
    },
  },
});
