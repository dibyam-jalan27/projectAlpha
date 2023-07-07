import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Menu, MenuItem } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../action/userAction";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { clearErrors } from "../../../action/userAction";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isAuthenticated, user, error } = useSelector(
    (state) => state.user
  );
  const options = ["", "View Profile", "Logout"];
  const [login, setLogin] = useState(isAuthenticated);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    if (options[index] === "View Profile") navigate("/dashboard");
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
    if (error) {
      dispatch(clearErrors());
    }
  }, [isAuthenticated, error, dispatch]);

  return (
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
                {user != null && user.role === "admin" ? (
                  <Link to="/admin/createProblem" className="navbarItem">
                    Add Problem
                  </Link>
                ) : null}
                <Link to="/submissions" className="navbarItem">
                  Submissions
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
                <AccountCircleIcon style={{ fontSize: 40, color: "white" }} />
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
  );
}
