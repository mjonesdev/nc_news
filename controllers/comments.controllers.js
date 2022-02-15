const {fetchAllCommentsById, insertComment} = require("../models/comments.models")
const {checkExists} = require("../db/helpers/utils")

exports.getCommentsByArticleId = (req, res, next) => {
    const id = req.params.article_id
    Promise.all([fetchAllCommentsById(id), checkExists("articles", "article_id", id)])
        .then(([comments]) => {
            res.status(200).send({comments})
        }).catch(next)
}

exports.postComment = (req, res, next) => {
    const id = req.params.article_id
    const body = req.body
    checkExists("articles", "article_id", id)
        .then(() => {
            return insertComment(id, body)
        }).then(comment => {
            res.status(201).send({comment})
        }).catch(next)
}