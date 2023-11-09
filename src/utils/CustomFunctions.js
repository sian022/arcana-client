import CryptoJS from "crypto-js";
import { saltkey } from "./saltkey";

export const transformKey = (key) => {
  const words = key.split(/(?=[A-Z])/);

  const transformedKey = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return transformedKey;
};

export const formatDate = (month, day, year, hours, minutes) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthWord = months[month];

  return `${monthWord} ${day}, ${year}`;
};

export const decryptString = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, saltkey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const base64ToBlob = (base64) => {
  const binaryString = atob(base64.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: "image/jpeg" });
};

export const convertToTitleCase = (str) => {
  return str.replace(/(\w)([A-Z])/g, "$1 $2").replace(/\w\S*/g, (txt) => {
    if (txt.toLowerCase() === "id") {
      return "ID";
    } else {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  });
};

export const titleCaseToCamelCase = (titleCaseString) => {
  return titleCaseString
    .toLowerCase()
    .replace(/\s+(.)/g, (_, match) => match.toUpperCase());
};

export const shallowEqual = (objA, objB) => {
  if (objA === objB) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    typeof objB !== "object" ||
    objA === null ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
};
