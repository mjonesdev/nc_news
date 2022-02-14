const {fetchArticleById, updateArticleById} = require("../models/articles.models")

exports.getArticleById = (req, res, next) => {
    const id = req.params.article_id
    fetchArticleById(id).then(article => {
        res.status(200).send({article})
    }).catch(next)
}

exports.patchArticalById = (req, res, next) => {
    const id = req.params.article_id
    const body = req.body
    updateArticleById(id, body).then(article => {
        res.status(200).send({article})
    }).catch(err => {
        console.log(err)
        next(err)
    })
}