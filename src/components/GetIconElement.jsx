import {
  AccountCircle,
  AccountBox,
  AddBusiness,
  AlignVerticalCenter,
  Approval,
  Business,
  BusinessCenter,
  Category,
  Dashboard,
  Dataset,
  Discount,
  IcecreamOutlined,
  Inventory,
  LocalMall,
  LocationOn,
  Person,
  PostAdd,
  RestaurantMenu,
  SubdirectoryArrowRight,
  SupervisorAccount,
  SquareFoot,
  StoreMallDirectory,
  Label,
  CalendarToday,
  Redeem,
  PersonAdd,
  Payment,
  HowToReg,
  LocalOffer,
  SupervisedUserCircle,
} from "@mui/icons-material";

export const getIconElement = (iconName) => {
  const iconMap = {
    Dashboard: <Dashboard />,
    AccountCircle: <AccountCircle />,
    AccountBox: <AccountBox />,
    Dataset: <Dataset />,
    Inventory: <Inventory />,
    AddBusiness: <AddBusiness />,
    PostAdd: <PostAdd />,
    Discount: <Discount />,
    AlignVerticalCenter: <AlignVerticalCenter />,
    Approval: <Approval />,
    Person: <Person />,
    SupervisorAccount: <SupervisorAccount />,
    Business: <Business />,
    BusinessCenter: <BusinessCenter />,
    LocationOn: <LocationOn />,
    LocalMall: <LocalMall />,
    Category: <Category />,
    SubdirectoryArrowRight: <SubdirectoryArrowRight />,
    RestaurantMenu: <RestaurantMenu />,
    SquareFoot: <SquareFoot />,
    StoreMallDirectory: <StoreMallDirectory />,
    Label: <Label />,
    CalendarToday: <CalendarToday />,
    SquareFoot: <SquareFoot />,
    Redeem: <Redeem />,
    PersonAdd: <PersonAdd />,
    Payment: <Payment />,
    HowToReg: <HowToReg />,
    LocalOffer: <LocalOffer />,
    SupervisedUserCircle: <SupervisedUserCircle />,
  };

  return iconMap[iconName] || <IcecreamOutlined />;
};
