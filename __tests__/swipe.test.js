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
    latitude: -6.174054416454042,
    longitude: 106.82663976097285,
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
                console.log(resp.body, "==48==")
                access_token = resp.body.access_token
                done()
            })
    })

    test("get users list, status 200", (done) => {
        request(app)
            .get("/users")
            .set({ access_token })
            .then(resp => {
                console.log(resp.body, "===line58===")
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
                console.log(resp.body)
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
                console.log(resp.body)
                console.log(resp.status)
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
                console.log(resp.body, "==token==")
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
                console.log(resp.body)
                expect(resp.status).toBe(500)
                expect(resp.body.message).toBe('Internal Server Error')
                done()
            })
    })
})