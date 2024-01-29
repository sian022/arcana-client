import { Add, Info, Remove } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import useDisclosure from "../../hooks/useDisclosure";

function SwipeableItem({ setValue, orderItem, onMinus, onPlus, onSwipeLeft }) {
  const [isSwiped, setIsSwiped] = useState(false);
  const [quantity, setQuantity] = useState(orderItem.quantity);

  const anchorRef = useRef();

  //Disclosures
  const {
    isOpen: isQuantityOpen,
    onOpen: onQuantityOpen,
    onClose: onQuantityClose,
  } = useDisclosure();

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

  console.log(isQuantityOpen);

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

        <Typography
          sx={{ cursor: "pointer" }}
          onClick={() => {
            onQuantityOpen();
          }}
          ref={anchorRef}
        >
          {orderItem.quantity.toLocaleString()}
        </Typography>

        <Popover
          open={isQuantityOpen}
          anchorEl={anchorRef.current}
          onClose={onQuantityClose}
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
            <TextField
              size="small"
              sx={{
                width: "50px",
                // "& .MuiInputBase-root": {
                //   height: "30px",
                // },
              }}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              value={quantity}
            />
          </Box>
        </Popover>

        <IconButton color="secondary" onClick={onPlus}>
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
}

export default SwipeableItem;
