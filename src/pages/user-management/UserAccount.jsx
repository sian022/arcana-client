import React, { useState } from "react";
import CommonTable from "../../components/CommonTable";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { dummyTableData } from "../../utils/DummyData";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { userAccountSchema } from "../../schema/schema";
import { yupResolver } from "@hookform/resolvers/yup"
import { Visibility, VisibilityOff } from "@mui/icons-material";

function UserAccount() {
  const [showPassword, setShowPassword] = useState(false)

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { handleSubmit, control, formState: { errors }, setValue, register } = useForm({
    resolver: yupResolver(userAccountSchema.schema),
    mode: "onChange",
    defaultValues: userAccountSchema.defaultValues
  })

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd pageTitle="User Account" onOpen={onOpen} />
      <CommonTable mapData={dummyTableData} />

      <CommonDrawer
        onClose={onClose}
        drawerHeader={"Add User Account"}
        open={isOpen}
      >
        <TextField label="Full Name" size="small" {...register("fullname")} />
        <TextField label="Username" size="small" {...register("username")} />
        <TextField
          label='Password'
          size='small'
          type={showPassword ? 'text' : 'password'}
          autoComplete='off'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={() => { setShowPassword(!showPassword) }}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
          {...register("password")}
        />
        <TextField label="Location" size="small" />
        <TextField label="Department" size="small" />
        <TextField label="Role" size="small" />
        <TextField label="Company" size="small" />
      </CommonDrawer>
    </Box>
  );
}

export default UserAccount;
