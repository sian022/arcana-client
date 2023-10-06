import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import React from 'react'

function CommonTable({ tableHead, mapData }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {tableHead.map((item, i) => (
              <TableCell key={i}>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableHead.map((item, i) => (
            <TableCell key={i}>{item}</TableCell>
          ))}
        </TableBody>
      </Table>
      <TablePagination />
    </TableContainer>
  )
}

export default CommonTable