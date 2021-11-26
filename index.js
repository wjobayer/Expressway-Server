const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rtqba.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('expressway');
        const servicesCollection = database.collection('services');
        const deliveryCollection = database.collection('delivery');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

         // GET Single Service
         app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })


        // cofirm order
        app.post("/confirmorder", async (req, res) => {
            const result = await deliveryCollection.insertOne(req.body);
            res.send(result);
        });

        // my confirmOrder

        app.get("/myorders/:email", async (req, res) => {
            const result = await deliveryCollection
             .find({ email: req.params.email })
             .toArray();
             res.send(result);
  });

        /// delete order

        app.delete("/deleteorder/:id", async (req, res) => {
            const result = await deliveryCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
    res.send(result);
  });


        // all order
        app.get("/allorders", async (req, res) => {
        const result = await deliveryCollection.find({}).toArray();
        res.send(result);
    });
        //update
    app.put("/updatestatus/:id", (req, res) => {
        const id = req.params.id;
        const updatedStatus = req.body.status;
        const filter = { _id: ObjectId(id) };
        console.log(updatedstatus);
        deliveryCollection
          .updateOne(filter, {
            $set: { status: updatedstatus },
          })
          .then((result) => {
            res.send(result);
          });
      });



        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running expressway Server');
});
app.get('/updateex', (req, res) => {
    res.send('Running expressway Server update hoiche');
});

app.get('/hello', (req, res) => {
    res.send('hello updated here')
})

app.listen(port, () => {
    console.log('wow Expressway Server on port', port);
})