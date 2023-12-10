const express = require("express")

const productRouter = express.Router()

const {getProductHandler,
    createProductHandler,
    getProductByIdHandler,
    updateProductByIdHandler,
    deleteProductByIdHandler,
    } = require("../controller/productController")
const {checkInput} = require("../utils/crudFactory")

/** Product Routes */
productRouter.get('/',getProductHandler)
productRouter.post('/', checkInput, createProductHandler)
productRouter.get('/:id',getProductByIdHandler)
productRouter.patch('/:id',updateProductByIdHandler)
productRouter.delete('/:id',deleteProductByIdHandler)

async function getAllProduts(req, res) {
    console.log(req.query);
    const { sort, select } = req.query;
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
      const result = await queryPromise;
      res.status(200).json({
        message: "success",
        data: result,
      })

}
module.exports = productRouter