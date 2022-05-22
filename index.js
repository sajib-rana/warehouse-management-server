const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ss0vn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send("Running warehouse server");
});

async function run(){
  try{
      await client.connect();
      const productCollection = client.db('warehouse').collection('product');

      app.get('/product', async(req, res)=>{
          const query = {};
          const cursor = productCollection.find(query);
          const product = await cursor.toArray();
          res.send(product)
      })

      app.post("/login", async (req, res) => {
        const user = req.body;
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "1d",
        });
        res.send({ accessToken });
      });

      app.get('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: id };
            const product = await productCollection.findOne(query);
            res.send(product);
      })

      app.get("/detail/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: id };
        const product = await productCollection.findOne(query);
        res.send(product);
      });

      app.put("/product/:id", async (req, res) => {
        const id = req.params.id;
        const updateStock = req.body
        const query = { _id: id };
        const option = {upsert: true}

        const updateStockData = {
          $set: updateStock
        }

        const product = await productCollection.updateOne(
          query,
          updateStockData,
          option
        );
        res.send(product);
      });
  }
  finally{

  }
}
run().catch((err) => console.dir(err));

app.get('/hero',(req, res)=>{
  res.send('hero meets hero ku')
})
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log('listening to port', port)
})