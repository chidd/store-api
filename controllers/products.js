const Product = require('../models/product')

const getAllProducts = async (req, res) =>{
    const {featured,company,name,sort, fields} = req.query
    const queryObject = {}

    if(featured){
        queryObject.featured = featured === 'true'?true:false
    }
    
    if(company){
        queryObject.company = company
    }

    if(name){
        queryObject.name = {$regex: name, $options: 'i'}
    }
    

    //console.log(queryObject)
    // const products = await Product.find(queryObject)//this will return a list of products because of the await hence the line below
    let result = Product.find(queryObject)

    // sorting query results
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else{
        result = result.sort('createdAt')//default sort
    }

    //selecting specific fields
    if(fields){
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    } 

    const products = await result
    res.status(200).json({products, nbHits:products.length})
}

const getAllProductsStatic = async (req, res) =>{
    const products = await Product.find({})
    res.status(200).json({products, nbHits:products.length})
}

module.exports = {getAllProducts, getAllProductsStatic}