import {
  Box,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import CommonModal from "../../CommonModal";
import { dummyAdvancePaymentBalancesData } from "../../../utils/DummyData";
import { debounce, formatPesoAmount } from "../../../utils/CustomFunctions";
import { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";

function AdvancePaymentBalancesModal({ ...props }) {
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const handleChange = (_, value) => {
    setPage(value);
  };

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  //UseEffect
  useEffect(() => {
    if (dummyAdvancePaymentBalancesData) {
      setTotalPages(100);
    }
  }, [dummyAdvancePaymentBalancesData]);

  return (
    <CommonModal {...props} closeTopRight>
      <Box className="advancePaymentBalancesModal">
        <Typography className="advancePaymentBalancesModal__title">
          Advance Payment Balances
        </Typography>

        <Box className="advancePaymentBalancesModal__filters">
          <TextField
            label="Search"
            size="small"
            fullWidth
            onChange={(e) => debouncedSetSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box className="advancePaymentBalancesModal__list">
          {dummyAdvancePaymentBalancesData.map((item) => (
            <Box
              key={item.id}
              className="advancePaymentBalancesModal__list__item"
            >
              <Box className="advancePaymentBalancesModal__list__item__clientInfo">
                <Typography className="advancePaymentBalancesModal__list__item__clientInfo__businessName">
                  {item.businessName}
                </Typography>

                <Typography className="advancePaymentBalancesModal__list__item__clientInfo__ownersName">
                  {item.ownersName}
                </Typography>
              </Box>

              <Typography className="advancePaymentBalancesModal__list__item__amount">
                {formatPesoAmount(item.listingFeeBalance)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box className="advancePaymentBalancesModal__pagination">
          <Pagination
            count={totalPages}
            variant="outlined"
            page={page}
            onChange={handleChange}
          />
        </Box>
      </Box>
    </CommonModal>
  );
}

export default AdvancePaymentBalancesModal;
