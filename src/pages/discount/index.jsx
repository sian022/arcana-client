import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

function Discount() {
  const location = useLocation()

  if (location.pathname === "/discount") {
    return (
      <div>Discount</div>
    )
  }

  return <Outlet />
}

export default Discount