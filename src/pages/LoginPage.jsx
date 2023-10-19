import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import "../assets/styles/login.styles.scss";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { usePostLoginMutation } from "../features/authentication/api/loginApi";
import { loginSchema } from "../schema/schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setFullname,
  setToken,
} from "../features/authentication/reducers/loginSlice";
import { setPermissisons } from "../features/authentication/reducers/permissionsSlice";
import MisLogo from "../assets/images/MIS-logo.png";
import SystemLogoName from "../assets/images/SystemLogoName.png";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [postLogin, { isLoading }] = usePostLoginMutation();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const res = await postLogin(data).unwrap();
      dispatch(setFullname(res.data.fullname));
      dispatch(setToken(res.data.token));
      dispatch(setPermissisons(res.data.permission));
      navigate("/");
    } catch (err) {
      alert(err.data.messages);
    }
  };

  return (
    <Box className="login__page">
      <Box className="login__wrapper">
        <Box className="login__logoWrapper">
          <img
            src={SystemLogoName}
            alt="arcana-logo"
            className="login__logoWrapper__logo"
          />
        </Box>
        <Box className="login__formWrapper">
          <Box
            component="form"
            className="login__formWrapper__form"
            onSubmit={handleSubmit(submitHandler)}
          >
            <TextField
              label="Username"
              error={errors && errors.username}
              size="small"
              type="text"
              autoComplete="off"
              sx={{ width: "230px" }}
              {...register("username")}
              helperText={errors && errors.username?.message}
            />
            <TextField
              label="Password"
              error={errors && errors.password}
              size="small"
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              sx={{ width: "230px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register("password")}
              helperText={errors && errors.password?.message}
            />
            <Button
              className="login__formWrapper__form__signIn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size="20px" color="white" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
      <Box className="login__footer">
        <img src={MisLogo} alt="mis-logo" />
        <Typography>© 2023 Powered by</Typography>
        <Typography>Management Information System</Typography>
      </Box>
    </Box>
  );
}

export default LoginPage;
