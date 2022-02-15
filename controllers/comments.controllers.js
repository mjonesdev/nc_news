const {fetchAllCommentsById} = require("../models/comments.models")
const {checkExists} = require("../db/helpers/utils")

exports.getCommentsByArticleId = (req, res, next) => {
    const id = req.params.article_id
    Promise.all([fetchAllCommentsById(id), checkExists("articles", "article_id", id)])
        .then(([comments]) => {
            res.status(200).send({comments})
    }).catch(next)
}