import { createSlice } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";
import { saltkey } from "../../../utils/saltkey";

const storedFullname = sessionStorage.getItem("fullname");

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    fullname: storedFullname || "",
    token: "",
  },
  reducers: {
    setFullname: (state, action) => {
      state.fullname = action.payload;
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

export const { setFullname, setToken } = loginSlice.actions;
