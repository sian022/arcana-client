import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

function UserManagement() {
  const location = useLocation()

  if (location.pathname === '/user-management') {
    return (
      <div>UserManagement</div>
    )
  }
  return <Outlet />
}

export default UserManagement