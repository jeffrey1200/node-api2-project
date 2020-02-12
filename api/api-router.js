const express = require("express");

const postsRouter = require("../data/db-router");

const router = express.Router();

router.use("/posts", postsRouter);

module.exports = router;
