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
  HowToVote,
  CardGiftcard,
  PinDrop,
  FastForward,
  Store,
  TrendingUp,
  MonetizationOn,
  AttachMoney,
  Settings,
  Link,
  DoneAll,
} from "@mui/icons-material";

export const getIconElement = (iconName, color) => {
  const iconMap = {
    Dashboard: <Dashboard sx={{ color: color && `${color} !important` }} />,
    AccountCircle: (
      <AccountCircle sx={{ color: color && `${color} !important` }} />
    ),
    AccountBox: <AccountBox sx={{ color: color && `${color} !important` }} />,
    Dataset: <Dataset sx={{ color: color && `${color} !important` }} />,
    Inventory: <Inventory sx={{ color: color && `${color} !important` }} />,
    AddBusiness: <AddBusiness sx={{ color: color && `${color} !important` }} />,
    PostAdd: <PostAdd sx={{ color: color && `${color} !important` }} />,
    Discount: <Discount sx={{ color: color && `${color} !important` }} />,
    AlignVerticalCenter: (
      <AlignVerticalCenter sx={{ color: color && `${color} !important` }} />
    ),
    Approval: <Approval sx={{ color: color && `${color} !important` }} />,
    Person: <Person sx={{ color: color && `${color} !important` }} />,
    SupervisorAccount: (
      <SupervisorAccount sx={{ color: color && `${color} !important` }} />
    ),
    Business: <Business sx={{ color: color && `${color} !important` }} />,
    BusinessCenter: (
      <BusinessCenter sx={{ color: color && `${color} !important` }} />
    ),
    LocationOn: <LocationOn sx={{ color: color && `${color} !important` }} />,
    LocalMall: <LocalMall sx={{ color: color && `${color} !important` }} />,
    Category: <Category sx={{ color: color && `${color} !important` }} />,
    SubdirectoryArrowRight: (
      <SubdirectoryArrowRight sx={{ color: color && `${color} !important` }} />
    ),
    RestaurantMenu: (
      <RestaurantMenu sx={{ color: color && `${color} !important` }} />
    ),
    SquareFoot: <SquareFoot sx={{ color: color && `${color} !important` }} />,
    StoreMallDirectory: (
      <StoreMallDirectory sx={{ color: color && `${color} !important` }} />
    ),
    Label: <Label sx={{ color: color && `${color} !important` }} />,
    CalendarToday: (
      <CalendarToday sx={{ color: color && `${color} !important` }} />
    ),
    Redeem: <Redeem sx={{ color: color && `${color} !important` }} />,
    PersonAdd: <PersonAdd sx={{ color: color && `${color} !important` }} />,
    Payment: <Payment sx={{ color: color && `${color} !important` }} />,
    HowToReg: <HowToReg sx={{ color: color && `${color} !important` }} />,
    LocalOffer: <LocalOffer sx={{ color: color && `${color} !important` }} />,
    SupervisedUserCircle: (
      <SupervisedUserCircle sx={{ color: color && `${color} !important` }} />
    ),
    HowToVote: <HowToVote sx={{ color: color && `${color} !important` }} />,
    CardGiftCard: (
      <CardGiftcard sx={{ color: color && `${color} !important` }} />
    ),
    PinDrop: <PinDrop sx={{ color: color && `${color} !important` }} />,
    MonetizationOn: (
      <MonetizationOn sx={{ color: color && `${color} !important` }} />
    ),
    FastForward: <FastForward sx={{ color: color && `${color} !important` }} />,
    Store: <Store sx={{ color: color && `${color} !important` }} />,
    TrendingUp: <TrendingUp sx={{ color: color && `${color} !important` }} />,
    AttachMoney: <AttachMoney sx={{ color: color && `${color} !important` }} />,
    Settings: <Settings sx={{ color: color && `${color} !important` }} />,
    Link: <Link sx={{ color: color && `${color} !important` }} />,
    DoneAll: <DoneAll sx={{ color: color && `${color} !important` }} />,
  };

  return (
    iconMap[iconName] || (
      <IcecreamOutlined sx={{ color: color && `${color} !important` }} />
    )
  );
};
