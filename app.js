const express = require("express")
const {getTopics} = require("./controllers/topics.controllers")
const {getArticleById, patchArticalById} = require("./controllers/articles.controllers")
const {serverErrorHandler, psqlErrorHandler, customErrorHandler} = require("./controllers/errors.controllers")

const app = express()
app.use(express.json())

// Controllers
// Topics
app.get("/api/topics", getTopics)

// Articles
app.get("/api/articles/:article_id", getArticleById)
app.patch("/api/articles/:article_id", patchArticalById)


// Errors

app.all("/*", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"})
})

app.use(customErrorHandler)
app.use(psqlErrorHandler)
app.use(serverErrorHandler)


module.exports = app