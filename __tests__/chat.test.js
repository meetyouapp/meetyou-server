const app = require("../app.js")
const request = require("supertest")
const { User, Chat, sequelize } = require("../models")
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
    User.destroy({where: {email: userData2.email}})
        .then(() => done())
        .catch((err) => done(err))
});

describe("GET /chat [success case]", () => {
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

    const payloadChat = {
        chatListAuthor: [],
        chatListTarget: []
    }

    test("get chat list, status 200", (done) => {
        request(app)
            .get("/chat")
            .set({ access_token })
            .set(payloadChat)
            .then(resp => {
                expect(resp.status).toBe(200)
                // expect(resp.body).toBe([])
                expect(Array.isArray(resp.body.chatListAuthor)).toBe(true);
                expect(Array.isArray(resp.body.chatListTarget)).toBe(true);
                done()
            })
    })
})

describe("GET /chat [failed case]", () => {
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

    const payloadChat = {
        chatListAuthor: [],
        chatListTarget: []
    }

    test("failed get chat list, status 500", (done) => {

        Chat.findAll = jest.fn().mockRejectedValue("Error")

        request(app)
            .get("/chat")
            .set({ access_token })
            .send(payloadChat)
            .then(resp => {
                expect(resp.status).toBe(500)
                expect(resp.body.message).toBe('Internal Server Error')
                done()
            })
    })
})