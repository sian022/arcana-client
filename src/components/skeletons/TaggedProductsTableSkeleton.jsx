import { Skeleton, TableBody, TableCell, TableRow } from "@mui/material";
import React from "react";

function TaggedProductsTableSkeleton() {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((item, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton width="50px" />
          </TableCell>

          <TableCell>
            <Skeleton width="300px" />
          </TableCell>

          <TableCell>
            <Skeleton width="40px" />
          </TableCell>

          <TableCell>
            <Skeleton width="40px" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export default TaggedProductsTableSkeleton;
