const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();


app.use(bodyParser.json());
app.use(cors());
app.use(express());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tantc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const port = 5000;

app.get("/", (req, res) => {
      res.send("Hello World!");
    });

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

client.connect((err) => {
  const buyCollection = client.db("finexGateway").collection("items");
  const sellCollection = client.db("finexGateway").collection("sell");

  console.log("Database connected");

  app.post("/buy", (req, res) => {
    buyCollection.insertOne(req.body).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/sell", (req, res) => {
    sellCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});


app.listen(process.env.PORT || port)
