export const navigationData = [
  {
    id: 1,
    path: "/",
    name: "Dashboard",
    icon: "Dashboard",
  },
  // {
  //   id: 2,
  //   path: "/",
  //   name: "Dashboard",
  //   icon: "Dashboard",
  // },
  {
    id: 3,
    path: "/user-management",
    name: "User Management",
    icon: "AccountCircle",
    sub: [
      {
        id: 1,
        name: "User Account",
        path: "/user-management/user-account",
        icon: "Person",
      },
      {
        id: 2,
        name: "User Role",
        path: "/user-management/user-role",
        icon: "SupervisorAccount",
      },
      {
        id: 3,
        name: "Approver",
        path: "/user-management/approver",
        icon: "HowToVote",
      },
      {
        id: 4,
        name: "Company",
        path: "/user-management/company",
        icon: "Business",
      },
      {
        id: 5,
        name: "Department",
        path: "/user-management/department",
        icon: "BusinessCenter",
      },
      {
        id: 6,
        name: "Location",
        path: "/user-management/location",
        icon: "LocationOn",
      },
    ],
  },
  {
    id: 4,
    path: "/product-setup",
    name: "Product Setup",
    icon: "Dataset",
    sub: [
      {
        id: 1,
        name: "Products",
        path: "/product-setup/products",
        icon: "LocalMall",
      },
      {
        id: 2,
        name: "Product Category",
        path: "/product-setup/product-category",
        icon: "Category",
      },
      {
        id: 3,
        name: "Product Sub Category",
        path: "/product-setup/product-sub-category",
        icon: "SubdirectoryArrowRight",
      },
      {
        id: 4,
        name: "Meat Type",
        path: "/product-setup/meat-type",
        icon: "RestaurantMenu",
      },
      {
        id: 5,
        name: "Unit of Measurements",
        path: "/product-setup/uom",
        icon: "SquareFoot",
      },
      // {
      //   id: 6,
      //   name: "Business Type",
      //   path: "/product-setup/business-type",
      //   icon: "StoreMallDirectory",
      // },
    ],
  },
  {
    id: 5,
    // path: "/discount",
    path: "/customer-management",
    // name: "Discount",
    // icon: "Discount",
    name: "Customer Management",
    icon: "SupervisedUserCircle",
    sub: [
      {
        id: 1,
        name: "Business Type",
        path: "/customer-management/business-type",
        icon: "StoreMallDirectory",
      },
      {
        id: 2,
        name: "Variable Discount",
        path: "/customer-management/variable-discount",
        icon: "Label",
      },
      {
        id: 3,
        name: "Term Days",
        path: "/customer-management/term-days",
        icon: "CalendarToday",
      },
    ],
  },
  // {
  //   id: 6,
  //   path: "/terms",
  //   name: "Terms",
  //   icon: "AlignVerticalCenter",
  //   sub: [
  //     {
  //       id: 1,
  //       name: "Term Days",
  //       path: "/terms/term-days",
  //       icon: "CalendarToday",
  //     },
  //   ],
  // },
  {
    id: 7,
    path: "/customer-registration",
    name: "Customer Registration",
    icon: "AddBusiness",
    notifications: ["rejectedClient", "rejectedListingFee"],
    sub: [
      {
        id: 1,
        path: "/customer-registration/prospect",
        name: "Prospect",
        icon: "AccountBox",
      },
      {
        id: 2,
        path: "/customer-registration/registration",
        name: "Registration",
        icon: "PersonAdd",
        notifications: ["rejectedClient"],
      },
      {
        id: 3,
        path: "/customer-registration/listing-fee",
        name: "Listing Fee",
        icon: "Payment",
        notifications: ["rejectedListingFee"],
      },
      // {
      //   id: 4,
      //   path: "/customer-registration/freebies",
      //   name: "Freebies",
      //   icon: "CardGiftCard",
      // },
    ],
  },
  // {
  //   id: 8,
  //   path: "/freebies",
  //   name: "Freebies",
  //   icon: "PostAdd",
  // },
  {
    id: 9,
    path: "/approval",
    name: "Approval",
    icon: "Approval",
    notifications: ["pendingClient", "pendingListingFee"],
    sub: [
      {
        id: 1,
        name: "Registration Approval",
        path: "/approval/registration-approval",
        icon: "HowToReg",
        notifications: ["pendingClient"],
      },
      {
        id: 2,
        name: "Sp. Discount Approval",
        path: "/approval/sp-discount-approval",
        icon: "LocalOffer",
        // notifications: "approvedgClient",
      },
      {
        id: 3,
        name: "Listing Fee Approval",
        path: "/approval/listing-fee-approval",
        icon: "Payment",
        notifications: ["pendingListingFee"],
      },
      // {
      //   id: 4,
      //   name: "Freebie Approval",
      //   path: "/approval/freebie-approval",
      //   icon: "Redeem",
      // },
    ],
  },
  // {
  //   id: 10,
  //   path: "/inventory",
  //   name: "Inventory",
  //   icon: "Inventory",
  //   sub: [
  //     {
  //       id: 1,
  //       name: "MRP",
  //       path: "/inventory/mrp",
  //     },
  //     {
  //       id: 2,
  //       name: "Other",
  //       path: "/inventory/other",
  //     },
  //   ],
  // },
];
