const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

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
                    expect(body.msg).toBe("Article ID passed not a number")
                })
        })
        test("404: should return an article not found msg when passed a number that is not an article ID", () => {
            return request(app).get("/api/articles/50")
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("No article found with that ID")
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
    })
    describe("PATCH", () => {
        test("200: should return the updated object when passed a positive number", () => {
            const data = { inc_votes: 1 }
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
            const data = { inc_votes: -2 }
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
            const data = { inc_votes: 1 }
            return request(app).patch("/api/articles/50")
                .send(data)
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("No article found with that ID")
            })
        })
    })
})

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