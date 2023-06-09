const express = require('express');
const app = express();
const errrMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

//CORS
app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));

//Route imports
const userRoute = require('./Routes/userRoutes');
const problemRoute = require('./Routes/problemRoutes');
const submissionRoute = require('./Routes/submissionRoutes');
const testcaseRoute = require('./Routes/testcaseRoutes');
const submissionRoute2 = require('./Routes/submissionRoute2');

app.use("/api/v1", userRoute);
app.use("/api/v1", problemRoute);
app.use("/api/v1", submissionRoute);
app.use("/api/v1", testcaseRoute);
app.use("/api/v1", submissionRoute2);

//Error Middleware
app.use(errrMiddleware);

// Making Build Folder as Public 
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


module.exports = app;