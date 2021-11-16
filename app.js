require('dotenv').config({path:'./config/config.env'})
require('express-async-errors') //FOR custom error handling
const express =  require('express')
const productsRouter = require('./routes/products')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')

const app = express()

//middleware
app.use(express.json())

// routes
app.get('/', (req, res)=>{
    res.send('<h1>Store API</h1><a href="/api/v1/products">Products route</a>')
})

app.use('/api/v1/products', productsRouter)


// product routes

// error middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start  = async ()=>{
    try {
        //connect db
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>{
            console.log(`Server listening on port: ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()