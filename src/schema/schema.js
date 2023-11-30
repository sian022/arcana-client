import moment from "moment";
import * as yup from "yup";

export const loginSchema = yup
  .object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

export const changePasswordSchema = {
  schema: yup.object({
    oldPassword: yup.string().required("Old password is required"),
    newPassword: yup.string().required("New password is required"),
    confirmNewPassword: yup
      .string()
      .required("Confirm new password is required"),
  }),
  defaultValues: {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  },
};

//Setup Schema
export const productSchema = {
  schema: yup.object({
    itemCode: yup.string().required("Item code is required"),
    itemDescription: yup.string().required("Item description is required"),
    uomId: yup.object().required("UOM is required"),
    productSubCategoryId: yup.object().required("Subcategory is required"),
    meatTypeId: yup.object().required("Meat type is required"),
    price: yup.number().required("Price is required"),
    // effectivityDate: yup.date().required("Effectivity date is required"),
  }),
  defaultValues: {
    itemCode: "",
    itemDescription: "",
    uomId: null,
    productSubCategoryId: null,
    meatTypeId: null,
    price: null,
    // effectivityDate: null,
  },
};

export const productEditSchema = {
  schema: yup.object({
    itemCode: yup.string().required("Item code is required"),
    itemDescription: yup.string().required("Item description is required"),
    uomId: yup.object().required("UOM is required"),
    productSubCategoryId: yup.object().required("Subcategory is required"),
    meatTypeId: yup.object().required("Meat type is required"),
    // price: yup.number().required("Price is required"),
    // effectivityDate: yup.date().required("Effectivity date is required"),
    // priceChange: yup.number().required("Price change is required"),
  }),
  defaultValues: {
    itemCode: "",
    itemDescription: "",
    uomId: null,
    productSubCategoryId: null,
    meatTypeId: null,
    // price: null,
    // effectivityDate: null,
    // priceChange: null,
  },
};
// export const productChangePriceSchema = {
//   schema: yup.object({
//     itemCode: yup.string().required("Item code is required"),
//     itemDescription: yup.string().required("Item description is required"),
//     uomId: yup.object().required("UOM is required"),
//     productSubCategoryId: yup.object().required("Subcategory is required"),
//     meatTypeId: yup.object().required("Meat type is required"),
//     price: yup.number().required("Price is required"),
//     effectivityDate: yup.date().required("Effectivity date is required"),
//   }),
//   defaultValues: {
//     itemCode: "",
//     itemDescription: "",
//     uomId: null,
//     productSubCategoryId: null,
//     meatTypeId: null,
//     price: null,
//     effectivityDate: null,
//   },
// };

export const productCategorySchema = {
  schema: yup.object({
    productCategoryName: yup.string().required("Category name is required"),
  }),
  defaultValues: {
    productCategoryName: "",
  },
};

export const productSubCategorySchema = {
  schema: yup.object({
    productSubCategoryName: yup
      .string()
      .required("Subcategory name is required"),
    productCategoryId: yup.object().required("Category is required"),
  }),
  defaultValues: {
    productSubCategoryName: "",
    productCategoryId: null,
  },
};

export const meatTypeSchema = {
  schema: yup.object({
    meatTypeName: yup.string().required("Meat type name is required"),
  }),
  defaultValues: {
    meatTypeName: "",
  },
};

export const uomSchema = {
  schema: yup.object({
    uomCode: yup.string().required("UOM code is required"),
    uomDescription: yup.string().required("UOM description is required"),
  }),
  defaultValues: {
    uomCode: "",
    uomDescription: "",
  },
};

export const storeTypeSchema = {
  schema: yup.object({
    storeTypeName: yup.string().required("Store type name is required"),
  }),
  defaultValues: {
    storeTypeName: "",
  },
};

export const variableDiscountSchema = {
  schema: yup.object({
    minimumAmount: yup.number().required("Minimum amount is required"),
    maximumAmount: yup.number().required("Maximum amount is required"),
    minimumPercentage: yup.number().required("Minimum percentage is required"),
    maximumPercentage: yup.number().required("Maximum percentage is required"),
  }),
  defaultValues: {
    minimumAmount: null,
    maximumAmount: null,
    minimumPercentage: null,
    maximumPercentage: null,
  },
};

