import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useGetAllStoreTypesQuery } from "../../../features/setup/api/storeTypeApi";
import { Storefront } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedStoreType } from "../../../features/prospect/reducers/selectedStoreTypeSlice";
import PageHeaderTabs from "../../../components/PageHeaderTabs";
import Released from "./Released";
import ForFreebies from "./ForFreebies";
import ForReleasing from "./ForReleasing";
import StoreTypeSkeleton from "../../../components/skeletons/StoreTypeSkeleton";
import { AppContext } from "../../../context/AppContext";
import "../../../assets/styles/prospect.styles.scss";

function Prospect() {
  const [tabViewing, setTabViewing] = useState(1);

  const { setModuleName } = useContext(AppContext);

  const selectedStoreType = useSelector(
    (state) => state.selectedStoreType.value
  );
  const dispatch = useDispatch();

  const { data, isLoading } = useGetAllStoreTypesQuery({
    Status: true,
    Page: 1,
    PageSize: 1000,
  });

  const prospectNavigation = [
    {
      case: 1,
      name: "For Freebies",
    },
    {
      case: 2,
      name: "For Releasing",
    },
    {
      case: 3,
      name: "Released",
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

  useEffect(() => {
    setModuleName("Prospect");
  }, []);

  return (
    <Box className="commonPageLayout">
      {selectedStoreType ? (
        <PageHeaderTabs
          pageTitle={`Prospect - ${selectedStoreType}`}
          tabsList={prospectNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
        />
      ) : (
        <Typography fontWeight="700" fontSize="1.8rem">
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
            <Box className="prospectingStoreList">
              <Button
                className="prospectingStoreList__mainButton"
                onClick={() => {
                  dispatch(setSelectedStoreType("Main"));
                }}
              >
                <Storefront className="prospectingStoreList__mainButton__icon" />

                <Typography className="prospectingStoreList__mainButton__label">
                  Main
                </Typography>
              </Button>

              <Box className="prospectingStoreList__storeTypeButtons">
                {data?.storeTypes?.map((item) => (
                  <Button
                    key={item.id}
                    className="prospectingStoreList__storeTypeButtons__item"
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
