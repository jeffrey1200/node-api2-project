const express = require("express");

const apiRouter = require("./api/api-router");

const server = express();

server.use(express.json());

server.use("/api", apiRouter);

const port = 5000;

server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
