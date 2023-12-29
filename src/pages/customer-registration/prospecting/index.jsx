import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useGetAllStoreTypesQuery } from "../../../features/setup/api/storeTypeApi";
import { AccountBox, Storefront } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedStoreType } from "../../../features/prospect/reducers/selectedStoreTypeSlice";
import PageHeaderTabs from "../../../components/PageHeaderTabs";
// import ForReleasing from "./ForReleasing";
import Released from "./Released";
import ForFreebies from "./ForFreebies";
import ForReleasing from "./ForReleasing";
import StoreTypeSkeleton from "../../../components/skeletons/StoreTypeSkeleton";
import { useGetAllApprovedProspectsQuery } from "../../../features/prospect/api/prospectApi";
import { AppContext } from "../../../context/AppContext";
import ForFreebiesWithLocations from "./ForFreebiesWithLocations";

function Prospect() {
  const [tabViewing, setTabViewing] = useState(1);

  const badges = useSelector((state) => state.badge.value);

  const { notifications, isNotificationFetching } = useContext(AppContext);

  const selectedStoreType = useSelector(
    (state) => state.selectedStoreType.value
  );
  const dispatch = useDispatch();

  const { data, isLoading } = useGetAllStoreTypesQuery({ Status: true });

  // const { data: forFreebiesData, isLoading: isForFreebiesLoading } =
  //   useGetAllApprovedProspectsQuery({
  //     Status: true,
  //     StoreType: selectedStoreType !== "Main" ? selectedStoreType : "",
  //   });

  // const { data: forReleasingData, isLoading: isForReleasingLoading } =
  //   useGetAllApprovedProspectsQuery({
  //     Status: true,
  //     StoreType: selectedStoreType !== "Main" ? selectedStoreType : "",
  //     FreebieStatus: "For Releasing",
  //   });

  // const { data: releasedData, isLoading: isReleasedLoading } =
  //   useGetAllApprovedProspectsQuery({
  //     Status: true,
  //     StoreType: selectedStoreType !== "Main" ? selectedStoreType : "",
  //     FreebieStatus: "Released",
  //   });

  const prospectNavigation = [
    {
      case: 1,
      name: "For Freebies",
      // badge: badges["forFreebies"],
      // badge: forFreebiesData?.totalCount || 0,
      badge: notifications["forFreebies"],
      isBadgeLoading: isNotificationFetching,
    },
    {
      case: 2,
      name: "For Releasing",
      // badge: badges["forReleasing"],
      // badge: forReleasingData?.totalCount || 0,
      // isBadgeLoading: isForReleasingLoading,
      badge: notifications["forReleasing"],
      isBadgeLoading: isNotificationFetching,
    },
    {
      case: 3,
      name: "Released",
      // badge: badges["released"],
      // badge: releasedData?.totalCount || 0,
      // isBadgeLoading: isReleasedLoading,
      badge: notifications["released"],
      isBadgeLoading: isNotificationFetching,
    },
  ];

  const tabComponents = {
    1: <ForFreebies />,
    // 1: <ForFreebiesWithLocations />,
    2: <ForReleasing />,
    3: <Released />,
  };

  useEffect(() => {
    setTabViewing(1);
  }, [selectedStoreType]);
  return (
    <Box className="commonPageLayout">
      {selectedStoreType ? (
        // <PageHeaderAdd pageTitle={`Prospect - ${selectedStoreType}`} />
        <PageHeaderTabs
          pageTitle={`Prospect - ${selectedStoreType}`}
          // pageTitle={
          //   <>
          //     Prospect - {selectedStoreType} <AccountBox />
          //   </>
          // }
          tabsList={prospectNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
        />
      ) : (
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "2rem",
            color: "secondary.main",
          }}
        >
          Prospect
        </Typography>
      )}

      {selectedStoreType ? (
        <>{tabComponents[tabViewing]}</>
      ) : (
        <>
          {isLoading ? (
            <StoreTypeSkeleton />
          ) : (
            <Box
              sx={{
                display: "flex",
                // my: "20px",
                // mx: "30px",
                gap: "10px",
              }}
            >
              <Button
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: "30px",
                  backgroundColor: "secondary.main",
                  color: "white !important",
                  " &:hover": {
                    bgcolor: "accent.main",
                  },
                }}
                onClick={() => {
                  dispatch(setSelectedStoreType("Main"));
                }}
              >
                <Storefront sx={{ fontSize: "350px" }} />
                <Typography sx={{ fontSize: "30px", fontWeight: "600" }}>
                  Main
                </Typography>
              </Button>

              <Box
                sx={{
                  flex: "1",
                  height: "500px",
                  margin: "auto",
                  borderRadius: "20px",
                  display: "flex",
                  gap: "20px",
                  maxWidth: "900px",
                  flexWrap: "wrap",
                  marginLeft: data?.storeTypes?.length > 3 ? "0px" : "20px",
                  justifyContent:
                    data?.storeTypes?.length > 3 ? "center" : "start",
                  // alignItems: "center",
                  overflow: "auto",
                }}
              >
                {data?.storeTypes?.map((item) => (
                  <Button
                    key={item.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      borderRadius: "30px",
                      backgroundColor: "secondary.main",
                      // bgcolor: "gray",
                      color: "white !important",
                      " &:hover": {
                        bgcolor: "accent.main",
                      },
                      maxHeight: "200px",
                    }}
                    title={item.storeTypeName}
                    onClick={() => {
                      dispatch(setSelectedStoreType(item.storeTypeName));
                    }}
                  >
                    <Storefront sx={{ fontSize: "100px" }} />
                    <Typography
                      sx={{ fontSize: "16px", fontWeight: "600" }}
                      className="truncate-text"
                    >
                      {item.storeTypeName}
                    </Typography>
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default Prospect;
