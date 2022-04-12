const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const { authMiddleware } = require('./middleware')

const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/carts')
const categoryRouter = require('./routes/categories')
const shipmentRouter = require('./routes/shipment')
const transactionRouter = require('./routes/transaction')
const { webHook } = require('./controllers/transaction')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const prefix = '/api/v1'
app.post('/webhook/midtrans', webHook)
app.use(prefix, authRouter)
app.use(authMiddleware)
app.use(prefix, productRouter)
app.use(prefix, cartRouter)
app.use(prefix, categoryRouter)
app.use(prefix, shipmentRouter)
app.use(prefix, transactionRouter)
app.use(prefix, usersRouter)

module.exports = app
