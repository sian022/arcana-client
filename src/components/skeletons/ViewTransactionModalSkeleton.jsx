import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function ViewTransactionModalSkeleton() {
  return (
    <Box className="viewTransactionSlipModal">
      <Box className="viewTransactionSlipModal__header">
        <Box className="viewTransactionSlipModal__header__logo">
          <Skeleton sx={{ transform: "none" }} height="80px" />
        </Box>

        <Skeleton sx={{ transform: "none" }} width="400px" />
      </Box>

      <Box className="viewTransactionSlipModal__details">
        <Box className="viewTransactionSlipModal__details__left">
          <Box className="viewTransactionSlipModal__details__left__row">
            <Skeleton sx={{ transform: "none" }} width="140px" />
            <Skeleton sx={{ transform: "none" }} width="160px" />
          </Box>

          <Box className="viewTransactionSlipModal__details__left__row">
            <Skeleton sx={{ transform: "none" }} width="100px" />
            <Skeleton sx={{ transform: "none" }} width="200px" />
          </Box>
        </Box>

        <Box className="viewTransactionSlipModal__details__right">
          <Box className="viewTransactionSlipModal__details__right__row">
            <Skeleton sx={{ transform: "none" }} width="60px" />
            <Skeleton sx={{ transform: "none" }} width="120px" />
          </Box>

          <Box className="viewTransactionSlipModal__details__right__row">
            <Skeleton sx={{ transform: "none" }} width="160px" />
            <Skeleton sx={{ transform: "none" }} width="80px" />
          </Box>
        </Box>
      </Box>

      <TableContainer
        className="viewTransactionSlipModal__tableContainer"
        sx={{ overflow: "hidden" }}
      >
        <Table>
          <TableHead className="viewTransactionSlipModal__tableContainer__tableHead">
            <TableRow>
              <TableCell
                className="viewTransactionSlipModal__tableContainer__tableHead__tableCell"
                sx={{ width: "50px" }}
              >
                <Skeleton />
              </TableCell>
              <TableCell
                className="viewTransactionSlipModal__tableContainer__tableHead__tableCell"
                sx={{ width: "50px" }}
              >
                <Skeleton />
              </TableCell>
              <TableCell className="viewTransactionSlipModal__tableContainer__tableHead__tableCell">
                <Skeleton />
              </TableCell>
              <TableCell
                className="viewTransactionSlipModal__tableContainer__tableHead__tableCell"
                sx={{ width: "250px" }}
              >
                <Skeleton />
              </TableCell>
              <TableCell
                className="viewTransactionSlipModal__tableContainer__tableHead__tableCell"
                sx={{ width: "100px" }}
              >
                <Skeleton />
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody className="viewTransactionSlipModal__tableContainer__tableBody">
            {Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableBody className="viewTransactionSlipModal__tableContainer__tableBody">
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <span className="label">
                  <Skeleton />
                </span>
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Box className="labelValueGrid">
                  <span className="label">
                    <Skeleton />
                  </span>{" "}
                  <Skeleton />
                </Box>
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Box className="labelValueGrid">
                  <span className="label">
                    <Skeleton />
                  </span>{" "}
                  <Skeleton />
                </Box>
              </TableCell>
              <TableCell>
                <span className="label">
                  <Skeleton />
                </span>
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Box className="labelValueGrid">
                  <span className="label">
                    <Skeleton />
                  </span>{" "}
                  <Skeleton />
                </Box>
              </TableCell>
              <TableCell>
                <span className="label">
                  <Skeleton />
                </span>
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Box className="labelValueGrid">
                  <span className="label">
                    <Skeleton />
                  </span>{" "}
                  <Skeleton />
                </Box>
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <span className="label">
                  <Skeleton />
                </span>
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ViewTransactionModalSkeleton;
