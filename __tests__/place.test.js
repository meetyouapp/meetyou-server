const app = require("../app.js")
const request = require("supertest")
const { User } = require("../models")

const userData = {
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
}


beforeAll((done) => {
  User.create(userData)
      .then(resp => {
        done();
  })
      .catch((err) => {
      done(err);
  });
});

afterAll((done) => {
  User.destroy({where: {email: userData.email}})
      .then(() => done())
      .catch((err) => done(err))
});

describe("GET /places [success case]", () => {
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
          .get("/places")
          .set({ access_token })
          .then(resp => {
            expect(resp.status).toBe(200)
            expect(Array.isArray(resp.body)).toBe(true);
            done()
          })
  })
})