import * as yup from "yup";

export const loginSchema = yup
  .object({
    username: yup.string().required("Account code is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

//Setup Schema
export const productSchema = {
  schema: yup.object({
    itemCode: yup.string().required("Item code is required"),
    itemDescription: yup.string().required("Item description is required"),
    uomId: yup.object().required("UOM is required"),
    productSubCategoryId: yup.object().required("Subcategory is required"),
    meatTypeId: yup.object().required("Meat type is required"),
  }),
  defaultValues: {
    itemCode: "",
    itemDescription: "",
    uomId: null,
    productSubCategoryId: null,
    meatTypeId: null,
  },
};

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

export const discountTypeSchema = {
  schema: yup.object({
    lowerBound: yup.number().required("Lower boundary is required"),
    upperBound: yup.number().required("Upper boundary is required"),
    commissionRateLower: yup
      .number()
      .required("Lower commission rate is required"),
    commissionRateUpper: yup
      .number()
      .required("Upper commission rate is required"),
  }),
  defaultValues: {
    lowerBound: null,
    upperBound: null,
    commissionRateLower: null,
    commissionRateUpper: null,
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
  schema: yup
    .object({
      fullname: yup.string().required("Fullname is required"),
      username: yup.string().required("Username is required"),
      password: yup.string().required("Password is required"),
      locationId: yup.object().required("Location is required"),
      departmentId: yup.object().required("Department is required"),
      userRoleId: yup.object().required("Role is required"),
      companyId: yup.object().required("Company is required"),
    })
    .required(),
  defaultValues: {
    fullname: "",
    username: "",
    password: "",
    locationId: null,
    departmentId: null,
    userRoleId: null,
    companyId: null,
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
    houseNumber: yup.string().required("House number is required"),
    streetName: yup.string().required("Street name is required"),
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

//Registration Schema
export const regularRegisterSchema = {
  schema: yup.object({
    clientId: yup.number().required("Client ID is required").integer(),
    houseNumber: yup.string().required("House number is required"),
    streetName: yup.string().required("Street name is required"),
    barangayName: yup.string().required("Barangay name is required"),
    city: yup.string().required("City/Municipality is required"),
    province: yup.string().required("Province is required"),
    tinNumber: yup.string().required("TIN number is required"),
    authorizedRepresentative: yup
      .string()
      .required("Representative name is required"),
    authorizedRepresentativePosition: yup
      .string()
      .required("Representative position is required"),
    cluster: yup.number().required("Cluster is required").integer(),
    longitude: yup.string(),
    // .required("Longitude is required")
    latitude: yup.string(),
    // .required("Latitude is required")
    birthDate: yup.date().required("Birthdate is required"),
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
  },
};
