import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import AceEditor from "react-ace";
import {
  InputLabel,
  FormControl,
  Select,
  Switch,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import "./codeEditor.css";
import * as ace from "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/ext-language_tools";
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.23.1/src-noconflict/");
ace.config.setModuleUrl(
  "ace/mode/python",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.23.1/src-noconflict/mode-python.js"
)
ace.config.setModuleUrl(
  "ace/mode/c_cpp",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.23.1/src-noconflict/mode-c_cpp.js"
)
ace.config.setModuleUrl(
  "ace/mode/java",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.23.1/src-noconflict/mode-java.js"
)
const CodeEditor = ({
  language,
  handleLanguageSelect,
  darkMode,
  handleModeChange,
  onCodeChange,
  run,
  submit,
  runLoading,
  submitLoading,
}) => {
  const languageList = ["C", "C++", "Java", "Python"];

  const handleThemeChange = (e) => {
    handleModeChange(e.target.checked);
  };

  const getLanguage = () => {
    return language === "C" || language === "C++"
      ? "c_cpp"
      : language === "Java"
      ? "java"
      : "python";
  };

  const getLabel = () => {
    return "Switch to " + (darkMode === false ? "Dark" : "Light") + " Mode";
  };

  return (
    <div className="code-editor-container">
      <div className="code-editor-details-container">
        <div className="code-editor-language-wrapper">
          <FormControl variant="outlined" sx={{ margin: "5px", maxWidth: 200 }}>
            <InputLabel htmlFor="outlined-age-native-simple">
              Language
            </InputLabel>
            <Select
              native
              value={language}
              onChange={handleLanguageSelect}
              label="Language"
              inputProps={{
                name: "age",
                id: "outlined-age-native-simple",
              }}
            >
              {languageList.map((curLanguage, i) => (
                <option value={curLanguage} key={i}>
                  {curLanguage}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="code-editor-btn">
          <div className="code-editor-runcode-btn">
            <Button
              variant="contained"
              color="primary"
              value="runcode"
              onClick={run}
              style={{ width: "120px" }}
              disabled={runLoading || submitLoading}
            >
              {runLoading === true ? (
                <CircularProgress size={"25px"} style={{ color: "white" }} />
              ) : (
                <span className="spanClass">
                  <PlayCircleOutlineIcon
                    style={{ marginRight: "5px", marginBottom: "-7px" }}
                  />
                  Run
                </span>
              )}
            </Button>
          </div>
          <div className="code-editor-submit-btn">
            <Button
              variant="contained"
              color="primary"
              value="submit"
              onClick={submit}
              style={{ width: "150px" }}
              disabled={submitLoading}
            >
              {submitLoading === true ? (
                <CircularProgress size={"25px"} style={{ color: "white" }} />
              ) : (
                <span>
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    style={{ marginRight: "10px" }}
                  />
                  Submit
                </span>
              )}
            </Button>
          </div>
        </div>
        <div className="code-editor-theme">
          <Switch
            checked={darkMode}
            onChange={handleThemeChange}
            name="darkMode"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
          <Chip
            label={getLabel()}
            variant="outlined"
            color="primary"
            style={{ fontSize: "medium", fontWeight: "600" }}
          />
        </div>
      </div>
      <div className="code-editor-wrapper">
        <AceEditor
          mode={getLanguage()}
          theme={darkMode === true ? "dracula" : "eclipse"}
          onChange={onCodeChange}
          name="UNIQUE_ID_OF_DIV"
          fontSize={17}
          width="100%"
          height="600px"
          highlightActiveLine={true}
          showGutter={true}
          wrapEnabled={true}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
