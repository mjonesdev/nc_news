const express = require("express")
const {getTopics} = require("./controllers/topics.controllers")
const {getArticleById, patchArticleById, getAllArticles} = require("./controllers/articles.controllers")
const {getUsers} = require("./controllers/users.controllers.js")
const {getCommentsByArticleId} = require("./controllers/comments.controllers")
const {serverErrorHandler, psqlErrorHandler, customErrorHandler} = require("./controllers/errors.controllers")

const app = express()
app.use(express.json())

// Controllers
// Topics
app.get("/api/topics", getTopics)

// Articles
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id", getArticleById)
app.patch("/api/articles/:article_id", patchArticleById)


// Users
app.get("/api/users", getUsers)

// Comments
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

// Errors

app.all("/*", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"})
})

app.use(customErrorHandler)
app.use(psqlErrorHandler)
app.use(serverErrorHandler)


module.exports = app