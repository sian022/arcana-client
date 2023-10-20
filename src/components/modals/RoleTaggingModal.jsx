import React, { useEffect, useState } from "react";
import CommonModal from "../CommonModal";
import { Box, Checkbox, Typography } from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import DangerButton from "../DangerButton";
import { navigationData } from "../../navigation/navigationData";
import { useSelector } from "react-redux";

function RoleTaggingModal({
  checkedModules,
  setCheckedModules,
  onSubmit,
  ...props
}) {
  const { onClose } = props;

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  useEffect(() => {
    if (selectedRowData?.permissions) {
      setCheckedModules(selectedRowData?.permissions);
    } else {
      setCheckedModules([]);
    }
  }, [selectedRowData]);

  console.log(checkedModules);

  const handleCheckboxChange = (itemName, subItemName) => {
    if (!subItemName) {
      // If it's an item.name checkbox, toggle its state
      if (checkedModules.includes(itemName)) {
        // Uncheck the main item and remove it from checkedModules
        setCheckedModules(checkedModules.filter((item) => item !== itemName));
      } else {
        // Check the main item and add it to checkedModules
        setCheckedModules([...checkedModules, itemName]);
      }
    } else {
      // If it's an itemSub.name checkbox, toggle its state and check parent if needed
      const subItemValue = subItemName;
      if (checkedModules.includes(subItemValue)) {
        // Uncheck the sub item and remove it from checkedModules
        setCheckedModules(
          checkedModules.filter((item) => item !== subItemValue)
        );
      } else {
        // Check the sub item and add it to checkedModules
        setCheckedModules([...checkedModules, subItemValue]);
        // Check the main item and add it to checkedModules if all of its sub items are checked
        const allSubItemsChecked = navigationData
          .find((item) => item.name === itemName)
          ?.sub?.every((subItem) =>
            checkedModules.includes(`${itemName}:${subItem.name}`)
          );

        if (allSubItemsChecked) {
          setCheckedModules([...checkedModules, itemName]);
        }
      }
    }
  };

  return (
    <CommonModal {...props}>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
        className="roleTaggingModal"
      >
        <Typography
          sx={{ fontSize: "25px", fontWeight: "bold" }}
          className="roleTaggingModal__title"
        >
          Tagging of Permissions
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: 350,
            overflow: "auto",
            gap: "10px",
          }}
          className="roleTaggingModal__content"
        >
          {navigationData.map((item) => (
            <Box
              sx={{
                borderRadius: "15px",
                border: "solid 2px",
                borderColor: "secondary.main",
                padding: "15px",
              }}
              key={item.id}
              className="roleTaggingModal__content__parentModule"
            >
              <Box
                sx={{ display: "flex" }}
                className="roleTaggingModal__content__parentModule__checkbox"
              >
                <Checkbox
                  checked={checkedModules?.includes(item.name)}
                  onChange={() => handleCheckboxChange(item.name)}
                />
                <Typography sx={{ fontWeight: "500", fontSize: "1.1rem" }}>
                  {item.name}
                </Typography>
              </Box>
              <Box
                sx={{ marginLeft: "20px" }}
                className="roleTaggingModal__content__parentModule__children"
              >
                {item.sub?.map((subItem) => (
                  <Box
                    key={subItem.id}
                    sx={{ display: "flex" }}
                    className="roleTaggingModal__content__parentModule__children__checkbox"
                  >
                    <Checkbox
                      checked={checkedModules?.includes(subItem.name)}
                      onChange={() =>
                        handleCheckboxChange(item.name, subItem.name)
                      }
                    />
                    <Typography>{subItem.name}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "end", gap: "10px" }}
          className="roleTaggingModal__actions"
        >
          <SecondaryButton onClick={onSubmit}>Save</SecondaryButton>
          <DangerButton onClick={onClose}>Close</DangerButton>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default RoleTaggingModal;