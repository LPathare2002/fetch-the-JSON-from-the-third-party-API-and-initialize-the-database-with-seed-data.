const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');

app.use(express.json());


app.get('statistics/:month', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const month = req.params.month.toLowerCase();
        const products = response.data;

        // Filter products based on selected month
        const filteredProducts = products.filter(product => {
            const date = new Date(product.dateOfSale);
            return date.toLocaleString('default', { month: 'long' }).toLowerCase() === month;
        });

        // Calculate total sale amount of selected month
        const totalSaleAmount = filteredProducts.reduce((acc, product) => {
            if (product.sold) {
                return acc + product.price;
            }
            return acc;
        }, 0);

        // Calculate total number of sold items of selected month
        const totalSoldItems = filteredProducts.filter(product => product.sold).length;

        // Calculate total number of not sold items of selected month
        const totalNotSoldItems = filteredProducts.filter(product => !product.sold).length;

        res.json({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Start the application
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});