// Import required modules
const express = require('express');
const axios = require('axios');

// Initialize express app and define port
const app = express();
const PORT = 3000;

app.use(express.json());

const API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

// API endpoint for pie chart
app.get('/pie-chart/:month', async (req, res) => {
    try {
        const { month } = req.params;

        // Fetch data from third-party API
        const response = await axios.get(API_URL);

        // Filter products sold in the specified month
        const products = response.data.filter((product) => {
            const saleMonth = new Date(product.dateOfSale).getMonth() + 1;
            return saleMonth === parseInt(month);
        });

        // Count products in each category
        const categories = {};
        products.forEach((product) => {
            const { category } = product;
            categories[category] = categories[category] ? categories[category] + 1 : 1;
        });

        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));