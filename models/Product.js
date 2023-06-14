import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const { Schema } = mongoose;

const productSchema = new Schema({
    productName: {
        type: String,
        required: [true,'Vous devez saisir un nom de produit'],
        minLength:[5,'Le nom de produit doit contenir au moins 5 caractères'],
        maxLength:[100,'Le nom de produit doit contenir au maximum 100 caractères'],
        // unique: true
        unique: 'Ce produit existe déjà, veuillez saisir un autre nom'
    },    
    productPrice: {
        type:Number,
        default:null,
        min:[1, 'Le prix ne peut pas être 1'],
        max:[1500, 'Le prix ne peut pas dépasser 1500']
        // validate: {
        //     validator: function(number) {
        //       return (typeof number === 'Number');
        //     },
        //     message: props => `doit être un nombre! vous avez saisi ${props.value}`
        //   }
    },
    productDescription: {
        type:String,
        maxLength:[250,'La description du produit doit contenir au maximum 250 caractères'],
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