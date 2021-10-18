const app = require("../app.js")
const request = require("supertest")

describe("POST /videocall [success case]", () => {
    let access_token = ''

    const payloadLogin = {
        email: "zayn@mail.com",
        password: "123456"
    }

    const payloadVideoCall = {
        name: "test123"
    }

    beforeEach((done) => {
        request(app)
            .post("/login")
            .send(payloadLogin)
            .then(resp => {
                access_token = resp.body.access_token
                done()
            })
    })

    test("create room return url, status 201", (done) => {
        request(app)
            .post("/videocall")
            .set({ access_token })
            .send(payloadVideoCall)
            .then(resp => {
                console.log(resp.body)
                console.log(resp.status)
                expect(resp.status).toBe(201)
                expect(resp.body).toHaveProperty("url", `https://meetyou.daily.co/${payloadVideoCall.name}`)
                done()
            })
    })
})

describe("POST /videocall [fail case]", () => {
    let access_token = ''

    const payloadLogin = {
        email: "zayn@mail.com",
        password: "123456"
    }

    const payloadVideoCall = {
        name: "test"
    }

    beforeEach((done) => {
        request(app)
            .post("/login")
            .send(payloadLogin)
            .then(resp => {
                access_token = resp.body.access_token
                done()
            })
    })

    test("create room return error, status 500", (done) => {
        request(app)
            .post("/videocall")
            .set({ access_token })
            .send(payloadVideoCall)
            .then(resp => {
                console.log(resp.body)
                console.log(resp.status)
                expect(resp.status).toBe(500)
                expect(resp.body.message).toEqual('Internal Server Error')
                done()
            })
    })
})



describe("GET /videocall/:name [success case]", () => {
    let access_token = ''
    let name = 'test'

    const payloadLogin = {
        email: "zayn@mail.com",
        password: "123456"
    }

    beforeEach((done) => {
        request(app)
            .post("/login")
            .send(payloadLogin)
            .then(resp => {
                access_token = resp.body.access_token
                done()
            })
    })

    test("find room with params name, status 200", (done) => {
        request(app)
            .get(`/videocall/${name}`)
            .set({ access_token })
            .then((resp) => {
                console.log(resp.body)
                console.log(resp.status)
                expect(resp.status).toBe(200)
                expect(resp.body).toHaveProperty("url", `https://meetyou.daily.co/${name}`)
                done()
            })
    })
})

describe("GET /videocall/:name [fail case]", () => {
    let access_token = ''
    let name = 'qweasd'

    const payloadLogin = {
        email: "zayn@mail.com",
        password: "123456"
    }

    beforeEach((done) => {
        request(app)
            .post("/login")
            .send(payloadLogin)
            .then(resp => {
                access_token = resp.body.access_token
                done()
            })
    })

    test("find room with params name, status 500", (done) => {
        request(app)
            .get(`/videocall/${name}`)
            .set({ access_token })
            .then((resp) => {
                console.log(resp.body)
                console.log(resp.status)
                expect(resp.status).toBe(500)
                expect(resp.body.message).toEqual("Internal Server Error")
                done()
            })
    })
})