import { Logout } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import React from 'react'
import "../assets/styles/navbar.styles.scss"
import LogoutButton from './LogoutButton'

function Header() {
  return (
    <Box className="navbar">
      <Box className="navbar__endButtons">
        <LogoutButton />
      </Box>
    </Box>
  )
}

export default Header