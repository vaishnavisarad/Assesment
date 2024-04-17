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
    app.get('/data', async (req, res) => {
      try {
        const data = await collection.find().toArray();
        res.json(data);
      } catch (err) {
        console.error('Error fetching data', err);
        res.status(500).send('Error fetching data');
      }
    });

    app.get('/filter', async (req, res) => {
      const { start, frequency } = req.query;
      console.log("Filtering data:", start, frequency);
      const startTime = new Date(start);
      try {
        let endTime;
        switch (frequency) {
          case 'hour':
            endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + 1);
            break;
          case 'day':
            endTime = new Date(startTime);
            endTime.setDate(endTime.getDate() + 1);
            break;
          case 'week':
            endTime = new Date(startTime);
            endTime.setDate(endTime.getDate() + 7);
            break;
          case 'month':
            endTime = new Date(startTime);
            endTime.setMonth(endTime.getMonth() + 1);
            break;
          default:
            throw new Error('Invalid frequency');
        }
        const filteredData = await collection.find({
          ts: {
            $gte: startTime,
            $lt: endTime
          }
        }).toArray();
        res.json(filteredData);
      } catch (err) {
        console.error('Error filtering data', err);
        res.status(500).send('Error filtering data');
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
