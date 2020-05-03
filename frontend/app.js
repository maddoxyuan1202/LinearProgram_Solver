const express = require("express");
const app = express();

let port = 3000;
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
// listen to localhost:3000 by default
app.listen(port, (err) => {
  console.log(`Listening on port: ${port}`);
});
