import * as yup from "yup";

//Login
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

export const initialChangePasswordSchema = {
  schema: yup.object({
    oldPassword: yup.string(),
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

//User Management Schemas
export const userAccountSchema = {
  schema: yup.object({
    fullIdNo: yup.string().required("Full ID number is required"),
    fullname: yup.string().required("Fullname is required"),
    username: yup.string().required("Username is required"),
    password: yup.string(),
    mobileNumber: yup.string().required("Mobile number is required"),
    userRoleId: yup.object().required("Role is required"),
    // clusterId: yup.object().nullable(),
    clusterId: yup.object().when("userRoleId", {
      is: (userRoleId) => userRoleId && userRoleId.roleName === "CDO",
      then: (schema) => schema.required("Cluster is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    // clusters: yup.array().of(yup.object()),
  }),
  // .required(),
  defaultValues: {
    fullIdNo: "",
    fullname: "",
    username: "",
    password: "",
    mobileNumber: "",
    userRoleId: null,
    clusterId: null,
    // clusters: [],
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

//Product Setup Schema
export const productSchema = {
  schema: yup.object({
    itemCode: yup.string().required("Item code is required"),
    itemDescription: yup.string().required("Item description is required"),
    uomId: yup.object().required("UOM is required"),
    productSubCategoryId: yup.object().required("Subcategory is required"),
    meatTypeId: yup.object().required("Meat type is required"),
    itemImageLink: yup.mixed().nullable(),
  }),
  defaultValues: {
    itemCode: "",
    itemDescription: "",
    uomId: null,
    productSubCategoryId: null,
    meatTypeId: null,
    itemImageLink: null,
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

export const priceModeSetupSchema = {
  schema: yup.object({
    priceMode: yup.string().required("Price mode code is required"),
    priceModeDescription: yup
      .string()
      .required("Price mode description is required"),
  }),
  defaultValues: {
    priceMode: "",
    priceModeDescription: "",
  },
};

export const priceModeItemSchema = {
  schema: yup.object({
    itemId: yup.object().required("Product Code is required"),
    priceModeId: yup.object().required("Price mode is required"),
    price: yup.number().required("Price is required"),
  }),
  defaultValues: {
    itemId: null,
    priceModeId: null,
    price: null,
  },
};

export const priceModeTaggingSchema = {
  schema: yup.object({
    priceModeItems: yup.array().of(
      yup.object({
        priceModeId: yup.number().required("Price mode is required"),
        itemId: yup.object().required("Product Code is required"),
        price: yup.number().required("Price is required"),
      })
    ),
  }),
  defaultValues: {
    priceModeItems: [],
  },
};

export const priceChangeSchema = {
  schema: yup.object({
    // priceModeItemId: yup.object().required("Product Code is required"),
    price: yup.number().required("Price is required"),
    effectivityDate: yup.date().required("Effectivity date is required"),
  }),
  defaultValues: {
    // priceModeItemid: null,
    price: null,
    effectivityDate: null,
  },
};

export const priceModePriceChangeSchema = {
  schema: yup.object({
    priceModeItemPriceChanges: yup.array().of(
      yup.object({
        priceModeItemId: yup.object().required("Product Code is required"),
        price: yup.number().required("Price is required"),
        effectivityDate: yup.date().required("Effectivity date is required"),
      })
    ),
  }),
  defaultValues: {
    priceModeItemPriceChanges: [
      {
        priceModeItemId: null,
        price: null,
        effectivityDate: null,
      },
    ],
  },
};

//Customer Management Setup
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

export const onlinePaymentPlatformsSchema = {
  schema: yup.object({
    name: yup.string().required("Online Payment Platform is required"),
  }),
  defaultValues: {
    name: "",
  },
};

//Prospect Schemas
export const prospectSchema = {
  schema: yup.object({
    ownersName: yup.string().required("Owner's name is required"),

    emailAddress: yup.string(),
    // emailAddress: yup.string().required("Email address is required"),
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

export const prospectWithLocationsSchema = {
  schema: yup.object({
    ownersName: yup.string().required("Owner's name is required"),

    emailAddress: yup.string().required("Email address is required"),
    houseNumber: yup.string(),
    // .required("House number is required")
    streetName: yup.string(),
    // .required("Street name is required")
    barangayName: yup.object().required("Barangay name is required"),
    city: yup.object().required("City/Municipality is required"),
    province: yup.object().required("Province is required"),
    phoneNumber: yup.string().required("Phone number is required"),
    businessName: yup.string().required("Business name is required"),
    storeTypeId: yup.object().required("Store type is required"),
  }),
  defaultValues: {
    ownersName: "",
    emailAddress: "",
    houseNumber: "",
    streetName: "",
    barangayName: null,
    city: null,
    province: null,
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
    tinNumber: yup.string(),
    // tinNumber: yup.string().required("TIN number is required"),
    authorizedRepresentative: yup.string(),
    // .required("Representative name is required")
    authorizedRepresentativePosition: yup.string(),
    // .required("Representative position is required")
    // cluster: yup.number().required("Cluster is required").integer(),
    clusterId: yup.object().required("Cluster is required"),
    priceModeId: yup.object().required("Price mode is required"),
    longitude: yup.string(),
    // .required("Longitude is required")
    latitude: yup.string(),
    // .required("Latitude is required")
    birthDate: yup.date().required("Birthdate is required"),
    emailAddress: yup.string(),
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
    // cluster: null,
    clusterId: null,
    priceModeId: null,
    longitude: "",
    latitude: "",
    birthDate: null,
    emailAddress: "",
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
    tinNumber: yup.string(),
    // tinNumber: yup.string().required("TIN number is required"),
    businessName: yup.string().required("Business name is required"),
    storeTypeId: yup.object().required("Business type is required"),
    emailAddress: yup.string(),
    // emailAddress: yup.string().required("Email address is required"),
    clusterId: yup.object().required("Cluster is required"),
    priceModeId: yup.object().required("Price mode is required"),
    // cluster: yup.number().required("Cluster is required").integer(),
    latitude: yup.string().nullable(),
    longitude: yup.string().nullable(),
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
    clusterId: null,
    priceModeId: null,
    // cluster: null,
    latitude: "",
    longitude: "",
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
      },
    ],
  },
};

export const listingFeeForRegistrationSchema = {
  schema: yup.object({
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
    listingItems: [],
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

export const clusterSchema = {
  schema: yup.object({
    cluster: yup.string().required("Cluster is required"),
  }),
  defaultValues: {
    cluster: "",
  },
};

export const clusterTagSchema = {
  schema: yup.object({
    clusterId: yup.number().required("Cluster is required"),
    userId: yup.object().required("CDO is required"),
  }),
  defaultValues: {
    clusterId: null,
    userId: null,
  },
};

export const otherExpensesSchema = {
  schema: yup.object({
    expenseType: yup.string().required("Expense type is required"),
  }),
  defaultValues: {
    expenseType: "",
  },
};

//Sales Module
export const specialDiscountSchema = {
  schema: yup.object({
    clientId: yup.object().required("Client is required"),
    discount: yup.number().required("Special Discount is required"),
    isOnetime: yup.boolean(),
  }),
  defaultValues: {
    clientId: null,
    discount: null,
    isOnetime: false,
  },
};

export const requestExpensesSchema = {
  schema: yup.object({
    clientId: yup.object().required("Business Name is required"),
    expenses: yup.array().of(
      yup.object({
        otherExpenseId: yup.object().required("Expense Type is required"),
        amount: yup.string().required("Amount is required"),
        remarks: yup.string(),
      })
    ),
  }),
  defaultValues: {
    clientId: null,
    expenses: [
      {
        otherExpenseId: null,
        amount: null,
        remarks: "",
      },
    ],
  },
};

export const expensesForRegistrationSchema = {
  schema: yup.object({
    expenses: yup.array().of(
      yup.object({
        otherExpenseId: yup.object().required("Expense Type is required"),
        amount: yup.string().required("Amount is required"),
        remarks: yup.string(),
      })
    ),
  }),
  defaultValues: {
    expenses: [],
  },
};

export const advancePaymentSchema = {
  schema: yup.object({
    clientId: yup.object().required("Business Name is required"),
    paymentMethod: yup.object().required("Payment Type is required"),
    advancePaymentAmount: yup.number().required("Amount is required"),

    //Cheque Validations
    payee: yup.string().when("paymentMethod.label", {
      is: "Cheque",
      then: (schema) => schema.required("Payee is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    chequeDate: yup.date().when("paymentMethod.label", {
      is: "Cheque",
      then: (schema) => schema.required("Cheque date is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    bankName: yup.string().when("paymentMethod.label", {
      is: "Cheque",
      then: (schema) => schema.required("Bank name is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    chequeNo: yup.string().when("paymentMethod.label", {
      is: "Cheque",
      then: (schema) => schema.required("Cheque number is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    dateReceived: yup.date().when("paymentMethod.label", {
      is: "Cheque",
      then: (schema) => schema.required("Date received is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    // chequeAmount: yup.string().when("paymentMethod.label", {
    //   is: "Cheque",
    //   then: (schema) => schema.required("Cheque amount is required"),
    //   otherwise: (schema) => schema.nullable(),
    // }),

    //Online
    accountName: yup.string().when("paymentMethod.label", {
      is: "Online",
      then: (schema) => schema.required("Account name is required"),
      otherwise: (schema) => schema.nullable(),
    }),

    accountNo: yup.string().when("paymentMethod.label", {
      is: "Online",
      then: (schema) => schema.required("Account number is required"),
      otherwise: (schema) => schema.nullable(),
    }),

    referenceNo: yup.string().when("paymentMethod.label", {
      is: "Online",
      then: (schema) => schema.required("Reference number is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  }),
  defaultValues: {
    clientId: null,
    paymentMethod: null,
    advancePaymentAmount: null,
    payee: "",
    chequeDate: null,
    bankName: "",
    chequeNo: "",
    dateReceived: null,
    // chequeAmount: "",
    accountName: "",
    accountNo: "",
    referenceNo: "",
  },
};

export const paymentTransactionSchema = {
  schema: yup.object({
    transactionId: yup.array().of(yup.number()),
    payments: yup
      .array()
      .of(yup.object())
      .min(1, "At least one payment is required"),
  }),
  defaultValues: {
    transactionId: [],
    payments: [],
  },
};

export const paymentSchema = {
  schema: yup.object({
    paymentMethod: yup.object().required("Payment Type is required"),
    paymentAmount: yup.number().required("Amount is required"),

    //Cheque Validations
    payee: yup.string().when("paymentMethod.label", {
      is: "Cheque",
      then: (schema) => schema.required("Payee is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    chequeDate: yup.date().when("paymentMethod.label", {
      is: "Cheque",
      then: (schema) => schema.required("Cheque date is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    bankName: yup.string().when("paymentMethod.label", {
      is: "Cheque",
      then: (schema) => schema.required("Bank name is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    chequeNo: yup.string().when("paymentMethod.label", {
      is: "Cheque",
      then: (schema) => schema.required("Cheque number is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    dateReceived: yup.date().when("paymentMethod.label", {
      is: "Cheque",
      then: (schema) => schema.required("Date received is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    // chequeAmount: yup.string().when("paymentMethod.label", {
    //   is: "Cheque",
    //   then: (schema) => schema.required("Cheque paymentAmount is required"),
    //   otherwise: (schema) => schema.nullable(),
    // }),

    //Online
    accountName: yup.string().when("paymentMethod.label", {
      is: "Online",
      then: (schema) => schema.required("Account name is required"),
      otherwise: (schema) => schema.nullable(),
    }),

    accountNo: yup.string().when("paymentMethod.label", {
      is: "Online",
      then: (schema) => schema.required("Account number is required"),
      otherwise: (schema) => schema.nullable(),
    }),

    referenceNo: yup.string().when("paymentMethod.label", {
      is: "Online",
      then: (schema) => schema.required("Reference number is required"),
      otherwise: (schema) => schema.nullable(),
    }),

    //Offset
    remarks: yup.string().when("paymentMethod.label", {
      is: "Offset",
      then: (schema) => schema.required("Remarks is required"),
      otherwise: (schema) => schema.nullable(),
    }),

    //Withholding
    attachment: yup.mixed().when("paymentMethod.label", {
      is: "Withholding Tax",
      then: (schema) => schema.required("Attachment  is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  }),
  defaultValues: {
    paymentMethod: null,
    paymentAmount: null,
    payee: "",
    chequeDate: null,
    bankName: "",
    chequeNo: "",
    dateReceived: null,
    // chequeAmount: "",
    accountName: "",
    accountNo: "",
    referenceNo: "",
    remarks: "",
    attachment: null,
  },
};

export const salesTransactionSchema = {
  schema: yup.object({
    clientId: yup.object().required("Business Name is required"),
    items: yup
      .array()
      .of(yup.object())
      .min(1, "At least one product is required"),
  }),

  defaultValues: {
    clientId: null,
    items: [],
  },
};

export const cashoutSchema = {
  schema: yup.object({
    chargeInvoiceNo: yup.string().required("Charge Invoice No. is required"),
    invoiceType: yup.string().required("Invoice Type is required"),
    discount: yup.number().required("Discount is required").nullable(),
    specialDiscount: yup.number().nullable(),
  }),
  defaultValues: {
    chargeInvoiceNo: "",
    invoiceType: "",
    discount: null,
    specialDiscount: null,
  },
};
