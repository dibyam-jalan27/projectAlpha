import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { Chip } from "@mui/material";
import "./Problem.css";
import CodeEditor from "../Code/CodeEditor";
import ResultTable from "../ResultTable/ResultTable";

const Problem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const resultRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [problemDoesNotExists, setProblemDoesNotExists] = useState(false);
  const [problem, setProblem] = useState({});
  const [language, setLanguage] = useState("C++");
  const [darkMode, setDarkMode] = useState(false);
  const [code, setCode] = useState("");
  const [results, setResults] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewResult, setViewResult] = useState(false);

  const languageExtention = {
    C: "c",
    "C++": "cpp",
    Java: "java",
    Python: "py",
  };

  useEffect(() => {
    axios
      .get(`/api/v1/problem/${id}`)
      .then((res) => {
        console.log(res.data);
        if (!res.data || res.data.length === 0) setProblemDoesNotExists(true);
        else {
          setProblem(res.data.problem);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setProblemDoesNotExists(true);
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

    return () => {};
  }, [id]);

  const handleLanguageSelect = (e) => {
    e.preventDefault();
    setLanguage(e.target.value);
  };

  const handleModeChange = (themeMode) => {
    setDarkMode(themeMode);
  };

  const onCodeChange = (newValue) => {
    setCode(newValue);
  };

  const submit = (e) => {
    setViewResult(true);
    e.preventDefault();
    setSubmitLoading(true);
    const submitDetails = {
      problemId: problem._id,
      language: languageExtention[language],
      code: code,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .post(`/api/v1/submit`, submitDetails, config)
      .then((res) => {
        setSubmitLoading(false);
        resultRef.current.scrollIntoView({ behavior: "smooth" });

        setResults(res.data.result);

        if (resultRef.current) {
          resultRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "start",
          });
        }
      })
      .catch((err) => {
        setSubmitLoading(false);
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
  };

  return problemDoesNotExists ? (
    <>{navigate("/404")}</>
  ) : loading ? (
    <div className="problem-loading-spinner">
      <BeatLoader color={"#343a40"} size={30} loading={loading} />
    </div>
  ) : (
    <div>
      <div className="problem-container">
        <ToastContainer />
        <div className="problem-title-wrapper">
          <div className="problem-title">
            <FontAwesomeIcon
              title="Happy Coding!"
              className="problem-code-icon"
              icon={faCode}
            />
            {problem.name}
          </div>
          <div className="problem-details">
            <div className="problem-details-item">
              <Chip
                label={"Time: " + problem.timeLimit + "s"}
                variant="outlined"
                color="primary"
                style={{ fontWeight: "600", fontSize: "medium" }}
              />
            </div>
            <div className="problem-details-item">
              <Chip
                label={"Memory: " + problem.memoryLimit + "MB"}
                variant="outlined"
                color="primary"
                style={{ fontWeight: "600", fontSize: "medium" }}
              />
            </div>
          </div>
        </div>
        <div className="problem-statement-wrapper">
          <div
            className="problem-statement"
            dangerouslySetInnerHTML={{
              __html: problem.problemStatement
                ? problem.problemStatement.replace(/<br>/g, " ")
                : null,
            }}
          />
        </div>
        <div className="problem-sample-test-wrapper">
          {problem.sampleTestcases &&
            problem.sampleTestcases.map((testcase, index) => (
              <div className="problem-sample-test" key={index}>
                <div className="problem-sample-test-input">
                  <span className="problem-sample-test-input-title">
                    Sample Input {index + 1}
                  </span>
                  <pre className="problem-sample-test-input-content">
                    {testcase.input}
                  </pre>
                </div>
                <div className="problem-sample-test-output">
                  <span className="problem-sample-test-output-title">
                    Sample Output {index + 1}
                  </span>
                  <pre className="problem-sample-test-output-content">
                    {testcase.output}
                  </pre>
                </div>
              </div>
            ))}
          {problem.explanation ? (
            <div className="problem-sample-test-explanation">
              <span className="problem-sample-test-explanation-title">
                Explanation :{" "}
              </span>
              <div className="problem-sample-test-explanation-content">
                {problem.explanation}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <CodeEditor
        language={language}
        handleLanguageSelect={handleLanguageSelect}
        darkMode={darkMode}
        handleModeChange={handleModeChange}
        onCodeChange={onCodeChange}
        submit={submit}
        submitLoading={submitLoading}
      />
      {viewResult && (
      <ResultTable results={results} resultRef={resultRef} />)}
      <br />
      <br />
    </div>
  );
};

export default Problem;
