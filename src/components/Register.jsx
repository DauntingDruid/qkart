import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  //to redirect to products page on successful registeration
  const history = useNavigate();

  //default parameters for input
  const userInput = {
    username:"",
    password:"",
    confirmPassword:"",
  };

  //state of register form data
  const [Info, setInfo] = useState(userInput);
  
  //state for loading
  const [Load, setLoad] = useState(false);

  //input handler to save form data entered by the user
  const inputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInfo({ ...Info, [name]: value });
   };
   

  //event handler for register button
  const submitHandler = () =>{
    //validate input
    const validated = validateInput(Info); 
    //send post request
    if(validated == true){
      //post request
      register(Info);
    }
  }


  // register user function
  const register = async (formData) => {
    setLoad(true);
    try {
      const resp = await axios.post(`${config.endpoint}/auth/register`, {username:formData.username,password:formData.password});
      enqueueSnackbar("Registered successfully", { variant: 'success'});
      history("/login");
    } 
    catch (error) {
      if (error.response) {
        enqueueSnackbar("Username is already taken", { variant: "error" });
      } else if (error.request) {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{ variant: "error" });
      }
      else {
        console.log("Unexpected error")
      }
    }

    setLoad(false);
  }


  // Implemented user input validation logic
  const validateInput = (formData) => {
    //value ->valid to be returned true for post request 
    var valid = false;
    const uName = formData.username;
    const pass = formData.password;
    const cPass = formData.confirmPassword;

    //username validation
    if(uName.length > 0){
      if(uName.length >= 6){
        valid = false;
        
        //password and confirm password validation
        if(pass.length > 0){
          if(pass.length >= 6){
            if(pass == cPass){
              console.log(pass,cPass);
              valid = true;
            }else{
              enqueueSnackbar("Passwords do not match", { variant: "warning" });
            }
          }else{
            enqueueSnackbar("Password must be at least 6 characters", { variant: "warning" });
          }
        }else{
          enqueueSnackbar("Password is a required field", { variant: "warning" });
        }
      }else{
        enqueueSnackbar("Username must be at least 6 characters", { variant: "warning" });
      }
    }else{
      enqueueSnackbar("Username is a required field", { variant: "warning" });
    }
    return valid;
  };

  //to display loading/button
  const Regload = () => {
    if(Load == false){
      return (
        <Button onClick={() => submitHandler()} variant="contained" color="success">
        Register
      </Button>
      );
    }else{
      return  (
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="success" />
      </Box>
      );
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            onChange={(e) => inputChange(e)}
            id="login"
            label="Username"
            variant="outlined"
            title="Login"
            name="username"
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            onChange={(e) => inputChange(e)}
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            onChange={(e) => inputChange(e)}
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
          />

          <Regload />

          <p className="secondary-action">
            Already have an account?{" "}
            <Link to={'/login'} className="link">Login here</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
