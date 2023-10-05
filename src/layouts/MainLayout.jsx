import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import '../assets/styles/mainLayout.styles.scss'

function MainLayout() {
  return (
    <Box className="mainLayout">
      <Sidebar />
      <Box className="mainLayout__headerAndContent">
        <Header />
        <Box className="mainLayout__headerAndContent__content">
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout