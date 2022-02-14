const request = require("supertest");
const app = require("../app");
const express = require("express");
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