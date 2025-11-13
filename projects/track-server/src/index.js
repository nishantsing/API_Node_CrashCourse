require('./models/User')
require('./models/Track')
const express = require("express")
require('dotenv').config()
const mongoose = require("mongoose")
const authRoutes = require('./routes/authRoutes')
const trackRoutes = require('./routes/trackRoutes')
const requireAuthMidd = require("./middlewares/requireAuth")


const app = express()
const mongoURI = process.env.MONGO_URL

app.use(express.json()) // body parser should be above routes
app.use(authRoutes)
app.use(trackRoutes)


mongoose.connect(mongoURI)

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance')
})

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo', err)
})
app.get('/', requireAuthMidd, (req, res) => {
    res.send(`Your email: ${req.user.email}`)
})


app.listen(process.env.PORT || 3000, console.log(`Listening on port 3000`))