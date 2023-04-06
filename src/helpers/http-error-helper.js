const handleError = (err, res) => {
  const { type, message } = err;

  if (type === "NOT_FOUND") {
    return res.status(404).send(message);
  }

  if (type === "BAD_REQUEST") {
    return res.status(400).send(message);
  }

  return res.status(500).send("Internal Server Error");
};

const throwNotFoundError = (message) => {
  throw {
    type: "NOT_FOUND",
    message,
  };
};

const throwBadRequestError = (message) => {
  throw {
    type: "BAD_REQUEST",
    message,
  };
};

module.exports = { handleError, throwNotFoundError, throwBadRequestError };
