const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const {checkExists} = require("../db/helpers/utils")

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("/api/topics", () => {
    test("200: returns an object with an array of topic objects", () => {
        return request(app).get("/api/topics")
            .expect(200)
            .then(({body: {topics}}) => {
                expect(topics).toHaveLength(3)
                topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String),
                        })
                    )
                })
            })
    })
    test("404: incorrect path when passed an incorrect API endpoint", () => {
        return request(app).get("/api/notAnEndpoint")
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Endpoint not found")
            })
    })
})

describe("/api/articles", () => {
    describe("GET", () => {
        test("200: returns an object with properties of the article when passed an ID", () => {
            return request(app).get("/api/articles/1")
                .expect(200)
                .then(({body: {article}}) => {
                    expect(article).toEqual(expect.objectContaining({
                        author: "butter_bridge",
                        title: "Living in the shadow of a great man",
                        article_id: 1,
                        body: "I find this existence challenging",
                        topic: "mitch",
                        created_at: expect.any(String),
                        votes: 100
                    }))
                })
        })
        test("400: bad request response when passing an article ID that is not a number", () => {
            return request(app).get("/api/articles/notANumber")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Article ID passed is not a number")
                })
        })
        test("404: should return an article not found msg when passed a number that is not an article ID", () => {
            return request(app).get("/api/articles/50")
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Article ID passed is not a number")
                })
        })
        test("200: returns the previous object but with the addition of a comment_count property", () => {
            return request(app).get("/api/articles/1")
                .expect(200)
                .then(({body: {article}}) => {
                    expect(article).toEqual(expect.objectContaining({
                        author: "butter_bridge",
                        title: "Living in the shadow of a great man",
                        article_id: 1,
                        body: "I find this existence challenging",
                        topic: "mitch",
                        created_at: expect.any(String),
                        votes: 100,
                        comment_count: 11
                    }))
                })
        })
        test("200: returns all articles in decending date order", () => {
            return request(app).get("/api/articles")
                .expect(200)
                .then(({body: {articles}}) => {
                    expect(articles).toHaveLength(12)
                    articles.forEach(article => {
                        expect(article).toEqual(expect.objectContaining({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number)
                        }))
                    })
                    expect(articles).toBeSortedBy('created_at', {
                        descending: true,
                    });
                })
        })
        test("200: returns an object with the comments_count now included in the properties of the article", () => {
            return request(app).get("/api/articles")
                .expect(200)
                .then(({body: {articles}}) => {
                    expect(articles).toHaveLength(12)
                    articles.forEach(article => {
                        expect(article).toEqual(expect.objectContaining({
                            comment_count: expect.any(String)
                        }))
                    })
                })
        })
        test("200: returns the articles sorted by the passed query, defaulting to date", () => {
            return request(app).get("/api/articles?sorted_by=votes")
                .expect(200)
                .then(({body: {articles}}) => {
                    expect(articles).toBeSortedBy('votes', {
                        descending: true
                    })
                })
        })
        test("400: returns a bad request msg when passed a column title that does not exist", () => {
            return request(app).get("/api/articles?sorted_by=notAColumn")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("sorted_by and/or order query not valid")
                })
        })
        test("200: returns the articles back ordered either desc or asc per passed query, default to desc", () => {
            return request(app).get("/api/articles?order=asc")
                .expect(200)
                .then(({body: {articles}}) => {
                    expect(articles).toBeSortedBy("created_at")
                })
        })
        test("400: returns a bad reequest when passed an incorrect order query", () => {
            return request(app).get("/api/articles?order=notAnOrderOption")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("sorted_by and/or order query not valid")
                })
        })
        test("200: returns the articles filtered by the topic property passed on a query", () => {
            return request(app).get("/api/articles?topic=mitch")
                .expect(200)
                .then(({body: {articles}}) => {
                    articles.forEach(article => {
                        expect(article).toEqual(expect.objectContaining({
                            topic: "mitch"
                        }))
                    })
                })
        })
        test("404: returns a err msg stating the resource is not found when passed a topic that does not exist", () => {
            return request(app).get("/api/articles?topic=notAKnownTopic")
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("notAKnownTopic not found in topic")
                })
        })
        describe("PATCH", () => {
            test("200: should return the updated object when passed a positive number", () => {
                const data = {inc_votes: 1}
                return request(app).patch("/api/articles/1")
                    .send(data)
                    .expect(200)
                    .then(({body: {article}}) => {
                        expect(article).toEqual(expect.objectContaining({
                            author: "butter_bridge",
                            title: "Living in the shadow of a great man",
                            article_id: 1,
                            body: "I find this existence challenging",
                            topic: "mitch",
                            created_at: expect.any(String),
                            votes: 101
                        }))
                    })
            })
            test("200: should return the updated object when passed a negative number", () => {
                const data = {inc_votes: -2}
                return request(app).patch("/api/articles/1")
                    .send(data)
                    .expect(200)
                    .then(({body: {article}}) => {
                        expect(article).toEqual(expect.objectContaining({
                            author: "butter_bridge",
                            title: "Living in the shadow of a great man",
                            article_id: 1,
                            body: "I find this existence challenging",
                            topic: "mitch",
                            created_at: expect.any(String),
                            votes: 98
                        }))
                    })
            })
            test("400: should send back a bad request message when passed body information that does not include the required information", () => {
                const data = {notTheRightKey: "test"}
                return request(app).patch("/api/articles/1")
                    .send(data)
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe("Bad request: required data not supplied correctly")
                    })
            })
            test("404: return that the article has not been found if passed correct data but an ID that does not exist in the database", () => {
                const data = {inc_votes: 1}
                return request(app).patch("/api/articles/50")
                    .send(data)
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe("Article not found")
                    })
            })
        })
    })
})

