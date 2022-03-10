const db = require('../db/connection');
const {fetchArticleById} = require("./articles.models")

exports.fetchAllCommentsById = (id) => {
    return db.query(`SELECT c.comment_id, c.votes, c.created_at, c.author, c.body FROM comments AS c 
    LEFT JOIN articles USING(article_id) WHERE article_id=$1;`, [id])
        .then(({rows}) => {
            return rows
        })
}

exports.insertComment = (id, requestBody) => {
    const {username, body} = requestBody
    return db.query(`INSERT INTO comments (body, author, article_id) 
                    VALUES ($1, $2, $3) RETURNING *;`, [body, username, id])
        .then(({rows}) => {
            return rows[0]
        })
}

exports.removeCommentById = (id) => {
    return db.query("DELETE FROM comments WHERE comment_id=$1;", [id])
}

exports.updateCommentById = (id, {inc_votes}) => {
    return db.query('UPDATE comments SET votes=votes+$1 WHERE comment_id=$2 RETURNING *', [inc_votes, id])
        .then(({rows}) => {
            if (rows.length === 0 ) return Promise.reject({ status: "001"})
            return rows[0]
        })
}