import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

function Terms() {
  const location = useLocation()

  if (location.pathname === "/terms") {
    return (
      <div>Terms</div>
    )
  }

  return <Outlet />
}

export default Terms