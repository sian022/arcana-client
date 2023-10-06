import { Logout } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'
import { setFullname, setToken } from '../features/authentication/reducers/loginSlice'
import { setPermissisons } from '../features/authentication/reducers/permissionsSlice'
import { useNavigate } from 'react-router-dom'

function LogoutButton() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(setToken(""))
    dispatch(setFullname(""))
    dispatch(setPermissisons(""))
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("fullname")
    sessionStorage.removeItem("permissions")
    navigate("/login")
  }

  return (
    <IconButton onClick={(handleLogout)} sx={{ color: "error.main" }}>
      <Logout />
    </IconButton>
  )
}

export default LogoutButton