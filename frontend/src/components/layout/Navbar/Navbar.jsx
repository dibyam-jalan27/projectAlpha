import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Menu, MenuItem } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../action/userAction";
import "./navbar.css";
import Loader from "../Loader/Loader";

export default function NavBar() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const options = ["", "View Profile", "Logout"];
  const [login, setLogin] = useState(isAuthenticated);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    if (options[index] === "View Profile") window.location = "/dashboard";
    else {
      dispatch(logout());
      setLogin(false);
      window.location = "/";
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    setLogin(isAuthenticated);
    }, [isAuthenticated]);

  return (
    (loading)?(
        <Loader/>
    ):(
    <div className="navbar">
      <div className="navbarWrapper">
        <div className="navLeft">
          <Link to="/" className="logo">
            OJ
          </Link>
          <div className="navbarList">
            <Link to="/problems" className="navbarItem">
              Problemset
            </Link>
            {login ? (
              <>
                <Link to="/admin/createProblem" className="navbarItem">
                  Add Problem
                </Link>
              </>
            ) : null}
          </div>
        </div>
        <div className="navRight">
          {login ? (
            <>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClickListItem}
              >
                <img
                  src="https://images.unsplash.com/photo-1513789181297-6f2ec112c0bc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aGFja2VyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                  alt="avatar"
                  className="navbarAvatar"
                />
              </Button>
              <Menu
                id="simple-menu"
                keepMounted
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {options.map((option, index) => (
                  <MenuItem
                    key={option}
                    disabled={index === 0}
                    selected={index === selectedIndex}
                    onClick={(event) => handleMenuItemClick(event, index)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                className="signin-btn"
                fullWidth
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
  )
}
