const express = require("express");
const server = express();
const postRoute = require('./data/routes/router');

server.use(express.json());

server.use("/api/posts", postRoute);

server.listen(4000, () => {
  console.log("server running on port 4000");
});