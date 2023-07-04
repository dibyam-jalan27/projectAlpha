import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import "./ResultTable.css";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ResultTable = ({ results, resultRef }) => {
    const verdictMap = {
      AC: "Accepted",
      WA: "Wrong Answer",
      CE: "Compilation Error",
      RTE: "Runtime Error",
      TLE: "Time Limit Exceeded",
      MLE: "Memory Limit Exceeded",
    };
    return (
      <TableContainer
        component={Paper}
        className="result-table-container"
        ref={resultRef}
      >
        <Table sx={{minWidth:150}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" className="result-table-header">
                #
              </TableCell>
              <TableCell align="center" className="result-table-header">
                Verdict
              </TableCell>
              <TableCell align="center" className="result-table-header">
                Time
              </TableCell>
              <TableCell align="center" className="result-table-header">
                Memory
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => {
              return [
                <TableRow key={index}>
                  <TableCell align="center" className="result-table-content">
                    {index + 1}
                  </TableCell>
                  <TableCell align="center" className="result-table-content">
                    <span style={{ alignItems: "center" }}>
                      {verdictMap[result.verdict]}
                      {result.verdict === "AC" ? (
                        <CheckCircleIcon className="result-table-accepted-icon" />
                      ) : (
                        <CancelIcon className="result-table-error-icon" />
                      )}
                    </span>
                  </TableCell>
                  <TableCell align="center" className="result-table-content">
                    {result.time} ms
                  </TableCell>
                  <TableCell align="center" className="result-table-content">
                    {result.memory / 1000} MB
                  </TableCell>
                </TableRow>,
              ];
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default ResultTable;
  