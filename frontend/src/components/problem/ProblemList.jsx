import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./ProblemList.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { clearErrors, getProblems } from "../../action/problemAction";
import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar/Navbar";

const ProblemList = () => {
  const dispatch = useDispatch();

  const { error, problems } = useSelector((state) => state.problems);

  const columns = [
    { field: "Number", headerName: "S.No", minWidth: 200, flex: 0.2 },
    { field: "Name", headerName: "Name", minWidth: 200, flex: 1 },
    { field: "Difficulty", headerName: "Difficulty", minWidth: 200, flex: 0.5 },
    {
      field: "Problem_Link",
      headerName: "Problem Link",
      minWidth: 200,
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/problem/${params.row.id}`}>View</Link>
          </Fragment>
        );
      },
    },
    { field: "Solved", headerName: "Solved", minWidth: 200, flex: 0.5 },
  ];
  const rows = [];
  let i = 1;

  problems &&
    problems.forEach((problem) => {
      rows.push({
        id: problem._id,
        Number: i++,
        Name: problem.name,
        Difficulty: problem.difficulty,
        Solved: "Not Solved",
      });
    });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProblems());
  }, [dispatch, error]);
  return (
    <Fragment>
      <Navbar />
      <div className="problemListContainer">
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          pageSize={10}
          className="problemListTable"
        />
      </div>
    </Fragment>
  );
};

export default ProblemList;
