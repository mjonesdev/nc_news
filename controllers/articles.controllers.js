const {fetchArticleById} = require("../models/articles.models")

exports.getArticleById = (req, res, next) => {
    const id = req.params.article_id
    fetchArticleById(id).then(article => {
        console.log(article)
        res.status(200).send({article})
    }).catch(next)
}