export const termDaysSchema = {
  schema: yup.object({
    days: yup.number().required("Days is required"),
  }),
  defaultValues: {
    days: null,
  },
};

//User Management Schemas
export const userAccountSchema = {
  schema: yup.object({
    fullIdNo: yup.string().required("Full ID number is required"),
    fullname: yup.string().required("Fullname is required"),
    username: yup.string().required("Username is required"),
    password: yup.string(),
    userRoleId: yup.object().required("Role is required"),
  }),
  // .required(),
  defaultValues: {
    fullIdNo: "",
    fullname: "",
    username: "",
    password: "",
    userRoleId: null,
  },
};

export const userRoleSchema = {
  schema: yup.object({
    roleName: yup.string().required("Role name is required"),
  }),
  defaultValues: {
    roleName: "",
  },
};

export const companySchema = {
  schema: yup.object({
    companyName: yup.string().required("Company name is required"),
  }),
  defaultValues: {
    companyName: "",
  },
};

export const departmentSchema = {
  schema: yup.object({
    departmentName: yup.string().required("Department name is required"),
  }),
  defaultValues: {
    departmentName: "",
  },
};

export const locationSchema = {
  schema: yup.object({
    locationName: yup.string().required("Location name is required"),
  }),
  defaultValues: {
    locationName: "",
  },
};

//Prospect Schemas
export const prospectSchema = {
  schema: yup.object({
    ownersName: yup.string().required("Owner's name is required"),

    emailAddress: yup.string().required("Email address is required"),
    houseNumber: yup.string(),
    // .required("House number is required")
    streetName: yup.string(),
    // .required("Street name is required")
    barangayName: yup.string().required("Barangay name is required"),
    city: yup.string().required("City/Municipality is required"),
    province: yup.string().required("Province is required"),
    phoneNumber: yup.string().required("Phone number is required"),
    businessName: yup.string().required("Business name is required"),
    storeTypeId: yup.object().required("Store type is required"),
  }),
  defaultValues: {
    ownersName: "",
    emailAddress: "",
    houseNumber: "",
    streetName: "",
    barangayName: "",
    city: "",
    province: "",
    phoneNumber: "",
    businessName: "",
    storeTypeId: null,
  },
};

export const requestFreebiesSchema = {
  schema: yup.object({
    clientId: yup.number().required("Client ID is required").integer(),
    freebies: yup.array().of(
      yup.object({
        itemId: yup.object().required("Product Code Required"),
        quantity: yup.number().required("Quantity is required"),
      })
    ),
  }),
  defaultValues: {
    clientId: null,
    freebies: [
      {
        itemId: null,
        quantity: 1,
      },
    ],
  },
};

export const requestFreebiesDirectSchema = {
  schema: yup.object({
    freebies: yup.array().of(
      yup.object({
        itemId: yup.object().required("Product Code Required"),
        quantity: yup.number().required("Quantity is required"),
        uom: yup.string(),
        itemDescription: yup.string(),
      })
    ),
  }),
  defaultValues: {
    freebies: [
      {
        itemId: null,
        quantity: 1,
        uom: "",
        itemDescription: "",
      },
    ],
  },
};

//Registration Schema
export const regularRegisterSchema = {
  schema: yup.object({
    clientId: yup.number().required("Client ID is required").integer(),
    houseNumber: yup.string(),
    // .required("House number is required")
    streetName: yup.string(),
    // .required("Street name is required")
    barangayName: yup.string().required("Barangay name is required"),
    city: yup.string().required("City/Municipality is required"),
    province: yup.string().required("Province is required"),
    tinNumber: yup.string().required("TIN number is required"),
    authorizedRepresentative: yup.string(),
    // .required("Representative name is required")
    authorizedRepresentativePosition: yup.string(),
    // .required("Representative position is required")
    cluster: yup.number().required("Cluster is required").integer(),
    longitude: yup.string(),
    // .required("Longitude is required")
    latitude: yup.string(),
    // .required("Latitude is required")
    birthDate: yup.date().required("Birthdate is required"),
    storeTypeId: yup.object().required("Business type is required"),
  }),
  defaultValues: {
    clientId: null,
    houseNumber: "",
    streetName: "",
    barangayName: "",
    city: "",
    province: "",
    tinNumber: "",
    authorizedRepresentative: "",
    authorizedRepresentativePosition: "",
    cluster: null,
    longitude: "155.1",
    latitude: "122.2",
    birthDate: null,
    storeTypeId: null,
  },
};

