const express = require("express");
const app = express();

let port = 3000;
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.post("/upload", function (req, res){
  let content;
  if(req.method === 'POST'){
    content = JSON.stringify(req.body, null, 2);
  }
  res.send(`method=${req.method} <br> content=${content}`);
} )

app.listen(port, err => {
  console.log(`Listening on port: ${port}`);
});
