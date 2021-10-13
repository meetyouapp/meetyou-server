const errorHandler = (error, req, res, next) => {
  let code = 500;
  let message = "Internal Server Error";

  if (error.name === "NOTFOUND") {
    code = 404;
    message = error.message;
  } else if (error.name === "FORBIDDEN") {
    code = 403;
    message = error.message;
  } else if (error.name === "NOTAUTHORIZED") {
    code = 401;
    message = error.message;
  } else if (error.name === "BADREQUEST") {
    code = 400;
    message = error.message;
  } else if (error.name === "SequelizeValidationError") {
    code = 400;
    message = error.errors.map((el) => {
      return el.message;
    });
  } else if (error.name === "SequelizeUniqueConstraintError") {
    code = 400;
    message = "Email is already exists";
  }
  res.status(code).json({ message });
};

module.exports = { errorHandler };
