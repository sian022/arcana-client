export const navigationData = [
  {
    id: 1,
    path: "/",
    name: "Admin Dashboard",
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
        name: "Company",
        path: "/user-management/company",
        icon: "Business",
      },
      {
        id: 4,
        name: "Department",
        path: "/user-management/department",
        icon: "BusinessCenter",
      },
      {
        id: 5,
        name: "Location",
        path: "/user-management/location",
        icon: "LocationOn",
      },
    ],
  },
  {
    id: 4,
    path: "/setup",
    name: "Setup",
    icon: "Dataset",
    sub: [
      {
        id: 1,
        name: "Products",
        path: "/setup/products",
        icon: "LocalMall",
      },
      {
        id: 2,
        name: "Product Category",
        path: "/setup/product-category",
        icon: "Category",
      },
      {
        id: 3,
        name: "Product Sub Category",
        path: "/setup/product-sub-category",
        icon: "SubdirectoryArrowRight",
      },
      {
        id: 4,
        name: "Meat Type",
        path: "/setup/meat-type",
        icon: "RestaurantMenu",
      },
      {
        id: 5,
        name: "Unit of Measurements",
        path: "/setup/uom",
        icon: "SquareFoot",
      },
      {
        id: 6,
        name: "Store Type",
        path: "/setup/store-type",
        icon: "StoreMallDirectory",
      },
    ],
  },
  {
    id: 5,
    path: "/discount",
    name: "Discount",
    icon: "Discount",
    sub: [
      {
        id: 1,
        name: "Discount Type",
        path: "/discount/discount-type",
        icon: "Label",
      },
    ],
  },
  {
    id: 6,
    path: "/terms",
    name: "Terms",
    icon: "AlignVerticalCenter",
    sub: [
      {
        id: 1,
        name: "Term Days",
        path: "/terms/term-days",
        icon: "CalendarToday",
      },
    ],
  },
  {
    id: 7,
    path: "/customer-registration",
    name: "Customer Registration",
    icon: "AddBusiness",
    sub: [
      {
        id: 1,
        path: "/customer-registration/prospect",
        name: "Prospect",
        icon: "AccountBox",
      },
      // {
      //   id: 2,
      //   path: "/customer-registration/direct",
      //   name: "Direct",
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
    sub: [
      // {
      //   id: 2,
      //   name: "Prospect Approval",
      //   path: "/approval/prospect-approval",
      // },
      {
        id: 1,
        name: "Freebie Approval",
        path: "/approval/freebie-approval",
        icon: "Redeem",
      },
      // {
      //   id: 2,
      //   name: "Direct Approval",
      //   path: "/approval/direct-approval",
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
