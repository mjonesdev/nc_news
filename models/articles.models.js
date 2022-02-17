const db = require('../db/connection');

exports.fetchAllArticles = (sorted_by = "created_at", order = "desc", topic) => {
    if (["author", "title", "article_id", "topic", "created_at", "votes"].includes(sorted_by) && ['desc', 'asc'].includes(order)) {
        const queryValues = []
        let queryString = 'SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, COUNT(comment_id) AS comment_count FROM articles AS a LEFT JOIN comments USING (article_id)'
        if (topic) {
            queryValues.push(topic)
            queryString += 'WHERE topic=$1 '
        }
        queryString += `GROUP BY a.article_id ORDER BY ${sorted_by} ${order};`
        return db.query(queryString, queryValues)
            .then(({
                rows
            }) => rows)
    } else {
        return Promise.reject({
            status: "051"
        })
    }

}

exports.fetchArticleById = (id) => {
    return db.query(`SELECT articles.*, COUNT(comment_id) AS comment_count
                    FROM articles
                    LEFT JOIN comments USING (article_id)
                    WHERE article_id = $1
                    GROUP BY articles.article_id;`, [id])
        .then(({rows}) => {
            rows[0].comment_count = Number(rows[0].comment_count)
            return rows[0]
        })
}

exports.updateArticleById = (id, {
    inc_votes
}) => {
    return db.query(`UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING *;`, [inc_votes, id])
        .then(({
            rows
        }) => {
            if (rows.length === 0) return Promise.reject({
                status: "001"
            })
            return rows[0]
        })
}