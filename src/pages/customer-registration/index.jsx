import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

function CustomerRegistration() {
  const location = useLocation()

  if (location.pathname === "/customer-registration") {
    return (
      <div>CustomerRegistration</div>
    )
  }

  return <Outlet />
}

export default CustomerRegistration