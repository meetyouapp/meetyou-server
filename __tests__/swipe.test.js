const app = require("../app.js")
const request = require("supertest")
const { User, Like, sequelize } = require("../models")
const { queryInterface } = sequelize

const userData = [
    {
        username: "initesting",
        email: "testing@mail.com",
        password: "12345678",
        age: 19,
        gender: "male",
        photo:
          "https://t1.daumcdn.net/news/202003/03/starnews/20200303124859622yvkl.jpg",
        about: "hai cewe",
        latitude: -6.174054416454042,
        longitude: 106.82663976097285,
        interestId: [1, 3, 7],
    },
    {
        username: "initesting2",
        email: "testing2@mail.com",
        password: "12345678",
        age: 19,
        gender: "female",
        photo:
          "https://t1.daumcdn.net/news/202003/03/starnews/20200303124859622yvkl.jpg",
        about: "hai cowo",
        latitude: -6.174054416454042,
        longitude: 106.82663976097285,
        interestId: [1, 3, 7],
    },
]

let payloadA = {}
let payloadB = {}

beforeAll((done) => {
    User.create(userData[0])
        .then(resp => {
            payloadA = resp
            User.create(userData[1])
            .then(resp => {
                payloadB = resp
                done();
        })
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

describe("GET /users [success case]", () => {
    let access_token = ''

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

    test("get users list, status 200", (done) => {
        request(app)
            .get("/users")
            .set({ access_token })
            .then(resp => {
                expect(resp.status).toBe(200)
                // expect(resp.body).toBe([])
                expect(Array.isArray(resp.body)).toBe(true);
                done()
            })
    })
})

describe("POST /swiperight [success case]", () => {
    let access_token = ''

    const payloadLogin = {
        email: "testing@mail.com",
        password: "12345678"
    }

    const payloadSwipeRight = {
        targetId: 2
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

    test("swipe right, status 201", (done) => {
        request(app)
            .post("/swiperight")
            .set({ access_token })
            .send(payloadSwipeRight)
            .then(resp => {
                expect(resp.status).toBe(201)
                expect(resp.body).toHaveProperty("id")
                expect(resp.body).toHaveProperty("authorStatus")
                expect(resp.body).toHaveProperty("authorId")
                expect(resp.body).toHaveProperty("targetStatus")
                expect(resp.body).toHaveProperty("targetId", payloadSwipeRight.targetId)
                done()
            })
    })

})

describe("POST /swiperight [success case] status 200", () => {
    let access_token = ''

    beforeEach((done) => {
        request(app)
        .post("/login")
        .send({email: payloadA.email, password: "12345678"})
        .then(resp => {
            access_token = resp.body.access_token
            request(app)
                .post("/swiperight")
                .set({ access_token })
                .send({targetId: payloadB.id})
                .then(() => {
                    done()
                })
        })
    })

    afterEach((done) => {
        Like.destroy({
            where: {
                authorId: payloadA.id,
                targetId: payloadB.id
            }
        })
        .then(() => done())
    })

    test("swipe right, status 200", (done) => {
        request(app)
        .post("/login")
        .send({email: payloadB.email, password: "12345678"})
        .then(resp => {
            access_token = resp.body.access_token
            request(app)
            .post("/swiperight")
            .set({ access_token })
            .send({targetId: payloadA.id})
            .then(resp => {
                expect(resp.status).toBe(200)
                expect(resp.body).toHaveProperty("id")
                expect(resp.body).toHaveProperty("message")
                expect(resp.body).toHaveProperty("authorId")
                expect(resp.body).toHaveProperty("targetId")
                expect(resp.body).toHaveProperty("urlVideoCall")
                done()
            })
        })
    })
})

describe("POST /swipeleft [success case]", () => {
    let access_token = ''

    const payloadLogin = {
        email: "testing@mail.com",
        password: "12345678"
    }

    const payloadSwipeLeft = {
        targetId: 2
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

    test("swipe left, status 201", (done) => {
        request(app)
            .post("/swipeleft")
            .set({ access_token })
            .send(payloadSwipeLeft)
            .then(resp => {
                expect(resp.status).toBe(201)
                expect(resp.body).toHaveProperty("id")
                expect(resp.body).toHaveProperty("authorStatus")
                expect(resp.body).toHaveProperty("authorId")
                expect(resp.body).toHaveProperty("targetStatus")
                expect(resp.body).toHaveProperty("targetId", payloadSwipeLeft.targetId)
                done()
            })
    })

})

describe("POST /swipeleft [success case] status 200", () => {
    let access_token = ''

    beforeEach((done) => {
        request(app)
        .post("/login")
        .send({email: payloadA.email, password: "12345678"})
        .then(resp => {
            access_token = resp.body.access_token
            request(app)
                .post("/swipeleft")
                .set({ access_token })
                .send({targetId: payloadB.id})
                .then(() => {
                    done()
                })
        })
    })

    test("swipe left, status 200", (done) => {
        request(app)
        .post("/login")
        .send({email: payloadB.email, password: "12345678"})
        .then(resp => {
            access_token = resp.body.access_token
            request(app)
            .post("/swipeleft")
            .set({ access_token })
            .send({targetId: payloadA.id})
            .then(resp => {
                expect(resp.status).toBe(200)
                expect(resp.body).toHaveProperty("id")
                expect(resp.body).toHaveProperty("authorStatus")
                expect(resp.body).toHaveProperty("authorId")
                expect(resp.body).toHaveProperty("targetStatus")
                done()
            })
        })
    })
})

describe("GET /users [fail case]", () => {
    let access_token = ''

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

    test("failed get list users, status 500", (done) => {

        User.findAll = jest.fn().mockRejectedValue("Error")

        request(app)
            .get("/users")
            .set({ access_token })
            .then(resp => {
                expect(resp.status).toBe(500)
                expect(resp.body.message).toBe('Internal Server Error')
                done()
            })
    })
})