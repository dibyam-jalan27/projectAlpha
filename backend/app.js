const express = require('express');
const app = express();
const errrMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));

//Route imports
const userRoute = require('./Routes/userRoutes');
const problemRoute = require('./Routes/problemRoutes');

app.use("/api/v1", userRoute);
app.use("/api/v1", problemRoute);

//Error Middleware
app.use(errrMiddleware);

module.exports = app;