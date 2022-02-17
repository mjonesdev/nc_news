const {fetchArticleById, updateArticleById, fetchAllArticles} = require("../models/articles.models")
const {checkExists} = require("../db/helpers/utils")

exports.getAllArticles = (req, res, next) => {
    const sorted_by = req.query.sorted_by
    const order = req.query.order
    const topic = req.query.topic
    if (topic) {
        checkExists("articles", "topic", topic)
            .then(() => {
                fetchAllArticles(sorted_by, order, topic)
                    .then((articles) => {
                        res.status(200).send({articles})
                    })
            }).catch(next)
    } else {
        fetchAllArticles(sorted_by, order)
            .then((articles) => {
                res.status(200).send({articles})
            }).catch(next)
    }


}

exports.getArticleById = (req, res, next) => {
    const id = req.params.article_id
    fetchArticleById(id).then(article => {
        res.status(200).send({article})
    }).catch(next)
}

exports.patchArticleById = (req, res, next) => {
    const id = req.params.article_id
    const body = req.body
    updateArticleById(id, body).then(article => {
        res.status(200).send({article})
    }).catch(next)
}