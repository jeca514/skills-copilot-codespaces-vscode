// create web server
// create API to get all comments
// create API to get comments by id
// create API to add comments
// create API to delete comments
// create API to update comments

// load the express module
const express = require("express");

// create the reference of express module
const app = express();

// load the cors module
const cors = require("cors");
// enable the cors module
app.use(cors());

// load the path module
const path = require("path");

// load the body-parser module and parse the data
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// load the mongoose module
const mongoose = require("mongoose");

// connect to database
mongoose.connect("mongodb://localhost:27017/tcsmean", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => console.log("connected"))
    .catch(err => console.log(err));

// connect the database
mongoose.Promise = global.Promise;

// get the connection object
const dbConnect = mongoose.connection;

// load the schema
const commentSchema = mongoose.Schema({
    _id: Number,
    name: String,
    comment: String
});

// map the schema with the collection
const Comment = mongoose.model("", commentSchema, "Comment");

// create the get request
app.get("/comments", (req, res) => {
    Comment.find().then(result => {
        res.json(result);
    }).catch(err => console.log(err));
});

// get comment by id
app.get("/comments/:id", (req, res) => {
    let id = req.params.id;
    Comment.find({ _id: id }).then(result => {
        res.json(result);
    }).catch(err => console.log(err));
});

// add comment
app.post("/comments", (req, res) => {
    let comment = new Comment({
        _id: req.body._id,
        name: req.body.name,
        comment: req.body.comment
    });

    Comment.insertMany(comment).then(result => {
        res.json({ message: "New Comment Added" });
    }).catch(err => console.log(err));
});

// update comment
app.put("/comments/:id", (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    let comment = req.body.comment;

    Comment.updateOne({ _id: id }, { $set: { name: name, comment: comment