export const directRegisterPersonalSchema = {
  schema: yup.object({
    ownersName: yup.string().required("Owner's name is required"),
    ownersAddress: yup
      .object({
        houseNumber: yup.string(),
        // .required("House number is required")
        streetName: yup.string(),
        // .required("Street name is required")
        barangayName: yup.string().required("Barangay name is required"),
        city: yup.string().required("City/Municipality is required"),
        province: yup.string().required("Province is required"),
      })
      .required(),
    phoneNumber: yup.string().required("Phone number is required"),
    dateOfBirth: yup.date().required("Birthdate is required"),
    tinNumber: yup.string().required("TIN number is required"),
    businessName: yup.string().required("Business name is required"),
    storeTypeId: yup.object().required("Business type is required"),
    emailAddress: yup.string().required("Email address is required"),
    cluster: yup.number().required("Cluster is required").integer(),
    businessAddress: yup
      .object({
        houseNumber: yup.string(),
        // .required("House number is required")
        streetName: yup.string(),
        // .required("Street name is required")
        barangayName: yup.string().required("Barangay name is required"),
        city: yup.string().required("City/Municipality is required"),
        province: yup.string().required("Province is required"),
      })
      .required(),
    authorizedRepresentative: yup.string(),
    // .required("Representative name is required")
    authorizedRepresentativePosition: yup.string(),
    // .required("Representative position is required")
  }),
  defaultValues: {
    ownersName: "",
    ownersAddress: {
      houseNumber: "",
      streetName: "",
      barangayName: "",
      city: "",
      province: "",
    },
    phoneNumber: "",
    dateOfBirth: null,
    // dateOfBirth: moment(Date.now()),
    tinNumber: "",
    businessName: "",
    storeTypeId: null,
    emailAddress: "",
    cluster: null,
    businessAddress: {
      houseNumber: "",
      streetName: "",
      barangayName: "",
      city: "",
      province: "",
    },
    authorizedRepresentative: "",
    authorizedRepresentativePosition: "",
  },
};

export const requestListingFeeSchema = {
  schema: yup.object({
    clientId: yup.object().required("Business Name is required"),
    listingItems: yup.array().of(
      yup.object({
        itemId: yup.object().required("Product Code is required"),
        sku: yup.number().required("SKU is required"),
        unitCost: yup.string().required("Unit Cost is required"),
        // quantity: yup.number().required("Quantity is required"),
      })
    ),
  }),
  defaultValues: {
    clientId: null,
    listingItems: [
      {
        itemId: null,
        sku: 1,
        unitCost: null,
        // quantity: null,
      },
    ],
  },
};

export const approversSchema = {
  schema: yup.object({
    moduleName: yup.object().required("Module is required"),
    approvers: yup.array().of(
      yup.object({
        userId: yup.object().required("User is required"),
        // moduleName: yup.string(),
        level: yup.number().required("Level is required"),
      })
    ),
  }),
  defaultValues: {
    moduleName: "",
    approvers: [
      {
        userId: null,
        moduleName: "",
        level: 1,
      },
    ],
  },
};

export const priceChangeSchema = {
  schema: yup.object({
    itemId: yup.number().required("Product is required"),
    price: yup.number().required("Price is required"),
    effectivityDate: yup.date(),
    // .required("Effectivity date is required"),
  }),
  defaultValues: {
    itemId: null,
    price: null,
    effectivityDate: null,
  },
};
