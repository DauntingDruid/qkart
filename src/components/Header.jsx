import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useNavigate } from 'react-router-dom';

const Header = ({ children, hasHiddenAuthButtons }) => {
  
  //routing
  const navigate = useNavigate();

  const routeToExplore = () => {
    navigate("/", { state: { from: "Header" } });
  };
  
  const routeToRegister = () => {
    navigate("/register");
  };
  
  const routeToLogin = () => {
    navigate("/login");
  };
  
  const routeToLogOut = () => {
    localStorage.clear();
    window.location.reload();
    navigate("/");
  };
  

  if (hasHiddenAuthButtons) {
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={routeToExplore}
        >
          Back to explore
        </Button>
      </Box>
    );
  }
  //else
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
          {children}
      <Stack direction="row" spacing={1} alignItems="center">
      
        {localStorage.getItem("username") ? (
          <>
           
            <Avatar
              src="avatar.png"
              alt={localStorage.getItem("username")}
            />
            <p className="username-text">{localStorage.getItem("username")}</p>
            <Button type="primary" onClick={() => routeToLogOut()}>
          logout
        </Button> 
          </>
        ) : (
          <>
            <Button onClick={routeToLogin}>Login</Button>
            <Button variant="contained" onClick={routeToRegister}>
              Register
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Header;
