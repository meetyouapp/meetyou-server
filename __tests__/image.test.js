const app = require("../app.js")
const request = require("supertest")
const { User, Image } = require("../models")

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

describe("POST /image [success case]", () => {
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

    const payloadImage = {
        imgUrl: "https://t1.daumcdn.net/news/202003/03/starnews/20200303124859622yvkl.jpg",
        authorId: id
    }

    test("post image, status 201", (done) => {
        request(app)
            .post("/image")
            .set({ access_token })
            .set({ id })
            .send(payloadImage)
            .then(resp => {
                expect(resp.status).toBe(201)
                expect(resp.body).toHaveProperty('id')
                expect(resp.body).toHaveProperty('imgUrl')
                expect(resp.body).toHaveProperty('authorId')
                done()
            })
    })
})

describe("POST /image [failed case]", () => {
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

    const payloadImage = {
        imgUrl: null,
        authorId: id
    }

    test("post image, status 500", (done) => {
        request(app)
            .post("/image")
            .set({ access_token })
            .set({ id })
            .send(payloadImage)
            .then(resp => {
                expect(resp.status).toBe(500)
                expect(resp.body.errors[0]).toHaveProperty('message')
                done()
            })
    })
})