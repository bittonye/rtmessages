const express = require("express");
const router = express.Router();
const app = require('../app');

router.get("/", (req, res) => {
  res.send({ response:  app.users}).status(200);
});

module.exports = router;