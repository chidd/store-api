require('dotenv').config({path:'./config/config.env'})
const express =  require('express')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')


const app = express()

//middleware
app.use(express.json())

// routes
app.get('/', (req, res)=>{
    res.send('<h1>Store API</h1><a href="/api/v1/products">Products route</a>')
})

// product routes

// error middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start  = async ()=>{
    try {
        app.listen(port,()=>{
            console.log(`Server listening on port: ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()