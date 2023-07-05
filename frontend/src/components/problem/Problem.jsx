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
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors } from "../../action/userAction";
import { getDifficulty } from "../../utils.js";

const Problem = () => {
  const dispatch = useDispatch();
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
  const [runLoading, setRunLoading] = useState(false);
  const [viewResult, setViewResult] = useState(false);
  const [key, setKey] = useState("input");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tags, setTags] = useState([]);
  const [difficulty, setDifficulty] = useState("");

  const { user, error } = useSelector((state) => state.user);

  const inputRef = useRef(null);

  const languageExtention = {
    C: "c",
    "C++": "cpp",
    Java: "java",
    Python: "py",
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    axios
      .get(`/api/v1/problem/${id}`)
      .then((res) => {
        if (!res.data || res.data.length === 0) setProblemDoesNotExists(true);
        else {
          setProblem(res.data.problem);
          setTags(res.data.problem.tags);
          setDifficulty(getDifficulty(res.data.problem));
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
  }, [id,dispatch,error]);

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

  const run = (e) => {
    e.preventDefault();
    setRunLoading(true);
    setViewResult(false);
    const runDetails = {
      language: languageExtention[language],
      code: code,
      input: input,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .post(`/api/v1/run`, runDetails, config)
      .then((res) => {
        setRunLoading(false);
        inputRef.current.scrollIntoView({ behavior: "smooth" });
        setOutput(res.data.output);
        setKey("output");
      })
      .catch((err) => {
        setRunLoading(false);
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

        let success = res.data.success;

        let count = {
          success: success,
        };

        axios.put(`/api/v1/problem/${id}`, count, config).catch((err) => {
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

        setResults(res.data.results);

        const submi = {
          code,
          language,
          name: problem.name,
          result: res.data.results[0],
        };
        axios
          .post(`/api/v1/submission/user/${user._id}`, submi, config)
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {

            const error = err.response
              ? err.response.data.message
              : err.message;
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

        const userData = {
          user,
          difficulty:(success?difficulty:""),
          verdict: res.data.finalVerdict,
          tags : (success?tags:[]),
        };

        axios.put(`/api/v1/updateVerdict`, userData, config).catch((err) => {
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
        run={run}
        runLoading={runLoading}
        submitLoading={submitLoading}
      />
      {viewResult && <ResultTable results={results} resultRef={resultRef} />}
      {!viewResult && (
        <div className="problem-input-output" ref={inputRef}>
          <div className="inputBox">
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
              fill
            >
              <Tab eventKey="input" title="Input">
                <textarea
                  className="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </Tab>
              <Tab eventKey="output" title="Output">
                <textarea className="input" value={output} readOnly />
              </Tab>
            </Tabs>
          </div>
        </div>
      )}
      <br />
      <br />
    </div>
  );
};

export default Problem;
