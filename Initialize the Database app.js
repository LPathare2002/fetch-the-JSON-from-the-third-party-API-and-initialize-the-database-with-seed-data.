const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/database', {useNewUrlParser: true, useUnifiedTopology: true});


const productSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    title: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    image: {type: String, required: true},
    sold: {type: Boolean, default: false},
    dateOfSale: {type: Date}
});


const Product = mongoose.model('Product', productSchema);


async function initializeDatabase() {
    try {
        // Fetch data from the third party API
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        // Insert data into the database
        await Product.insertMany(data);

        console.log('Database initialized');
    } catch (error) {
        console.error(error);
    }
}


initializeDatabase();


const app = express();


app.get('/products', async (req, res) => {
    try {
        // Fetch data from the database
        const products = await Product.find();

        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Failed to fetch data from the database'});
    }
});

// Start the application
app.listen(3000, () => {
    console.log('Server started on port 3000');
});