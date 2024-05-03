import {
  Box,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import CommonModal from "../../CommonModal";
import { dummyListingFeeBalancesData } from "../../../utils/DummyData";
import { debounce, formatPesoAmount } from "../../../utils/CustomFunctions";
import { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import { useLazyGetAllListingFeeBalancesQuery } from "../../../features/listing-fee/api/listingFeeApi";

function ListingFeeBalancesModal({ ...props }) {
  const { open } = props;

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  //RTK Query
  const [triggerBalances, { data, isFetching }] =
    useLazyGetAllListingFeeBalancesQuery();

  //Functions
  const handleChange = (_, value) => {
    setPage(value);
  };

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  //UseEffect
  // useEffect(() => {
  //   if (dummyListingFeeBalancesData) {
  //     setTotalPages(100);
  //   }
  // }, [dummyListingFeeBalancesData]);

  useEffect(() => {
    if (open) {
      triggerBalances({ search }, { preferCacheValue: true });
    }
  }, [open, triggerBalances, search]);

  return (
    <CommonModal {...props} closeTopRight>
      <Box className="listingFeeBalancesModal">
        <Typography className="listingFeeBalancesModal__title">
          Listing Fee Balances
        </Typography>

        <Box className="listingFeeBalanceModal__filters">
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

        <Box className="listingFeeBalancesModal__list">
          {data.map((item) => (
            <Box key={item.id} className="listingFeeBalancesModal__list__item">
              <Box className="listingFeeBalancesModal__list__item__clientInfo">
                <Typography className="listingFeeBalancesModal__list__item__clientInfo__businessName">
                  {item.businessName}
                </Typography>

                <Typography className="listingFeeBalancesModal__list__item__clientInfo__ownersName">
                  {item.fullname}
                </Typography>
              </Box>

              <Typography className="listingFeeBalancesModal__list__item__amount">
                {formatPesoAmount(item.balance)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box className="listingFeeBalancesModal__pagination">
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

export default ListingFeeBalancesModal;
