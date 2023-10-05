import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

function Approval() {
  const location = useLocation()

  if (location.pathname === "/approval") {
    return (
      <div>Approval</div>
    )
  }

  return <Outlet />
}

export default Approval