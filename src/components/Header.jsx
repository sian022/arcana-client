import { Logout } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import React from 'react'
import "../assets/styles/navbar.styles.scss"

function Header() {
  return (
    <Box className="navbar">
      <Box className="navbar__endButtons">
        <IconButton sx={{ color: "error.main" }}>
          <Logout />
        </IconButton>
      </Box>
    </Box>
  )
}

export default Header