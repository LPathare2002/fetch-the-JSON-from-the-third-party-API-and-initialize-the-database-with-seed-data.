// Import necessary packages
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'mydatabase';
const collectionName = 'products';

const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to database successfully');
    }
});

const port = process.env.PORT || 3000;

app.get('/bar-chart/:month', async (req, res) => {
    const month = req.params.month;
    const monthStart = new Date(`${month} 1, 2021`);
    const monthEnd = new Date(`${month} 31, 2021`);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    try {
        const priceRanges = [
            {min: 0, max: 100},
            {min: 101, max: 200},
            {min: 201, max: 300},
            {min: 301, max: 400},
            {min: 401, max: 500},
            {min: 501, max: 600},
            {min: 601, max: 700},
            {min: 701, max: 800},
            {min: 801, max: 900},
            {min: 901, max: Infinity},
        ];

        const barChartData = [];

        for (const priceRange of priceRanges) {
            const count = await collection.countDocuments({
                price: {$gte: priceRange.min, $lte: priceRange.max},
                dateOfSale: {$gte: monthStart, $lte: monthEnd},
            });
            const priceRangeLabel = `$${priceRange.min}-${priceRange.max}`;
            barChartData.push({priceRange: priceRangeLabel, count: count});
        }

        res.json(barChartData);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Start the application
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});