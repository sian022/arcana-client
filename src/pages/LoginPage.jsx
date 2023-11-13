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
  setUserDetails,
} from "../features/authentication/reducers/loginSlice";
import { setPermissisons } from "../features/authentication/reducers/permissionsSlice";
import MisLogo from "../assets/images/MIS-logo.png";
import SystemLogoName from "../assets/images/SystemLogoName.png";
import useSnackbar from "../hooks/useSnackbar";
import SecondaryButton from "../components/SecondaryButton";

function LoginPage() {
  const { showSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  //RTK Query
  const [postLogin, { isLoading }] = usePostLoginMutation();

  //React Hook Form
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

  //Handlers
  const submitHandler = async (data) => {
    try {
      const res = await postLogin(data).unwrap();
      dispatch(setUserDetails(res?.data));
      dispatch(setFullname(res?.data?.fullname));
      dispatch(setToken(res?.data?.token));
      dispatch(setPermissisons(res?.data?.permission));
      navigate("/");
      reset();
    } catch (err) {
      showSnackbar(err.data.error.description ?? "Error logging in", "error");
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
            <SecondaryButton
              className="login__formWrapper__form__signIn"
              type="submit"
              disabled={isLoading || !isValid}
              fullWidth
            >
              {isLoading ? (
                <CircularProgress size="20px" color="white" />
              ) : (
                "Sign In"
              )}
            </SecondaryButton>
            <Box className="login__footer">
              <img src={MisLogo} alt="mis-logo" />
              <Typography>© 2023 Powered by</Typography>
              <Typography>Management Information System</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
