import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoutes from "./ProtectedRoutes";
import Dashboard from "../pages/Dashboard";
import UserManagement from "../pages/user-management";
import Setup from "../pages/setup";
import CustomerManagement from "../pages/customer-management";
import CustomerRegistration from "../pages/customer-registration";
import Approval from "../pages/approval";
import UserAccount from "../pages/user-management/UserAccount";
import UserRole from "../pages/user-management/UserRole";
import Company from "../pages/user-management/Company";
import Department from "../pages/user-management/Department";
import Location from "../pages/user-management/Location";
import Products from "../pages/setup/Products";
import ProductCategory from "../pages/setup/ProductCategory";
import ProductSubCategory from "../pages/setup/ProductSubCategory";
import MeatType from "../pages/setup/MeatType";
import UnitOfMeasurements from "../pages/setup/UnitOfMeasurements";
import TermDays from "../pages/customer-management/TermDays";
import Prospect from "../pages/customer-registration/prospecting";
import Registration from "../pages/customer-registration/Registration";
import ListingFee from "../pages/customer-registration/ListingFee";
import RegistrationApproval from "../pages/approval/RegistrationApproval";
import SpecialDiscountApproval from "../pages/approval/SpecialDiscountApproval";
import ListingFeeApproval from "../pages/approval/ListingFeeApproval";
import VariableDiscount from "../pages/customer-management/VariableDiscount";
import BusinessType from "../pages/customer-management/BusinessType";
import Approver from "../pages/user-management/Approver";
import SalesManagement from "../pages/sales-management";
import SalesTransaction from "../pages/sales-management/SalesTransaction";
import PaymentTransaction from "../pages/sales-management/PaymentTransaction";
import SpecialDiscount from "../pages/sales-management/SpecialDiscount";
import AdvancePayment from "../pages/sales-management/AdvancePayment";
import Cluster from "../pages/user-management/Cluster";
import OtherExpenses from "../pages/customer-management/OtherExpenses";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  // {
  //   path: "*",
  //   element: <PageNotFound text ={""}/>,
  // },
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
        children: [
          {
            path: "user-account",
            element: <UserAccount />,
          },
          {
            path: "user-role",
            element: <UserRole />,
          },
          {
            path: "approver",
            element: <Approver />,
          },
          {
            path: "cluster",
            element: <Cluster />,
          },
          {
            path: "company",
            element: <Company />,
          },
          {
            path: "department",
            element: <Department />,
          },
          {
            path: "location",
            element: <Location />,
          },
        ],
      },
      {
        path: "product-setup",
        element: <Setup />,
        children: [
          {
            path: "products",
            element: <Products />,
          },
          {
            path: "product-category",
            element: <ProductCategory />,
          },
          {
            path: "product-sub-category",
            element: <ProductSubCategory />,
          },
          {
            path: "meat-type",
            element: <MeatType />,
          },
          {
            path: "uom",
            element: <UnitOfMeasurements />,
          },
          // {
          //   path: "business-type",
          //   element: <StoreType />,
          // },
        ],
      },
      {
        path: "customer-management",
        element: <CustomerManagement />,
        children: [
          {
            path: "business-type",
            element: <BusinessType />,
          },
          {
            path: "variable-discount",
            element: <VariableDiscount />,
          },
          {
            path: "term-days",
            element: <TermDays />,
          },
          {
            path: "other-expenses",
            element: <OtherExpenses />,
          },
        ],
      },
      // {
      //   path: "terms",
      //   element: <Terms />,
      //   children: [
      //     {
      //       path: "term-days",
      //       element: <TermDays />,
      //     },
      //   ],
      // },
      {
        path: "customer-registration",
        element: <CustomerRegistration />,
        children: [
          {
            path: "prospect",
            element: <Prospect />,
          },
          {
            path: "registration",
            element: <Registration />,
          },
          {
            path: "listing-fee",
            element: <ListingFee />,
          },
          // {
          //   path: "freebies",
          //   element: <Freebies />,
          // },
        ],
      },

      // {
      //   path: "sales-management",
      //   element: <SalesManagement />,
      //   children: [
      //     {
      //       path: "sales-transaction",
      //       element: <SalesTransaction />,
      //     },
      //     {
      //       path: "payment-transaction",
      //       element: <PaymentTransaction />,
      //     },
      //     {
      //       path: "special-discount",
      //       element: <SpecialDiscount />,
      //     },
      //     {
      //       path: "advance-payment",
      //       element: <AdvancePayment />,
      //     },
      //   ],
      // },

      {
        path: "approval",
        element: <Approval />,
        children: [
          {
            path: "registration-approval",
            element: <RegistrationApproval />,
          },
          {
            path: "sp-discount-approval",
            element: <SpecialDiscountApproval />,
          },
          {
            path: "listing-fee-approval",
            element: <ListingFeeApproval />,
          },
          // {
          //   path: "freebie-approval",
          //   element: <FreebieApproval />,
          // },
        ],
      },
    ],
  },
]);
