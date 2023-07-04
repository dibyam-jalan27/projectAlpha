import React, { useState } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./submmisions.css";
import { useSelector } from "react-redux";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Chip,
  Modal,
} from "@mui/material";
import { Link } from "react-router-dom";
import NoContent from "../layout/NoContent/NoContent";
import Submission from "./Submission/Submission";
import { getDateTime } from "../../utils";
import { Box,  shadows} from "@mui/system";

const columns = [
  { id: "id", align: "center", label: "#", minWidth: 10 },
  { id: "date", align: "center", label: "When", minWidth: 50 },
  { id: "name", align: "center", label: "Problem Name", minWidth: 100 },
  { id: "language", align: "center", label: "Language", minWidth: 50 },
  { id: "verdict", align: "center", label: "Verdict", minWidth: 50 },
];

const UserSubmissions = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [rows, setRows] = useState([]);
  const [loader, setLoader] = useState(true);
  const [modalState, setModalState] = useState({ submission: {}, open: false });
  const [hasSubmissions, setHasSubmissions] = useState(true);
  const { user } = useSelector((state) => state.user);
  let userId;
  if (user) {
    userId = user._id;
  }
  const verdictMap = {
    AC: "Accepted",
    WA: "Wrong Answer",
    CE: "Compilation Error",
    RTE: "Runtime Error",
    TLE: "Time Limit Exceeded",
    MLE: "Memory Limit Exceeded",
  };
  const langMap = {
    c: "C",
    "C++": "C++",
    java: "Java8",
    py: "Python3",
  };

  if (userId) {
    axios
      .get(`/api/v1/submission/user/${userId}`)
      .then((res) => {
        const result = res.data.submissions;
        if (result.solved.length === 0) {
          setHasSubmissions(false);
        } else {
          setRows(result.solved);
        }
        setLoader(false);
      })
      .catch((err) => {
        const error = err.response ? err.response.data.message : err.message;
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }

  const handleClick = (i) => {
    const curSubmission = rows[i];
    setModalState({
      submission: curSubmission,
      open: true,
    });
  };

  const handleClose = () => {
    setModalState({
      ...modalState,
      open: false,
    });
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(e.target.value);
    setPage(0);
  };

  const body = (
      <Box
        sx={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        position: "absolute",
        width: 1000,
        border: "2px solid #000",
        boxShadow: shadows[5],
        padding:4,
        }}
      >
      <h3 className="usersubmission-modal-title" id="simple-modal-title">
        {modalState.submission.name}
      </h3>
      <p className="usersubmission-modal-details">
        <Chip
          label={verdictMap[modalState.submission.verdict]}
          style={{
            fontWeight: "bold",
            color: "white",
            maxWidth: "200px",
            backgroundColor:
              modalState.submission.verdict === "AC" ? "#5cb85c" : "#F44336",
          }}
        />
      </p>
      <p className="usersubmission-modal-details">
        By
        <Link className="usersubmission-modal-username" to="/dashboard">
          {user?user.name:""}
        </Link>
      </p>
      <hr className="usersubmission-modal-hr" />
      <Submission submission={modalState.submission} />
    </Box>
  );

  return hasSubmissions === false ? (
    <>
      <NoContent />
    </>
  ) : (
    <div className="usersubmission-container">
      <ToastContainer />
      <div className="usersubmission-spinner">
        <BeatLoader color={"#343a40"} size={30} loading={loader} />
      </div>
      <Paper
        sx={{
          width: "100%",
          height: "calc(100vh - 100px)",
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 550,
          }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value =
                          column.id === "id" ? index + 1 : row[column.id];
                        if (column.id === "date") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "15px",
                                  textDecoration: "none",
                                  color: "#1a237e",
                                }}
                              >
                                {getDateTime(value)}
                              </span>
                            </TableCell>
                          );
                        } else if (column.id === "name") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Link
                                onClick={() => handleClick(index)}
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "15px",
                                  textDecoration: "none",
                                  color: "#1a237e",
                                }}
                              >
                                {value}
                              </Link>
                              <Modal
                                open={modalState.open}
                                onClose={handleClose}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                              >
                                {body}
                              </Modal>
                            </TableCell>
                          );
                        } else if (column.id === "verdict") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Chip
                                label={verdictMap[value]}
                                style={{
                                  fontWeight: "bold",
                                  color: "white",
                                  maxWidth: "200px",
                                  backgroundColor:
                                    value === "AC" ? "#5cb85c" : "#F44336",
                                }}
                              />
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "15px",
                                  color: "#1a237e",
                                }}
                              >
                                {column.id === "language" ? langMap[value] : value}
                              </span>
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};
export default UserSubmissions;
