import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  //to redirect to products page on successful login
  const history = useNavigate();

  //default parameters for input 
  const userLoginInput = {
    username:"",
    password:"",
  }
  //loading
  const [Logload,setLogload] = useState(false);
  //state of login form data
  const [Inf, setInf] = useState(userLoginInput);
  
  //inputChange handler
  const inpChangeHandler = (e) =>{
      const name = e.target.name;
      const value = e.target.value;
      setInf({ ...Inf, [name]: value });
  }

  //submit handler
  const subHandler = () => {
    var valid = false;
    //check if form fields are not empty
    valid = validateInput(Inf);
    //send POST req if validated
    if(valid == true){
    login(Inf);
    }
  }



  // Perform the Login API call
  const login = async (formData) => {
    setLogload(true);
    try{
      const res = await axios.post(`${config.endpoint}/auth/login`,formData);
      enqueueSnackbar("Logged in successfully", { variant: 'success'});
      persistLogin(res.data.token,res.data.username,res.data.balance);
      history("/");
    }
    catch(error){
      console.log(error);
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else if (error.request) {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{ variant: "error" });
      }
      else {
        console.log("Unexpected error")
      }
    }
    setLogload(false);
  };


  // Validate the login input values so that any bad or illegal values are not passed to the backend.
  const validateInput = (data) => {
    //value ->valid to be returned true for post request 
    var validation = false;
    const uName = data.username;
    const pass = data.password;

    //username validation
    if(uName.length > 0){
      //password validation
      if(pass.length > 0){
        validation = true;
      }else{
        enqueueSnackbar("Password is a required field", { variant: "warning" });
      }
    }else{
      enqueueSnackbar("Username is a required field", { variant: "warning" });
    }
      
    return validation;
  };


  //  * -    `token` field in localStorage can be used to store the Oauth token
  //  * -    `username` field in localStorage can be used to store the username that the user is logged in as
  //  * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
  const persistLogin = (token, username, balance) => {
    localStorage.setItem('token',token);
    localStorage.setItem('username', username);
    localStorage.setItem('balance', balance);
  };

  //to display loading/button
  const LogLoad = () => {
    if(Logload == false){
      return (
        <Button 
        onClick={() => subHandler()} 
        variant="contained" color="success">
       Login To Qkart
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
      <Header hasHiddenAuthButtons/>
      
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            onChange={(e) => inpChangeHandler(e)}
            id="login"
            variant="outlined"
            label="Username"
          //label="username"
            title="username"
            name="username"
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            onChange={(e) => inpChangeHandler(e)}
            id="password"
            variant="outlined"
            label="Password"
          //label="password"
            name="password"
            type="password"
            fullWidth
            placeholder="Enter your password"
          />

          <LogLoad />

          <p className="secondary-action">
            Don't have an account?{" "}
            <Link to={'/register'} className="link">Register now</Link>
          </p>

        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
