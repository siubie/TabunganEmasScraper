const express = require("express");
const app = express();
const port = 3000;

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

app.get("/", (req, res) => {
  res.status(200).send({
    success: "true",
    message: "harga retrieved successfully",
    harga: db.get("history"),
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
