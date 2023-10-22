import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoutes from "./ProtectedRoutes";
import Dashboard from "../pages/Dashboard";
import UserManagement from "../pages/user-management";
import Setup from "../pages/setup";
import Discount from "../pages/discount";
import Terms from "../pages/terms";
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
import StoreType from "../pages/setup/StoreType";
import DiscountType from "../pages/discount/DiscountType";
import TermDays from "../pages/terms/TermDays";
import Prospect from "../pages/customer-registration/prospecting";
import FreebieApproval from "../pages/approval/FreebieApproval";
import DirectRegistration from "../pages/customer-registration/DirectRegistration";
import ListingFee from "../pages/customer-registration/ListingFee";
import RegistrationApproval from "../pages/approval/RegistrationApproval";
import SpecialDiscountApproval from "../pages/approval/SpecialDiscountApproval";
import ListingFeeApproval from "../pages/approval/ListingFeeApproval";

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
        path: "setup",
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
          {
            path: "store-type",
            element: <StoreType />,
          },
        ],
      },
      {
        path: "discount",
        element: <Discount />,
        children: [
          {
            path: "discount-type",
            element: <DiscountType />,
          },
        ],
      },
      {
        path: "terms",
        element: <Terms />,
        children: [
          {
            path: "term-days",
            element: <TermDays />,
          },
        ],
      },
      {
        path: "customer-registration",
        element: <CustomerRegistration />,
        children: [
          {
            path: "prospect",
            element: <Prospect />,
          },
          {
            path: "direct-registration",
            element: <DirectRegistration />,
          },
          {
            path: "listing-fee",
            element: <ListingFee />,
          },
        ],
      },
      {
        path: "approval",
        element: <Approval />,
        children: [
          // {
          //   path: "freebie-approval",
          //   element: <FreebieApproval />,
          // },
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
        ],
      },
    ],
  },
]);
