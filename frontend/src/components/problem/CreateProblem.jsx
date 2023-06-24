import React, { Fragment, useEffect, useState } from "react";
import "./CreateProblem.css";
import { useDispatch, useSelector } from "react-redux";
import { createProblem, clearErrors } from "../../action/problemAction.js";
import { NEW_PROBLEM_RESET } from "../../constants/problemConstants";
import { useNavigate } from "react-router-dom";
import { newTestCase } from "../../action/testCaseAction";
import { NEW_TESTCASE_RESET } from "../../constants/testcaseConstants";

const CreateProblem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [problemStatement, setproblemStatement] = useState("");
  const [inputFormat, setInputFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [constraints, setConstraints] = useState("");
  const [sampleInput, setSampleInput] = useState("");
  const [sampleOutput, setSampleOutput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [testCase1, setTestCase1] = useState("");
  const [testCase2, setTestCase2] = useState("");
  const [testCase3, setTestCase3] = useState("");
  const [resultCase1, setResultCase1] = useState("");
  const [resultCase2, setResultCase2] = useState("");
  const [resultCase3, setResultCase3] = useState("");

  const { error, success, problem } = useSelector((state) => state.newProblem);

  const { error: errorTest, success: successTest } = useSelector(
    (state) => state.newTestCase
  );

  const sentProblem = (e) => {
    e.preventDefault();
    const problem = {
      name,
      problemStatement,
      inputFormat,
      outputFormat,
      constraints,
      sampleInput,
      sampleOutput,
      explanation,
      difficulty,
    };
    dispatch(createProblem(problem));
  };
  if (success) {
    const problemId = problem._id;
    const testcase = {
      problemId,
      testCase1,
      resultCase1,
      testCase2,
      resultCase2,
      testCase3,
      resultCase3,
    };
    dispatch(newTestCase(testcase));
  }

  useEffect(() => {
    if (error) {
      clearErrors();
    }
    if (errorTest) {
      clearErrors();
    }
    if (success) {
      dispatch({ type: NEW_PROBLEM_RESET });
    }
    if (successTest) {
      navigate("/problems");
      dispatch({ type: NEW_TESTCASE_RESET });
    }
  }, [dispatch, error, success, navigate, sentProblem, errorTest,successTest]);
  return (
    <Fragment>
      <div className="newProblemContainer">
        <form className="createProblemForm" onSubmit={sentProblem}>
          <h1>Create Problem</h1>

          <div>
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <textarea
              text="text"
              placeholder="Problem Statement"
              required
              cols="30"
              rows="1"
              value={problemStatement}
              onChange={(e) => setproblemStatement(e.target.value)}
            />
          </div>
          <div>
            <select
              name="difficulty"
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <textarea
              text="text"
              placeholder="Input Format"
              required
              cols="30"
              rows="1"
              value={inputFormat}
              onChange={(e) => setInputFormat(e.target.value)}
            />
          </div>

          <div>
            <textarea
              text="text"
              placeholder="Output Format"
              required
              cols="30"
              rows="1"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
            />
          </div>

          <div>
            <textarea
              text="text"
              placeholder="Constraints"
              required
              cols="30"
              rows="1"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
            />
          </div>

          <div>
            <textarea
              text="text"
              placeholder="Sample Input"
              required
              cols="30"
              rows="1"
              value={sampleInput}
              onChange={(e) => setSampleInput(e.target.value)}
            />
          </div>
          <div>
            <textarea
              text="text"
              placeholder="Sample Output"
              required
              cols="30"
              rows="1"
              value={sampleOutput}
              onChange={(e) => setSampleOutput(e.target.value)}
            />
          </div>

          <div>
            <textarea
              text="text"
              placeholder="Explaination"
              required
              cols="30"
              rows="1"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>
          <div className="test-case">
            <div className="Headings">
              <h1>Test case 1</h1>
            </div>
            <div className="test-cases">
              <textarea
                text="text"
                placeholder="Input"
                required
                cols="57"
                rows="5"
                value={testCase1}
                onChange={(e) => setTestCase1(e.target.value)}
              />
              <textarea
                text="text"
                placeholder="Output"
                required
                cols="57"
                rows="5"
                value={resultCase1}
                onChange={(e) => setResultCase1(e.target.value)}
              />
            </div>
          </div>
          <div className="test-case">
            <div className="Headings">
              <h1>Test case 2</h1>
            </div>
            <div className="test-cases">
              <textarea
                text="text"
                placeholder="Input"
                required
                cols="57"
                rows="5"
                value={testCase2}
                onChange={(e) => setTestCase2(e.target.value)}
              />
              <textarea
                text="text"
                placeholder="Output"
                required
                cols="57"
                rows="5"
                value={resultCase2}
                onChange={(e) => setResultCase2(e.target.value)}
              />
            </div>
          </div>
          <div className="test-case">
            <div className="Headings">
              <h1>Test case3</h1>
            </div>
            <div className="test-cases">
              <textarea
                text="text"
                placeholder="Input"
                required
                cols="57"
                rows="5"
                value={testCase3}
                onChange={(e) => setTestCase3(e.target.value)}
              />
              <textarea
                text="text"
                placeholder="Output"
                required
                cols="57"
                rows="5"
                value={resultCase3}
                onChange={(e) => setResultCase3(e.target.value)}
              />
            </div>
          </div>
          <button id="createProblemBtn" type="submit">
            Create
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default CreateProblem;
