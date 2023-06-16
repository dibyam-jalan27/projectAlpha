const express = require('express');
const app = express();
const errrMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');

app.use(express.json());

//Route imports
const userRoute = require('./Routes/userRoutes');


app.use("/api/v1", userRoute);

//Error Middleware
app.use(errrMiddleware);

module.exports = app;