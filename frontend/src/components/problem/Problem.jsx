import React, { Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProblemDetails } from "../../action/problemAction.js";
import Loader from "../layout/Loader/Loader.jsx";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";
import "./Problem.css";

const Problem = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { loading, error, problem } = useSelector(
    (state) => state.problemDetails
  );

  useEffect(() => {
    dispatch(getProblemDetails(id));
  }, []);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="Header">
            <nav>
              <ul className="Menu">
                <li>
                  <Link>
                    <AiOutlineArrowLeft />
                  </Link>
                </li>
                <li>
                  <h1>{problem.name}</h1>
                </li>
              </ul>
            </nav>
          </div>
          <div className="container">
            <div className="problemContainer">
              <h1>Problem</h1>
              <div className="description">
                <p>{problem.problemStatement}</p>
              </div>
              <div className="inputFormat">
                <h2>Input Format</h2>
                <p>{problem.inputFormat}</p>
              </div>
              <div className="outputFormat">
                <h2>Output Format</h2>
                <p>{problem.outputFormat}</p>
              </div>
              <div className="inputFormat">
                <h2>Constraints</h2>
                <p>{problem.constraints}</p>
              </div>
              <div className="inputFormat">
                <h2>Sample Input</h2>
                <table border="1" className="table">
                  <tr>
                    <th>Input</th>
                    <th>Output</th>
                  </tr>
                  <td>{problem.sampleInput}</td>
                  <td>{problem.sampleOutput}</td>
                </table>
              </div>
              <div className="inputFormat">
                <h2>Explanation</h2>
                <p>{problem.explanation}</p>
              </div>
            </div>
            <div className="Ide">
              <div className="header"> IDE </div>
              <div className="control-panel">
                Select Language: &nbsp; &nbsp;
                <select
                  id="languages"
                  className="languages"
                  onchange="changeLanguage()"
                >
                  <option value="c"> C </option>
                  <option value="cpp"> C++ </option>
                  <option value="php"> PHP </option>
                  <option value="python"> Python </option>
                  <option value="node"> Node JS </option>
                </select>
              </div>
                <input className="editor" id="editor"/>
                

              <div className="button-container">
                <button className="btn" onclick="executeCode()">
                  {" "}
                  Run{" "}
                </button>
              </div>

              <div className="output"></div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Problem;
