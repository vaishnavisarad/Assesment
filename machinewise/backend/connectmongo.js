const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const uri = 'mongodb+srv://vaishnavi:Qwerty%40123@cluster0.nhnlrzp.mongodb.net/';
const client = new MongoClient(uri);

async function main() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Get the collection
    const collection = client.db('machinewise').collection('machinewise');

    // Define the endpoint
    app.get('/data', async (req, res) => {
      try {
        const data = await collection.find().toArray();
        res.json(data);
      } catch (err) {
        console.error('Error fetching data', err);
        res.status(500).send('Error fetching data');
      }
    });

    // Start the server
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
}

main();
