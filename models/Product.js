import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
    productName: {
        type: String,
        require: true,
    },    
    productPrice: {
        type:Number,
        require: true,
        default:null
    },
    productDescription: {
        type:String,
        require: true,
        default:null
    },
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
}, {
    timestamps: { 
        createdAt: 'createdAt' 
    }
});

//fonction mongoose.model(nom de la "table", schéma qui définie la collection)
const Product = mongoose.model("Product", productSchema);

export default Product;