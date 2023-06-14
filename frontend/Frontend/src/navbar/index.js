import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink } from './NavbarElements';

const Navbar = () => {
  return (
    <AppBar position="fixed" color="primary" sx={{ left: 0 }}>
      <Toolbar>
        {/* Logo/Brand */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.secondary' }}>
          Churn Predictions
        </Typography>
        {/* Navigation Links */}
        <NavMenu>
          <NavLink component={RouterLink} to="/" color="inherit">
            Train
          </NavLink>
          <NavLink component={RouterLink} to="/learn" color="inherit">
            Predict
          </NavLink>
          {/* Add more navigation links as needed */}
        </NavMenu>
        {/* Action Button */}
        <NavBtn>
          <NavLink component={RouterLink} to="/login" color="inherit" variant="inherit">
            Login
          </NavLink>
        </NavBtn>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;