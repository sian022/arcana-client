import CryptoJS from "crypto-js";
import { saltkey } from "./saltkey";

export const transformKey = (key) => {
  const words = key.split(/(?=[A-Z])/);

  const transformedKey = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return transformedKey;
};

export const formatDate = (month, day, year) => {
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
  if (!data) return null;

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

export const convertUppercaseToTitleCase = (str) => {
  return (
    str
      .toLowerCase()
      .replace(/\b(\w)/g, (s) => s.toUpperCase())
      .trim() || ""
  );
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

export const shallowEqualArray = (arrA, arrB) => {
  if (arrA === arrB) {
    return true;
  }

  if (
    !Array.isArray(arrA) ||
    !Array.isArray(arrB) ||
    arrA === null ||
    arrB === null
  ) {
    return false;
  }

  const lengthA = arrA.length;
  const lengthB = arrB.length;

  if (lengthA !== lengthB) {
    return false;
  }

  for (let i = 0; i < lengthA; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }

  return true;
};

export const formatOrdinalPrefix = (number) => {
  const lastDigit = number % 10;
  const twoDigits = number % 100;

  if (twoDigits >= 11 && twoDigits <= 13) {
    return `${number}th`;
  }

  switch (lastDigit) {
    case 1:
      return `${number}st`;
    case 2:
      return `${number}nd`;
    case 3:
      return `${number}rd`;
    default:
      return `${number}th`;
  }
};

export const handlePhoneNumberInput = (e) => {
  const maxLength = 10;
  const inputValue = e.target.value.toString().slice(0, maxLength);
  e.target.value = inputValue;
};

export const dashFormat = (inputValue) => {
  // Use regex to add a dash after every three digits from the left
  const formattedValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, "-");
  return formattedValue;
};

export const formatPhoneNumber = (inputNumber) => {
  let numberString = inputNumber.toString();

  if (numberString.length >= 10) {
    let formattedNumber =
      numberString.slice(0, 3) +
      "-" +
      numberString.slice(3, 6) +
      "-" +
      numberString.slice(6);

    return formattedNumber;
  } else {
    return inputNumber;
  }
};

//Error Handling
export const handleCatchErrorMessage = (error) => {
  if (error?.data?.error?.message) {
    return error?.data?.error?.message;
  } else if (error?.status === 400) {
    return "Something went wrong with your request.";
  } else if (error?.status === 401) {
    return "Authentication required.";
  } else if (error?.status === 403) {
    return "You don't have permission for this.";
  } else if (error?.status === 404) {
    return "The requested resource couldn't be found.";
  } else if (error?.status === 500) {
    return "Something unexpected happened on our end.";
  } else {
    return "An unexpected error occurred";
  }
};

export const handleCatchErrorMessageTest = (error) => {
  if (error?.status === 400) {
    return "Something went wrong with your request.";
  } else if (error?.status === 401) {
    return "Authentication required.";
  } else if (error?.status === 403) {
    return "You don't have permission for this.";
  } else if (error?.status === 404) {
    return "The requested resource couldn't be found.";
  } else if (error?.status === 500) {
    return "Something unexpected happened on our end.";
  } else {
    return "An unexpected error occurred";
  }
};

export const transformName = (fullName) => {
  const parts = fullName.split(", ");
  const lastName = parts[0];
  const firstName = parts[1];

  // Extract initials from the first name
  const initials = firstName
    ?.split(" ")
    .map((name) => (name[0] ? name[0] + "." : ""))
    .join(" ");

  // Construct the transformed name
  const transformedName = `${lastName}${initials ? ", " + initials : ""}`;

  return transformedName;
};

export const formatLargeNumber = (number) => {
  if (number >= 1e9) {
    return (number / 1e9).toFixed(1) + "B";
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1) + "M";
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + "K";
  } else {
    return number.toString();
  }
};

export const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

export const formatPesoAmount = (amount) => {
  return (
    amount?.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    }) || ""
  );
};
