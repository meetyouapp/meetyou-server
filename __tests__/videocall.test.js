const app = require("../app.js")
const request = require("supertest")
const { User, sequelize } = require("../models")
const { queryInterface } = sequelize

const userData2 = {
    username: "initesting",
    email: "testing@mail.com",
    password: "12345678",
    age: 19,
    gender: "male",
    photo:
      "https://t1.daumcdn.net/news/202003/03/starnews/20200303124859622yvkl.jpg",
    about: "hai cewe",
    interestId: [1, 3, 7],
};

beforeAll((done) => {
    User.create(userData2)
        .then((_) => {
        done();
    })
        .catch((err) => {
        done(err);
    });
});

afterAll((done) => {
    User.destroy({truncate: true, cascade: true})
        .then(() => done())
        .catch((err) => done(err))
});

describe("POST /videocall [success case]", () => {
    let access_token = ''

    const payloadLogin = {
        email: "testing@mail.com",
        password: "12345678"
    }

    const payloadVideoCall = {
        name: "meetyou"
    }

    beforeEach((done) => {
        request(app)
            .post("/login")
            .send(payloadLogin)
            .then(resp => {
                console.log(resp.body)
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
        email: "testing@mail.com",
        password: "12345678"
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
        email: "testing@mail.com",
        password: "12345678"
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
        email: "testing@mail.com",
        password: "12345678"
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