describe('/api/articles/:article_id/comments', () => {
    describe('GET', () => {
        test("200: should respond with an array of the comments for the article with the passed ID", () => {
            return request(app).get('/api/articles/1/comments')
                .expect(200)
                .then(({body: {comments}}) => {
                    expect(comments).toHaveLength(11)
                    comments.forEach(comment => {
                        expect(comment).toEqual(expect.objectContaining({
                            comment_id: expect.any(Number),
                            body: expect.any(String),
                            votes: expect.any(Number),
                            author: expect.any(String),
                            created_at: expect.any(String),
                        }))
                    })
                })
        })
        test("400: should return a bad request response when passed an ID that is not a number", () => {
            return request(app).get('/api/articles/notANumber/comments')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Article ID passed is not a number")
                })
        })
        test("404: should return an article does not exist message if passed an ID that is not in use", () => {
            return request(app).get('/api/articles/50/comments')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("50 not found in article_id")
                })
        })
        test("200: should return an empty array if there are no comments on an existing article", () => {
            return request(app).get('/api/articles/2/comments')
                .expect(200)
                .then(({body: {comments}}) => {
                    expect(comments.length === 0)
                })
        })
    });
});

describe("/api/users", () => {
    describe("GET", () => {
        test("200: get back an array of objects", () => {
            return request(app).get("/api/users")
                .expect(200)
                .then(({body: {users}}) => {
                    expect(users).toHaveLength(4)
                    users.forEach(user => {
                        expect.objectContaining({
                            username: expect.any(String)
                        })
                    })
                    expect(users[0]).toEqual({username: 'butter_bridge'})
                })
        })
    })
})

describe("database utilities", () => {
    test("404: should return a not found error msg when value not found in the passed table's column", () => {
        return checkExists("articles", "article_id", 50)
            .catch(error => {
                expect(error.msg).toBe("50 not found in article_id")
            })
    })
    test("200: returns a successful promise when the element is found", () => {
        return checkExists("articles", "article_id", 1)
            .then(response => response)
    })
})