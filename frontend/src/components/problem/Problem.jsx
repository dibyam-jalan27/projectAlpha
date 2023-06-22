import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProblemDetails } from "../../action/problemAction.js";
import Loader from "../layout/Loader/Loader.jsx";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";
import "./Problem.css";
import Editor from "@monaco-editor/react";
import axios from "axios";

const Problem = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [language, setLanguage] = useState("c");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  const { loading, error, problem } = useSelector(
    (state) => state.problemDetails
  );
  const options = {
    autoIndent: "full",
    contextmenu: true,
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: "always",
    minimap: {
      enabled: true,
    },
    scrollbar: {
      horizontalSliderSize: 4,
      verticalSliderSize: 18,
    },
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: "line",
    automaticLayout: true,
  };

  const runCodeFtn = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/v1/compile",
      { code, language, input },
      config
    );
    console.log(data);
  };
  const submitCode = () => {};

  useEffect(() => {
    if (error) {
      clearErrors();
    }
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
                  <Link to={"/problems"}>
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
                  <thead>
                    <tr>
                      <th>Input</th>
                      <th>Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{problem.sampleInput}</td>
                      <td>{problem.sampleOutput}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="inputFormat">
                <h2>Explanation</h2>
                <p>{problem.explanation}</p>
              </div>
            </div>
            <div className="Ide">
              <div className="inputFormat">
                <h2>Editor</h2>
              </div>
              <div className="language">
                <h3>Language</h3>
                <select onChange={(e) => setLanguage(e.target.value)}>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="py">Python</option>
                </select>
              </div>
              <Editor
                height="400px"
                width="570px"
                options={options}
                theme="vs-dark"
                language={language === "py" ? "python" : language}
                value={code}
                onChange={(e) => setCode(e)}
              />
              <div className="wrapper">
                <div className="customInput">
                  <h4>Custom input</h4>
                  <textarea
                    rows="4"
                    cols="70"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  ></textarea>
                </div>
                <div className="buttons">
                  <button className="btn-run" onClick={runCodeFtn}>
                    Run
                  </button>
                  <button className="btn-submit" onClick={submitCode}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Problem;
