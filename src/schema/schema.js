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
    uomId: yup.number().required("UOM is required"),
    productSubCategoryId: yup.number().required("Subcategory is required"),
    meatTypeId: yup.number().required("Meat type is required"),
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

//User Management Schemas
export const userAccountSchema = {
  schema: yup
    .object({
      fullname: yup.string().required("Fullname is required"),
      username: yup.string().required("Username is required"),
      password: yup.string().required("Password is required"),
      locationId: yup.string().required("Location is required"),
      departmentId: yup.string().required("Department is required"),
      userRoleId: yup.number().required("Role is required"),
      companyId: yup.number().required("Company is required"),
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
