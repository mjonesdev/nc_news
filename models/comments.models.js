const db = require('../db/connection');
const {fetchArticleById} = require("./articles.models")

exports.fetchAllCommentsById = (id) => {
    const commentQuery = db.query(`SELECT c.comment_id, c.votes, c.created_at, c.author, c.body FROM comments AS c 
    LEFT JOIN articles USING(article_id) WHERE article_id=$1;`, [id])
    return Promise.all([commentQuery, fetchArticleById(id)])
        .then((response) => {
            return response[0].rows
        })
}