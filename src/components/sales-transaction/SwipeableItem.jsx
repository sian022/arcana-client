import { Add, Info, Remove } from "@mui/icons-material";
import { Box, IconButton, Popover, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

function SwipeableItem({
  orderItem,
  handleClickQuantity,
  onMinus,
  onPlus,
  onSwipeLeft,
}) {
  const [isSwiped, setIsSwiped] = useState(false);

  //React Swipeable
  const swipeable = useSwipeable({
    onSwipedLeft: (eventData) => {
      // console.log(eventData);
      setIsSwiped(true);
      setTimeout(async () => {
        try {
          await onSwipeLeft();
        } finally {
          setIsSwiped(false);
        }
      }, [500]);
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <Box
      {...swipeable}
      className={`salesTransaction__body__orderDetails__itemsList__item ${
        isSwiped ? "swiped" : ""
      }`}
    >
      <Box>
        <Tooltip
          title={orderItem.itemId?.itemDescription}
          sx={{ cursor: "pointer" }}
        >
          <Box className="salesTransaction__body__orderDetails__itemsList__item__labels">
            <Typography fontSize="1rem" color="gray">
              {orderItem.itemId?.itemCode}
            </Typography>

            <Info fontSize="" sx={{ color: "gray" }} />
          </Box>
        </Tooltip>

        <Typography
          fontSize="1rem"
          fontWeight="600"
          whiteSpace="nowrap"
          sx={{ cursor: "default" }}
        >
          ₱{" "}
          {(
            orderItem.itemId?.priceChangeHistories?.[0]?.price *
            orderItem.quantity
          ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      </Box>

      <Box className="salesTransaction__body__orderDetails__itemsList__item__right">
        <IconButton color="warning" onClick={onMinus}>
          <Remove />
        </IconButton>

        <Typography sx={{ cursor: "pointer" }} onClick={handleClickQuantity}>
          {orderItem.quantity.toLocaleString()}
        </Typography>

        {/* <Popover
          open={isQuantityOpen}
          anchorEl={anchorEl}
          onClose={handleCloseQuantity}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Controller
              control={control}
              name={`items[${index}].quantity`}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  sx={{
                    width: "50px",
                    // "& .MuiInputBase-root": {
                    //   height: "30px",
                    // },
                  }}
                  // onChange={(e) => {
                  //   field.onChange(e);
                  // }}
                />
              )}
            />
          </Box>
        </Popover> */}

        <IconButton color="secondary" onClick={onPlus}>
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
}

export default SwipeableItem;
