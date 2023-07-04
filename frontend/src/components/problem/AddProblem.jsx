import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import {
  Button as ReactButton,
  Form,
  Row,
  Col,
  Collapse,
  Table,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faPaperPlane,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import mathquill4quill from "mathquill4quill";
import "mathquill4quill/mathquill4quill.css";
import "./AddProblem.css";
import katex from "katex";
import "katex/dist/katex.min.css";
window.katex = katex;

const SampleTestcase = ({ i, input, output, setInput, setOutput }) => {
  return (
    <div>
      <Table>
        <tbody>
          <br />
          <tr>
            <Form.Group className="input-output">
              <Form.Label className="sample-testcase-input">
                Sample Input {i + 1}
              </Form.Label>
              <Form.Control
                as="textarea"
                name={"input" + (i + 1)}
                rows={3}
                onChange={(e) => setInput([...input, e.target.value])}
              />
              <br />
              <Form.Label className="sample-testcase-output">
                Sample Output {i + 1}
              </Form.Label>
              <Form.Control
                as="textarea"
                name={"output" + (i + 1)}
                rows={3}
                onChange={(e) => setOutput([...output, e.target.value])}
              />
            </Form.Group>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

const Testcase = ({ i, input, output, setInput, setOutput }) => {
  return (
    <div>
      <Table>
        <tbody>
          <br />
          <tr>
            <Form.Group className="input-output">
              <Form.Label className="sample-testcase-input">
                Input {i + 1}
              </Form.Label>
              <Form.Control
                as="textarea"
                name={"input" + (i + 1)}
                rows={3}
                onChange={(e) => setInput([...input, e.target.value])}
              />
              <br />
              <Form.Label className="sample-testcase-output">
                Output {i + 1}
              </Form.Label>
              <Form.Control
                as="textarea"
                name={"output" + (i + 1)}
                rows={3}
                onChange={(e) => setOutput([...output, e.target.value])}
              />
            </Form.Group>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

const AddProblem = () => {
  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);
  const [testCaseInput, setTestCaseInput] = useState([]);
  const [testCaseOutput, setTestCaseOutput] = useState([]);
  const [problemStatement, setProblemStatement] = useState("");
  const [children, setChildren] = useState([]);
  const [children2, setChildren2] = useState([]);
  const [problemName, setProblemName] = useState("");
  const [explanation, setExplanation] = useState("");
  const [time, setTime] = useState(0);
  const [memory, setMemory] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentTags, setCurrentTags] = useState([]);
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const reactQuill = useRef();
  const navigate = useNavigate();


  const tags = [
    "Binary Search",
    "Bitmasks",
    "Bruteforce",
    "Combinatorics",
    "Constructive Algorithms",
    "Data Structures",
    "DFS and Similar",
    "Divide and Conquer",
    "Dynamic Programming",
    "DSU",
    "Flows",
    "Games",
    "Graphs",
    "Greedy",
    "Implementation",
    "Math",
    "Number Theory",
    "Shortest Paths",
    "Sortings",
    "Ternery Search",
    "Trees",
    "Two Pointers",
  ];

  const handleChange = (value) => {
    setProblemStatement(value);
  };

  const handleTagSelect = (tag) => {
    let newTags;
    if (!currentTags.includes(tag)) {
      newTags = [tag, ...currentTags];
    } else {
      newTags = currentTags.filter((curTag) => curTag !== tag);
    }

    setCurrentTags(newTags);
  };

  const addTestcase = () => {
    setChildren(
      children.concat(
        <SampleTestcase
          key={children.length}
          i={children.length}
          input={input}
          setInput={setInput}
          output={output}
          setOutput={setOutput}
        />
      )
    );
  };

  const addTestcase2 = () => {
    setChildren2(
      children2.concat(
        <Testcase
          key={children2.length}
          i={children2.length}
          input={testCaseInput}
          setInput={setTestCaseInput}
          output={testCaseOutput}
          setOutput={setTestCaseOutput}
        />
      )
    );
  };

  const handleDelete = () => {
    let newChildren = children;
    newChildren.splice(-1);
    setChildren([...newChildren]);
  };

  const handleDelete2 = () => {
    let newChildren = children2;
    newChildren.splice(-1);
    setChildren2([...newChildren]);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    setLoadingSpinner(true);

    let sampleTestcases = [];
    for (let i = 0; i < input.length; i++) {
      sampleTestcases.push({
        input: input[i],
        output: output[i],
      });
    }

    let testcases = [];
    for (let i = 0; i < testCaseInput.length; i++) {
      testcases.push({
        input: testCaseInput[i],
        output: testCaseOutput[i],
      });
    }

    console.log(testcases);

    const problemData = {
      name: problemName,
      sampleTestcases: sampleTestcases,
      problemStatement: problemStatement,
      explanation: explanation,
      tags: currentTags,
      timeLimit: time,
      memoryLimit: memory,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    //send data to backend
    axios.post(`/api/v1/admin/problem/new`, problemData, config).then((res) => {
      const problemid = res.data.id;
      const testCaseData = {
        testCase: testcases,
        problemId: problemid,
      };
      axios
        .post(`/api/v1/admin/testcase/new`, testCaseData, config)
        .then((res) => {
          setLoadingSpinner(false);
          toast.success("Problem Submitted Successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate("/problems");
        })
        .catch((err) => {
          setLoadingSpinner(false);
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
    });
  };

  const modules = { formula: true };
  modules.toolbar = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    ["formula"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
  ];

  const formats = [
    "header",
    "font",
    "background",
    "code",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "script",
    "align",
    "direction",
    "link",
    "image",
    "code-block",
    "formula",
    "video",
  ];

  useEffect(() => {
    const enableMathQuillFormulaAuthoring = mathquill4quill({ Quill });
    enableMathQuillFormulaAuthoring(reactQuill.current);
  }, []);

  return (
    <div className="addproblem-container">
      <ToastContainer />
      <Form onSubmit={onFormSubmit} autoComplete="off">
        <Form.Group>
          <Form.Label className="add-problem-title">Problem Name</Form.Label>
          <Form.Control
            type="text"
            name="problemName"
            value={problemName}
            placeholder="Problem Name"
            onChange={(e) => {
              setProblemName(e.target.value);
            }}
            required
          />
        </Form.Group>
        <Form.Group>
          <div>
            <Form.Label className="add-problem-statement">
              Problem Statement
            </Form.Label>
            <span style={{ float: "right", margin: "10px 0px" }}>
              <FontAwesomeIcon icon={faInfoCircle} style={{ color: "white" }} />{" "}
              <a
                target="_blank"
                style={{ textDecoration: "none", color: "white" }}
                href="https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference"
              >
                Guide For Math Formulas
              </a>
            </span>
          </div>
          <ReactQuill
            ref={reactQuill}
            modules={modules}
            formats={formats}
            theme="snow"
            value={problemStatement}
            onChange={handleChange}
            style={{
              wordBreak: "break-all",
              backgroundColor: "#fff",
              marginBottom: "20px",
            }}
            placeholder="Click here to insert text..."
          />
        </Form.Group>
        <Form.Group>{children}</Form.Group>
        <Form.Group>
          <div style={{ display: "flex", gap: "15px" }}>
            <Button
              variant="contained"
              color="primary"
              style={{
                color: "#fff",
                width: "80%",
              }}
              size="large"
              onClick={addTestcase}
              type="button"
            >
              <FontAwesomeIcon icon={faPlus} /> &nbsp; Add Sample Testcase
            </Button>
            <Button
              variant="contained"
              color="secondary"
              style={{ color: "#fff", width: "20%" }}
              size="large"
              onClick={handleDelete}
              disabled={children.length === 0}
              type="button"
            >
              Delete &nbsp; <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label className="addproblem-explanation">
            Explanation
          </Form.Label>
          <Form.Control
            type="text"
            name="explanation"
            value={explanation}
            placeholder="Explanation"
            onChange={(e) => {
              setExplanation(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group>
          <ReactButton
            variant="warning"
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
            type="button"
            style={{ margin: "15px 0px" }}
          >
            Add Tags
          </ReactButton>
          <Collapse in={open}>
            <div style={{ marginBottom: "15px" }}>
              {tags.map((tag) => (
                <a
                  key={tag}
                  className="createproblem-tags-btn"
                  style={{
                    backgroundColor: currentTags.includes(tag)
                      ? "#17a2b8"
                      : "#fff",
                    padding: "10px",
                    textDecoration: "none",
                  }}
                  onClick={() => handleTagSelect(tag)}
                >
                  <span
                    className="text-sm text-gray"
                    style={{
                      color: currentTags.includes(tag) ? "#fff" : "#000",
                      fontSize: "13px",
                    }}
                  >
                    {tag}
                  </span>
                </a>
              ))}
            </div>
          </Collapse>
        </Form.Group>
        <Form.Group>
          <Row>
            <Col>
              <Form.Control
                placeholder="Time (in Seconds)"
                type="number"
                step="any"
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </Col>
            <Col>
              <Form.Control
                placeholder="Memory (in MegaBytes)"
                type="number"
                onChange={(e) => setMemory(e.target.value)}
                required
              />
            </Col>
          </Row>
        </Form.Group>
        <Form.Label className="add-problem-statement">Test Cases</Form.Label>
        <Form.Group>{children2}</Form.Group>
        <Form.Group>
          <div style={{ display: "flex", gap: "15px" }}>
            <Button
              variant="contained"
              color="primary"
              style={{
                color: "#fff",
                width: "80%",
              }}
              size="large"
              onClick={addTestcase2}
              type="button"
            >
              <FontAwesomeIcon icon={faPlus} /> &nbsp; Add Testcase
            </Button>
            <Button
              variant="contained"
              color="secondary"
              style={{ color: "#fff", width: "20%" }}
              size="large"
              onClick={handleDelete2}
              disabled={children2.length === 0}
              type="button"
            >
              Delete &nbsp; <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={problemStatement === "" || currentTags.length === 0}
            style={{ width: "150px", margin: "10px 0px" }}
          >
            {loadingSpinner ? (
              <CircularProgress size={"23px"} style={{ color: "white" }} />
            ) : (
              "Submit"
            )}
            &nbsp;
            {loadingSpinner ? null : <FontAwesomeIcon icon={faPaperPlane} />}
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default AddProblem;
