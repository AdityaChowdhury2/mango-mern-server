import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const port = process.env.PORT || 5000;

//creating express application
const app = express();

//adding middlewares
app.use(cors());
app.use(express.json());

// Database connection
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@cluster0.bpuiezi.mongodb.net/?retryWrites=true&w=majority`

// Create a mongoCLient with a mongoClientOptions object to set the stable api version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

const run = async () => {
    try {
        //connect the client to the server 
        await client.connect();
        const database = client.db("mangoDB");
        const mangoCollection = database.collection("mango");
        console.log("Pinged your deployment. You successfully connected to MongoDb.");

        app.get('/mango', async (req, res) => {
            const cursor = mangoCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })
        app.get('/mango/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await mangoCollection.findOne(filter)
            res.send(result)
        })

        app.patch('/mango/:id', async (req, res) => {
            const id = req.params.id;
            const updatedMango = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const newMango = {
                $set: {
                    name: updatedMango.name,
                    price: updatedMango.price,
                    imageURL: updatedMango.imageURL
                }
            }

            const result = await mangoCollection.updateOne(filter, newMango, options)
            res.send(result)

        });

        app.delete('/mango/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await mangoCollection.deleteOne(query);
            res.send(result);
        })
        app.post('/', async (req, res) => {
            const newMango = req.body;
            // console.log(newMango);
            const result = await mangoCollection.insertOne(newMango);
            res.send(result)

        })

    }
    catch (err) {
        console.log(err)
    }
}
run()



app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

