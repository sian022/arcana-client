import React from 'react'
import CommonTable from '../../components/CommonTable'
import { userAccountTableHeads } from '../../utils/TableHeads'
import PageHeaderAdd from '../../components/PageHeaderAdd'
import { Box } from '@mui/material'
import '../../assets/styles/common.styles.scss'

function UserAccount() {
  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd pageTitle='User Account' />
      <CommonTable tableHead={userAccountTableHeads} />
    </Box>
  )
}

export default UserAccount