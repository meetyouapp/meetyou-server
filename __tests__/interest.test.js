const app = require("../app.js")
const request = require("supertest")
const { User, UserInterest, sequelize } = require("../models")
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
    interestId: [1, 2, 3],
};

beforeAll((done) => {
    // User.create(userData2)
    //     .then((_) => {
    //     done();
    // })
    //     .catch((err) => {
    //     done(err);
    // });
    request(app)
    .post("/register")
    .send(userData2)
    .then(resp => {
        done()
    })
    
});

afterAll((done) => {
    User.destroy({where: {email: userData2.email}})
        .then(() => done())
        .catch((err) => done(err))
});

describe("GET ALL /interest [success case]", () => {

    test("get all interest, status 200", (done) => {
        request(app)
            .get("/interests")
            .then(resp => {
                expect(resp.status).toBe(200)
                expect(Array.isArray(resp.body)).toBe(true);
                done()
            })
    })
})

describe("GET /interest [success case]", () => {
    let access_token = ''
    let id = 0
    const payloadLogin = {
        email: "testing@mail.com",
        password: "12345678"
    }

    beforeEach((done) => {
        request(app)
            .post("/login")
            .send(payloadLogin)
            .then(resp => {
                id = resp.body.id
                access_token = resp.body.access_token
                done()
            })
    })

    test("get interest user, status 200", (done) => {
        request(app)
            .get("/interest")
            .set({ access_token })
            .set({ id })
            .then(resp => {
                expect(resp.status).toBe(200)
                expect(resp.body[0]).toHaveProperty('id')
                expect(resp.body[0]).toHaveProperty('interestId')
                expect(resp.body[0]).toHaveProperty('User')
                expect(resp.body[0]).toHaveProperty('Interest')
                done()
            })
    })
})

describe("GET /interest [fail case]", () => {
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

    test("failed get interest user, status 500", (done) => {

        UserInterest.findAll = jest.fn().mockRejectedValue("Error")

        request(app)
            .get("/interest")
            .set({ access_token })
            .then(resp => {
                expect(resp.status).toBe(500)
                expect(resp.body.message).toBe('Internal Server Error')
                done()
            })
    })
})