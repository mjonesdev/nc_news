const {fetchArticleById, updateArticleById, fetchAllArticles} = require("../models/articles.models")

exports.getAllArticles = (req, res, next) => {
    fetchAllArticles().then(articles => {
        res.status(200).send({articles})
    }).catch(next)
}

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
    }).catch(next)
}