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
    ownersAddress: yup.string().required("Owner's address is required"),
    phoneNumber: yup.string().required("Phone number is required"),
    businessName: yup.string().required("Business name is required"),
    storeTypeId: yup.object().required("Store type is required"),
  }),
  defaultValues: {
    ownersName: "",
    ownersAddress: "",
    phoneNumber: "",
    businessName: "",
    storeTypeId: null,
  },
};
