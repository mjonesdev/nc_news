const express = require("express")
const {getTopics} = require("./controllers/topics.controllers")
const {serverErrorHandler} = require("./controllers/errors.controllers")

const app = express()
app.use(express.json())

// Controllers

app.get("/api/topics", getTopics)

// Errors

app.all("/*", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"})
})

app.use(serverErrorHandler)

app.listen(9090, () => {
    console.log("Listening on server 9090")
});

module.exports = app