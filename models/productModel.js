const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'A product must have a name'],
        unique: true,
    },

    price: {
        type: Number,
        required: [true,'A product must have a price'],
        validate: {
            validator: function(){
                return this.price > 0
            },
            message: "Price must be greater than 0"
        }
    },

    categories: {
        required: [true,'A product must have a category'],
        type:[String]
    },

    stock: {
        type:Number,
        required:[true,'A product must have a stock'],
    },

    brand:{
        type:String,
        required:[true,'A product must have a brand'],
    },

    images: {
        type:[String]
        // Not required
    },

    discount: {
        type: Number,
        validate:{
            validator: () => { 
                return this.discount < this.price
            },
            message: "Discount must be less than price"
        }
    },

    description: {
        type:String,
        required:[true,'A product must have a description']
    }
})

const validProductCategories = ['electronics','stationary','clothing','furniture']
productSchema.pre('save',function(next){
    //Check if there is an invalid category
    //If invalid present throw error
    //Else Proceed
    const invalidCategories = this.categories.filter(category=>!validProductCategories.includes(category))
    if(invalidCategories.length > 0){
        throw new Error(`Invalid categories ${invalidCategories.join(",")}`)
    } else{
        next()
    }

})

const Product = mongoose.model('Product',productSchema)

module.exports = Product