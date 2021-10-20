const app = require("../app.js")
const request = require("supertest")
const { User, sequelize } = require("../models")

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

describe("GET /profile/:id [success case]", () => {
    let access_token = ''

    const payloadLogin = {
        email: "testing@mail.com",
        password: "12345678"
    }
    const userId = 2

    beforeEach((done) => {
        request(app)
            .post("/login")
            .send(payloadLogin)
            .then(resp => {
                access_token = resp.body.access_token
                done()
            })
    })

    test("get profile detail by id from params, status 200", (done) => {
        request(app)
            .get(`/profile/${userId}`)
            .set({ access_token })
            .then(resp => {
                expect(resp.status).toBe(200)
                expect(resp.body).toHaveProperty("id")
                expect(resp.body).toHaveProperty("username")
                expect(resp.body).toHaveProperty("email")
                expect(resp.body).toHaveProperty("about")
                expect(resp.body).toHaveProperty("photo")
                expect(resp.body).toHaveProperty("Images")
                expect(resp.body).toHaveProperty("UserInterests")
                done()
            })
    })

})

describe("GET /profile [success case]", () => {
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

  test("get profile detail by id from req user, status 200", (done) => {
      request(app)
          .get(`/profile`)
          .set({ access_token })
          .then(resp => {
              expect(resp.status).toBe(200)
              expect(resp.body).toHaveProperty("id")
              expect(resp.body).toHaveProperty("username")
              expect(resp.body).toHaveProperty("email")
              expect(resp.body).toHaveProperty("about")
              expect(resp.body).toHaveProperty("photo")
              expect(resp.body).toHaveProperty("Images")
              expect(resp.body).toHaveProperty("UserInterests")
              done()
          })
  })

})
describe("GET /profile/:id [fail case]", () => {

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
              console.log('>>>>>>>>>>>>', access_token, '<<<<<<<<<<<<')
              done()
          })
  })

  let wrongId = 88

  test("failed get profile detail, status 404", (done) => {

      request(app)
          .get(`/profile/${wrongId}`)
          .set({ access_token })
          .then(resp => {
              expect(resp.status).toBe(404)
              expect(resp.body).toHaveProperty("message", "User Not Found");
              done()
          })
  })

})

describe("GET /profile [fail case]", () => {

    let wrongAccessToken = 'xxx'

    test("failed get profile detail, status 500", (done) => {

        User.findAll = jest.fn().mockRejectedValue("Error")

        request(app)
            .get("/profile")
            .set({ access_token: wrongAccessToken })
            .then(resp => {
                console.log(resp.body)
                expect(resp.status).toBe(500)
                expect(resp.body).toHaveProperty("message", "Internal Server Error");
                done()
            })
    })

})