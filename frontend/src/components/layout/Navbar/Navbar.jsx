import React, { Fragment } from "react";
import Logo from "../../../Assets/Logo.jpg";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../action/userAction";
import { AiOutlinePoweroff } from "react-icons/ai";
import "./Navbar.css";
import Loader from "../Loader/Loader";
import { useDispatch } from "react-redux";
import {CgProfile} from 'react-icons/cg'
import { toast } from "react-hot-toast";
import { Button } from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  
  const runLogout = () => {
    dispatch(logout());
    toast.success("Logged Out Successfully");
  };

  const runLogin = () => {
    navigate("/login");
  }
  
  
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <nav>
            <ul className="menu">
              <li className="logo">
                <Link to="/">
                <img src={Logo} alt="Logo" />
                </Link>
              </li>
              <li>
              {(isAuthenticated && user.role === "admin") && (
                <Link to="/admin/createProblem" className="createProblem">
                  Create
                </Link>
              )}
              </li>
              <li>    
              {isAuthenticated? (
                <Button onClick={runLogout} variant="text">
                    <AiOutlinePoweroff className="logoutBtn"/>
                </Button>
              ):(
                <Button onClick={runLogin} variant="text">
                    <CgProfile className="logoutBtn"/>
                </Button>
              )
              }
              </li>
            </ul>
          </nav>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Navbar;
