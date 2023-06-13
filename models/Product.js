import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
const { Schema } = mongoose;

const productSchema = new Schema({
    productName: {
        type: String,
        required: [true,'Vous devez saisir un nom de produit'],
        unique: true
        // unique: [true,'Ce produit existe déjà, veuillez saisir un autre nom'],
    },    
    productPrice: {
        type:Number,
        default:null
    },
    productDescription: {
        type:String,
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

productSchema.plugin(uniqueValidator);

//fonction mongoose.model(nom de la "table", schéma qui définie la collection)
const Product = mongoose.model("Product", productSchema);

export default Product;