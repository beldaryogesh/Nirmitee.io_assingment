const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const app = express();

app.use(bodyParser.json());
app.use(multer().any());

mongoose
  .connect(
    "mongodb+srv://yogesh_beldar:Oh9CU4nZCayFGTeC@cluster0.zveoo.mongodb.net/Nirmitee_io"
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

  app.use("/", route)

  app.listen(3000, function(){
    console.log('Express app running on port ' + 3000);
  });