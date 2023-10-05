import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

function Setup() {
  const location = useLocation()

  if (location.pathname === "/setup") {
    return (
      <div>Setup</div>
    )
  }

  return <Outlet />
}

export default Setup