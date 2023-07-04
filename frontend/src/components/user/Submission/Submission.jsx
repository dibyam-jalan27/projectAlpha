import React from "react";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import "./submission.css";

const Submission = ({submission}) => {
    return  (
        <div className="submission-container">
            <SyntaxHighlighter
                showLineNumbers={true}
                language={submission.language}
                style={atomDark}
                >
                {submission.code}
                </SyntaxHighlighter>
        </div>
    );
};

export default Submission;