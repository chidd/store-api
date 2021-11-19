const Product = require('../models/product')

const getAllProducts = async (req, res) =>{
    const {featured,company,name,sort, fields, numericFilters} = req.query
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

    // for numeric filtering
    if(numericFilters){
        const operatorMap = {
            '>' : '$gt',
            '>=' : '$gte',
            '=' : '$eq',
            '<' : '$lt',
            '<=' : '$lte',
        }
        const regEx = /\b(<|>|<=|=|>=)\b/g
        // converting filter operators eg > <= to the ones understood by mongoose
        let filters  = numericFilters.replace(regEx, (match)=>`-${operatorMap[match]}-`)
        
        const options  = ['price', 'rating']
        filters = filters.split(',').forEach(item => {
            const [field,operator,value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }            
        });
        
    }
    

    
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

    const page = Number(req.query.page) || 1// req.query always returns strings hence the cast using Number()
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({products, nbHits:products.length})
}

const getAllProductsStatic = async (req, res) =>{
    const products = await Product.find({})
    res.status(200).json({products, nbHits:products.length})
}

module.exports = {getAllProducts, getAllProductsStatic}