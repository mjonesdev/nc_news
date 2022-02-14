const db = require('../db/connection');

exports.fetchArticleById = (id) => {
    return db.query("SELECT * FROM articles WHERE article_id=$1;", [id])
        .then(({rows}) => {
            if (rows.length === 0) return Promise.reject({msg: "No article found with that ID"})
            return rows[0]
        })
}