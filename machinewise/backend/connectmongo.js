const express = require('express');
const { MongoClient } = require('mongodb');
var cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri);

async function main() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Get the collection
    const collection = client.db('machinewise').collection('machinewise');

    // Define the endpoint
    let data;
    app.get('/data', async (req, res) => {
      try {
        data = await collection.find().toArray();
        res.json(data);
      } catch (err) {
        console.error('Error fetching data', err);
        res.status(500).send('Error fetching data');
      }
    });

    app.get('/filter', async (req, res) => {
      const { start, frequency } = req.query;
      // Convert start time to Date object
      const startTime = new Date(start);
      // Filter data based on start time and frequency
      const filteredData = data.filter(item => {
        const itemTime = new Date(item.ts);
        switch (frequency) {
          case 'hour':
            return itemTime >= startTime && itemTime < new Date(startTime).setHours(startTime.getHours() + 1);
          case 'day':
            return itemTime >= startTime && itemTime < new Date(startTime).setDate(startTime.getDate() + 1);
          // Add more cases for week and month
        }
      });
      res.json(filteredData);
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
