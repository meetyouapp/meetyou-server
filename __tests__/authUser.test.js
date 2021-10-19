const app = require("../app.js");
const { User, sequelize } = require("../models");
const request = require("supertest");
const { queryInterface } = sequelize;

describe("User Routes Test", () => {
  const userData = {
    username: "inirani",
    email: "rani@mail.com",
    password: "12345678",
    age: 17,
    gender: "female",
    photo:
      "https://koreanindo.net/wp-content/uploads/2020/11/kim-yoo-jung-4.jpg",
    about: "hai guys",
    interestId: [1, 6, 7],
  };

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

  describe("POST /register - create new user", () => {
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

    test("201 Success register - should create new User", (done) => {
      request(app)
        .post("/register")
        .send(userData)
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(201);
          expect(body).toHaveProperty("id", expect.any(Number));
          expect(body).toHaveProperty("username", userData.username);
          expect(body).toHaveProperty("email", userData.email);
          expect(body).toHaveProperty("age", userData.age);
          expect(body).toHaveProperty("gender", userData.gender);
          expect(body).toHaveProperty("photo", userData.photo);
          expect(body).toHaveProperty("about", userData.about);
          done();
        })
        .catch((error) => console.log(error));
    });

    test("400 Failed register - should return error if email is null", (done) => {
      request(app)
        .post("/register")
        .send({
          username: "test",
          password: "qweqwe",
          age: 19,
          gender: "male",
          photo:
            "https://t1.daumcdn.net/news/202003/03/starnews/20200303124859622yvkl.jpg",
          about: "hai cewe",
          interestId: [1, 3, 7],
        })
        .then((response) => {
          const { body, status } = response;
          console.log(body, "disiniii");
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", ["Email is required"]);

          done();
        })
        .catch((err) => console.log(err, "diisinii"));
    });

    test("400 Failed register - should return error if email is empty", (done) => {
      request(app)
        .post("/register")
        .send({
          username: "test",
          email: "",
          password: "qweqwe",
          age: 19,
          gender: "male",
          photo:
            "https://t1.daumcdn.net/news/202003/03/starnews/20200303124859622yvkl.jpg",
          about: "hai cewe",
          interestId: [1, 3, 7],
        })
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", [
            "Email is required",
            "Invalid email format",
          ]);
          done();
        });
    });

    test("400 Failed register - should return error if email is already used", (done) => {
      request(app)
        .post("/register")
        .send({
          username: "inirani2",
          email: "rani@mail.com",
          password: "12345678",
          age: 18,
          gender: "female",
          photo:
            "https://koreanindo.net/wp-content/uploads/2020/11/kim-yoo-jung-4.jpg",
          about: "hai everyone",
          interestId: [8, 6, 7],
        })
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email is already exists");
          done();
        });
    });

    test("400 Failed register - should return error if email have invalid format", (done) => {
      request(app)
        .post("/register")
        .send({
          username: "test",
          email: "rani.com",
          password: "12345678",
          age: 30,
          gender: "female",
          photo:
            "https://koreanindo.net/wp-content/uploads/2020/11/kim-yoo-jung-4.jpg",
          about: "hai everyone",
          interestId: [8, 6, 7],
        })
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", ["Invalid email format"]);
        });
      done();
    });
  });

  test("400 Failed register - should return error if password is empty", (done) => {
    request(app)
      .post("/register")
      .send({
        username: "inirani2",
        email: "rani@mail.com",
        password: "",
        age: 17,
        gender: "female",
        photo:
          "https://koreanindo.net/wp-content/uploads/2020/11/kim-yoo-jung-4.jpg",
        about: "hai everyone",
        interestId: [8, 6, 7],
      })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", [
          "Password is required",
          "Minimum password length is 6 characters",
        ]);
        done();
      });
  });

  test("400 Failed register - should return error if password length is less than 6 or more than 40", (done) => {
    request(app)
      .post("/register")
      .send({
        username: "inirani2",
        email: "rani@mail.com",
        password: "123",
        age: 17,
        gender: "female",
        photo:
          "https://koreanindo.net/wp-content/uploads/2020/11/kim-yoo-jung-4.jpg",
        about: "hai everyone",
        interestId: [8, 6, 7],
      })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", [
          "Minimum password length is 6 characters",
        ]);
        done();
      });
  });

  test("400 Failed register - should return error if age is null", (done) => {
    request(app)
      .post("/register")
      .send({
        username: "inirani2",
        email: "rani@mail.com",
        password: "12345678",
        gender: "female",
        photo:
          "https://koreanindo.net/wp-content/uploads/2020/11/kim-yoo-jung-4.jpg",
        about: "hai everyone",
        interestId: [8, 6, 7],
      })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", ["Age is required"]);
        done();
      });
  });

  test("400 Failed register - should return error if age is less than 17", (done) => {
    request(app)
      .post("/register")
      .send({
        username: "inirani2",
        email: "rani@mail.com",
        password: "12345678",
        age: 16,
        gender: "female",
        photo:
          "https://koreanindo.net/wp-content/uploads/2020/11/kim-yoo-jung-4.jpg",
        about: "hai everyone",
        interestId: [8, 6, 7],
      })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", ["Minimum age is 17 years"]);
        done();
      });
  });

  test("400 Failed register - should return error if gender is null", (done) => {
    request(app)
      .post("/register")
      .send({
        username: "inirani2",
        email: "rani@mail.com",
        password: "12345678",
        age: 18,
        photo:
          "https://koreanindo.net/wp-content/uploads/2020/11/kim-yoo-jung-4.jpg",
        about: "hai everyone",
        interestId: [8, 6, 7],
      })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", ["Gender is required"]);
        done();
      });
  });

  test("400 Failed register - should return error if gender is empty", (done) => {
    request(app)
      .post("/register")
      .send({
        username: "inirani2",
        email: "rani@mail.com",
        password: "12345678",
        age: 18,
        gender: "",
        photo:
          "https://koreanindo.net/wp-content/uploads/2020/11/kim-yoo-jung-4.jpg",
        about: "hai everyone",
        interestId: [8, 6, 7],
      })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", ["Gender is required"]);
        done();
      });
  });

  test("400 Failed register - should return error if photo is null", (done) => {
    request(app)
      .post("/register")
      .send({
        username: "inirani2",
        email: "rani@mail.com",
        password: "12345678",
        age: 18,
        gender: "female",
        about: "hai everyone",
        interestId: [8, 6, 7],
      })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", ["Photo is required"]);
        done();
      });
  });

  test("400 Failed register - should return error if photo is empty", (done) => {
    request(app)
      .post("/register")
      .send({
        username: "inirani2",
        email: "rani@mail.com",
        password: "12345678",
        age: 18,
        photo: "",
        gender: "female",
        about: "hai everyone",
        interestId: [8, 6, 7],
      })
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", ["Photo is required"]);
        done();
      });
  });

  describe("POST /login - user authentication process", () => {
    beforeAll((done) => {
      User.create(userData)
        .then((_) => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    afterAll((done) => {
      queryInterface
        .bulkDelete("Users", {})
        .then(() => done())
        .catch((err) => done(err));
    });

    test("200 Success login - should return access_token", (done) => {
      request(app)
        .post("/login")
        .send(userData)
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(200);
          expect(body).toHaveProperty("id", expect.any(Number));
          expect(body).toHaveProperty("email", userData.email);
          expect(body).toHaveProperty("access_token", expect.any(String));
          done();
        });
    });

    test("401 Failed login - should return error", (done) => {
      request(app)
        .post("/login")
        .send({
          email: "d@mailssss.com",
          password: "qweqwe",
        })
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid Email/Password");
          done();
        });
    });
  });
});
