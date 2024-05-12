const express = require('express')
const app = express()
require('dotenv').config()

const stripe = require('stripe')(process.env.STRIPE_PUBLIC_KEY)

app.use(express.static('public'))
app.use(experss.json())

const scalculateOrderAmount = (items) => {
    return 1400
}

app.post('/create-payment-intent', async (req,res) => {
    const {items} = req.body
})