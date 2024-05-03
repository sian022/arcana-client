import {
  Box,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import CommonModal from "../../CommonModal";
import { debounce, formatPesoAmount } from "../../../utils/CustomFunctions";
import { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import { useLazyGetAllAdvancePaymentBalancesQuery } from "../../../features/sales-management/api/advancePaymentApi";
import AdvancePaymentBalancesModalSkeleton from "../../skeletons/AdvancePaymentBalancesModalSkeleton";

function AdvancePaymentBalancesModal({ ...props }) {
  const { open } = props;

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  //RTK Query
  const [triggerBalances, { data, isFetching }] =
    useLazyGetAllAdvancePaymentBalancesQuery();

  //Functions
  const handleChange = (_, value) => {
    setPage(value);
  };

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  //UseEffect
  // useEffect(() => {
  //   if (dummyAdvancePaymentBalancesData) {
  //     setTotalPages(100);
  //   }
  // }, [dummyAdvancePaymentBalancesData]);

  useEffect(() => {
    if (open) {
      triggerBalances({ search }, { preferCacheValue: true });
    }
  }, [open, triggerBalances, search]);

  return (
    <CommonModal {...props} closeTopRight>
      {isFetching ? (
        <AdvancePaymentBalancesModalSkeleton />
      ) : (
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
            {data?.map((item) => (
              <Box
                key={item.clientId}
                className="advancePaymentBalancesModal__list__item"
              >
                <Box className="advancePaymentBalancesModal__list__item__clientInfo">
                  <Typography className="advancePaymentBalancesModal__list__item__clientInfo__businessName">
                    {item.businessName}
                  </Typography>

                  <Typography className="advancePaymentBalancesModal__list__item__clientInfo__ownersName">
                    {item.fullname}
                  </Typography>
                </Box>

                <Typography className="advancePaymentBalancesModal__list__item__amount">
                  {formatPesoAmount(item.balance)}
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
      )}
    </CommonModal>
  );
}

export default AdvancePaymentBalancesModal;
