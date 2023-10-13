import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

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

        console.log("Pinged your deployment. You successfully connected to MongoDb.");
    }
    catch (err) {
        console.log(err)
    }
}
run()

app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

