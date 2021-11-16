require('dotenv').config({path:'./config/config.env'})
const Product = require('./models/product')
const productsListJson = require('./products.json')

const connectDB = require('./db/connect');

const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany()
        await Product.create(productsListJson)
        console.log('success!!!')
        process.exit(0)// 0 indicates all went fine
    } catch (error) {
        console.log(error)
        process.exit(1) // 1 indicates an error code
    }
}

start()