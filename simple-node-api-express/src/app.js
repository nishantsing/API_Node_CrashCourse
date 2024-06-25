const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./models/customer');
require('dotenv').config()
const app = express();
mongoose.set('strictQuery', false);


app.use(express.json()); // To use req.body
app.use(express.urlencoded({ extended: true })) // for form data
const customers = [
    {
        "name": "John",
        "industry": "music"
    },
    {
        "name": "Doe",
        "industry": "networking"
    },
    {
        "name": "Johnny",
        "industry": "sports"
    },
]

// const customer = new Customer({
//     name: "John",
//     industry: "music"
// });

// customer.save();


app.get("/", (req, res) => {
    res.send(`<h1>Customers API</h1> <br> <p>Access customers API at <a href="http://localhost:${process.env.PORT || 3000}/api/customers">Customers</a></p>`)
    console.log(req.params)
})

app.get('/api/customers', async (req, res) => {
    //api/customer?id=63cd5e8a976ef7f7d5deeb8b
    // console.log(await mongoose.connection.db.listCollections().toArray())
    try {
        const result = await Customer.find()
        res.status(200).json({ 'customers': result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'error': err.message })
    }

})

app.get('/api/customers/:id', async (req, res) => {

    //api/customer/63cd5e8a976ef7f7d5deeb8b
    //api/customer?id=63cd5e8a976ef7f7d5deeb8b

    console.log({
        requestParams: req.params,
        requestQuery: req.query
    })
    try {
        // const {id: customerId} = req.params
        const { id } = req.params;
        console.log(id)
        // const customerId = req.params.id;
        const customer = await Customer.findById(id)
        console.log(customer);
        if (!customer) {
            res.status(404).json({ error: 'User not found' })
        } else {
            res.json({ customer })
        }


    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }

})

app.post('/api/customers', async (req, res) => {


    // const customer = new Customer({
    //     'name': req.body.name,
    //     'industry': req.body.industry
    // })
    console.log(req.body)
    const customer = new Customer(req.body)
    try {
        await customer.save();
        res.status(201).json({ customer });
    }
    catch (err) {
        res.status(400).json({
            'failure': err.message
        })
    }


})

app.put('/api/customer/:id', async (req, res) => {
    try {
        const customerId = req.params.id;
        const result = await Customer.replaceOne({ _id: customerId }, req.body)
        console.log(result)
        res.json({ updatedCount: result.modifiedCount })
    } catch (e) {
        res.status(500).json({ error: 'Something went wrong' })
    }

})


app.delete('/api/customer/:id', async (req, res) => {
    try {
        const customerId = req.params.id
        const result = await Customer.deleteOne({ _id: customerId })
        res.json({ deletedCount: result.deletedCount })
    } catch (e) {
        res.status(500).json({ error: 'Something went wrong' })
    }

})


// You have to restart the server every time there is a change in server files.
// To avoid restart use nodemon.
// You can install it as dev dependencies - npm i -D nodemon
// nodemon src/app.js
// or without installing use npx nodemon src/app.js as script or npx nodemon if main is set to the server file.

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        app.listen(process.env.PORT || 3000, () => {
            console.log('Server Started');
        })
    } catch (err) {
        console.log(err.message);
    }


}

start()