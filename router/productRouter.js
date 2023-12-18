const express = require("express");
const Product = require("../models/productModel");

const {getProductHandler,
    createProductHandler,
    getProductByIdHandler,
    updateProductByIdHandler,
    deleteProductByIdHandler,
    } = require("../controller/productController");

const {checkInput} = require("../utils/crudFactory");

const {protectRoute, isAuthorized} = require("../controller/authController")

const productRouter = express.Router();

const productValidRoles = ["admin","seller"];

/** Product Routes */
productRouter.get('/',getProductHandler)
productRouter.post('/', checkInput, protectRoute, isAuthorized(productValidRoles), createProductHandler)
productRouter.get('/bigBillionDay', getBigBillionDayProducts, getAllProducts)
productRouter.get('/:id',getProductByIdHandler)
productRouter.patch('/:id',updateProductByIdHandler)
productRouter.delete('/:id',deleteProductByIdHandler)

async function getAllProducts(req, res) {
    console.log(req.query);
    const { sort, select, page, limit, filter } = req.query;
    let queryPromise = Product.find()
    console.log("sort",sort)  
    if (sort) {
      const [sortParam, order] = sort.split(" ");
      if (order === "asc") {
        queryPromise = queryPromise.sort(sortParam);
      } else {
        queryPromise = queryPromise.sort(`-${sortParam}`);
      }
    }
    if (select) {
      queryPromise = queryPromise.select(select);
    }
    if (page && limit) {
      const pageNum = page || 1;
      const limitNum = limit || 2;
      const skip = (pageNum - 1) * limitNum;
      console.log("skip", skip);
      queryPromise = queryPromise.skip(skip).limit(limitNum);
    }
    if (filter) {
      try {
        console.log("filter", filter);
        // parse the filter string into an object
        const filterObj = JSON.parse(filter);
        console.log("filterObj", filterObj);

        // To apply proper queries in MongoDB, we have  to replace regular web expressions with MongoDB expressions
        // replace gt with $gt, lt with $lt, gte with $gte, lte with $lte
        // We have to go object, string, back to string to make the appropriate substitutions
        // loop over the keys in the object and replace the key with $key
        const filterObjStr = JSON.stringify(filterObj).replace(
          /\b(gt|gte|lt|lte)\b/g,
          (match) => `$${match}`
        );
        console.log("filterObjStr", filterObjStr);
        queryPromise = queryPromise.find(JSON.parse(filterObjStr));
      } catch (err) {
        console.log(err.message);
      }
  
      // replace gt with $gt, lt with $lt, gte with $gte, lte with $lte
    }
    const result = await queryPromise;
    res.status(200).json({
      message: "success",
      data: result,
    });
  }

async function getBigBillionDayProducts(req,res,next){
  console.log("getBillionDollarProducts")
  req.query.filter = JSON.stringify({stock: {lte: 10}})
  next()
}

module.exports = productRouter