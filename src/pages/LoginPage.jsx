import { Box, Button, IconButton, InputAdornment, Typography, TextField } from '@mui/material'
import React, { useState } from 'react'
import '../assets/styles/login.styles.scss'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { usePostLoginMutation } from '../features/authentication/api/loginApi'
import { loginSchema } from '../schema/schema'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const [postLogin, { isLoading }] = usePostLoginMutation()

  const { handleSubmit, register, formState: { errors, isValid }, reset } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    }
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const submitHandler = async (data) => {
    try {
      const res = await postLogin(data)
      navigate("/")
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <Box className="login__page">
      <Box className="login__wrapper">
        <Box className="login__logoWrapper">
          <img src='src/assets/images/SystemLogoName.png' alt='arcana-logo' className='login__logoWrapper__logo' />
        </Box>
        <Box className="login__formWrapper">
          <Box component="form" className="login__formWrapper__form" onSubmit={handleSubmit(submitHandler)}>
            <TextField
              label='Username'
              size='small'
              type='text'
              autoComplete='off'
              sx={{ width: "230px" }}
              {...register("username")}
            />
            <TextField
              label='Password'
              size='small'
              type={showPassword ? 'text' : 'password'}
              autoComplete='off'
              sx={{ width: "230px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => { setShowPassword(!showPassword) }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...register("password")}
            />
            <Button className='login__formWrapper__form__signIn' type='submit'>
              Sign in
            </Button>
          </Box>
        </Box>
      </Box>
      <Box className="login__footer">
        <img src='src/assets/images/MIS-logo.png' alt="mis-logo" />
        <Typography>© 2023 Powered by</Typography>
        <Typography>Management Information System</Typography>
      </Box>
    </Box>
  )
}

export default LoginPage