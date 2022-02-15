const db = require('../db/connection');

exports.fetchAllArticles = () => {
    return db.query(`SELECT author, title, article_id, topic, created_at, votes
                    FROM articles
                    ORDER BY created_at desc;`)
        .then(({rows}) => rows)
}

exports.fetchArticleById = (id) => {
    return db.query("SELECT * FROM articles WHERE article_id=$1;", [id])
        .then(({rows}) => {
            if (rows.length === 0) return Promise.reject({msg: "Resource not found"})
            return rows[0]
        })
}

exports.updateArticleById = (id, {inc_votes}) => {
    return db.query(`UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING *;`, [inc_votes, id])
        .then(({rows}) => {
            if (rows.length === 0) return Promise.reject({msg: "Resource not found"})
            return rows[0]
        })
}