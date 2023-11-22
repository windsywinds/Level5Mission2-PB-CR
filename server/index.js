const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

const db = require("./models");

// Routers
const postRouter = require("./routes/Cars");
app.use("/posts", postRouter);

db.sequelize.sync().then(() => {
  app.listen(4000, () => {
    console.log("Server running on port 4000");
  });
});