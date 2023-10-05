import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

function ProtectedRoutes() {
  const fullname = useSelector(state => state.fullname?.value)
  const permissions = useSelector(state => state.permissions?.value)

  console.log(fullname, permissions)

  if (!fullname || permissions?.length === 0) {
    <Navigate to="/login" />
  }

  return (
    <MainLayout />
  )
}

export default ProtectedRoutes