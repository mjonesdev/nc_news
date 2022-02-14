const db = require('../db/connection');

exports.fetchAllArticles = () => {
    return db.query(`SELECT author, title, article_id, topic, created_at, votes
                    FROM articles
                    ORDER BY created_at desc;`)
        .then(({rows}) => rows)
}

exports.fetchArticleById = (id) => {
    return db.query(`SELECT articles.*, COUNT(comment_id) AS comment_count
                     FROM articles
                              LEFT JOIN comments USING (article_id)
                     WHERE article_id = $1
                     GROUP BY articles.article_id;`, [id])
        .then(({rows}) => {
            if (rows.length === 0) return Promise.reject({msg: "No article found with that ID"})
            rows[0].comment_count = Number(rows[0].comment_count)
            return rows[0]
        })
}

exports.updateArticleById = (id, {inc_votes}) => {
    return db.query(`UPDATE articles
                     SET votes=votes + $1
                     WHERE article_id = $2
                     RETURNING *`, [inc_votes, id])
        .then(({rows}) => {
            if (rows.length === 0) return Promise.reject({msg: "No article found with that ID"})
            return rows[0]
        })
}