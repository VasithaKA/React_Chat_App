const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const morgan = require('morgan');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Database config
const { mongoURI } = require('./config/database')
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.log('MogoDB Connected...'))
    .catch(err => console.log(err))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes require
const conversationRoutes = require("./api/routes/conversations")

// Routes which should handle requests
app.use("/api/conversations", conversationRoutes)

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;