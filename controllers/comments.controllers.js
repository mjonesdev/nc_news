const {fetchAllCommentsById} = require("../models/comments.models")

exports.getCommentsByArticleId = (req, res, next) => {
    const id = req.params.article_id
    fetchAllCommentsById(id).then(comments => {
        res.status(200).send({comments})
    }).catch(next)
}