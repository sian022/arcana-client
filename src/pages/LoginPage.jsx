import {
  Box,
  IconButton,
  InputAdornment,
  Typography,
  TextField,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
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
  setRoleName,
  setToken,
  setTokenTemp,
  setUserDetails,
  setUserDetailsTemp,
} from "../features/authentication/reducers/loginSlice";
import { setPermissisons } from "../features/authentication/reducers/permissionsSlice";
import MisLogo from "../assets/images/MIS-logo.png";
import SystemLogoName from "../assets/images/SystemLogoName.png";
import useSnackbar from "../hooks/useSnackbar";
import SecondaryButton from "../components/SecondaryButton";
import { AppContext } from "../context/AppContext";
import useDisclosure from "../hooks/useDisclosure";
import InitialChangePasswordModal from "../components/modals/InitialChangePasswordModal";
import Cookies from "js-cookie";
import { handleCatchErrorMessage } from "../utils/CustomFunctions";

function LoginPage() {
  const snackbar = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { refetchNotifications } = useContext(AppContext);

  //RTK Query
  const [postLogin, { isLoading }] = usePostLoginMutation();

  //React Hook Form
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Disclosures
  const {
    isOpen: isInitialPasswordOpen,
    onOpen: onInitialPasswordOpen,
    onClose: onInitialPasswordClose,
  } = useDisclosure();

  //Handlers
  const submitHandler = async (data) => {
    try {
      const res = await postLogin(data).unwrap();
      if (!res?.value?.isPasswordChanged) {
        dispatch(setTokenTemp(res?.value?.token));
        // dispatch(setUsername(res?.value?.username));
        dispatch(setUserDetailsTemp(res?.value));
        onInitialPasswordOpen();
        return;
      }

      if (rememberMe) {
        Cookies.set("rememberMeUsername", watch("username"), { expires: 30 }); // Expires in 30 days
      } else {
        // If not selected, remove the "Remember Me" cookie
        Cookies.remove("rememberMeUsername");
      }

      dispatch(setUserDetails(res?.value));
      dispatch(setFullname(res?.value?.fullname));
      dispatch(setToken(res?.value?.token));
      dispatch(setPermissisons(res?.value?.permission));
      dispatch(setRoleName(res?.value?.roleName));
      navigate("/");
      refetchNotifications();

      reset();
    } catch (error) {
      snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
    }
  };

  useEffect(() => {
    // Check if "Remember Me" cookie exists on mount
    const rememberMeUsername = Cookies.get("rememberMeUsername");
    if (rememberMeUsername) {
      setValue("username", rememberMeUsername);
      setRememberMe(true);
    }
  }, [setValue]);

  return (
    <>
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
            <img
              src={SystemLogoName}
              alt="arcana-logo"
              className="login__formWrapper__logo"
            />

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
                // sx={{ width: "230px" }}
                sx={{ width: "100%" }}
                {...register("username")}
                helperText={errors && errors.username?.message}
              />

              <TextField
                label="Password"
                error={errors && errors.password}
                size="small"
                type={showPassword ? "text" : "password"}
                autoComplete="off"
                // sx={{ width: "230px" }}
                sx={{ width: "100% !important" }}
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

              <Box className="login__formWrapper__form__rememberMe">
                <Checkbox
                  onChange={(e) => {
                    setRememberMe(e.target.checked);
                    if (!e.target.checked) {
                      // If unchecked, remove the "Remember Me" cookie
                      Cookies.remove("rememberMeUsername");
                    }
                  }}
                  checked={rememberMe}
                />

                <Typography>Remember me</Typography>
              </Box>

              <SecondaryButton
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
            </Box>

            <Box className="login__formWrapper__footer">
              <img src={MisLogo} alt="mis-logo" />
              <Typography>© 2023 Powered by</Typography>
              <Typography>Management Information Systemm</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <InitialChangePasswordModal
        open={isInitialPasswordOpen}
        onClose={onInitialPasswordClose}
      />
    </>
  );
}

export default LoginPage;
