import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useGetAllStoreTypesQuery } from "../../../features/setup/api/storeTypeApi";
import { Storefront } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedStoreType } from "../../../features/prospect/reducers/selectedStoreTypeSlice";
import PageHeaderTabs from "../../../components/PageHeaderTabs";
// import ForReleasing from "./ForReleasing";
import Released from "./Released";
import ForFreebies from "./ForFreebies";
import ForReleasing from "./ForReleasing";

function Prospect() {
  const [tabViewing, setTabViewing] = useState(1);

  const badges = useSelector((state) => state.badge.value);

  const selectedStoreType = useSelector(
    (state) => state.selectedStoreType.value
  );
  const dispatch = useDispatch();

  const { data } = useGetAllStoreTypesQuery();

  const prospectNavigation = [
    {
      case: 1,
      name: "For Freebies",
      badge: badges["forFreebies"],
    },
    {
      case: 2,
      name: "For Releasing",
      badge: badges["forReleasing"],
    },
    {
      case: 3,
      name: "Released",
      badge: badges["released"],
    },
  ];

  const tabComponents = {
    1: <ForFreebies />,
    2: <ForReleasing />,
    3: <Released />,
  };

  return (
    <Box className="commonPageLayout">
      {selectedStoreType ? (
        // <PageHeaderAdd pageTitle={`Prospect - ${selectedStoreType}`} />
        <PageHeaderTabs
          pageTitle={`Prospect - ${selectedStoreType}`}
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
              justifyContent: "center",
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
                  color: "white !important",
                  " &:hover": {
                    bgcolor: "accent.main",
                  },
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
    </Box>
  );
}

export default Prospect;