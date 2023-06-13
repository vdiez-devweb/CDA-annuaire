import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

// on importe l'objet Schema de mongoose
const { Schema } = mongoose;

//on créé l'objet instance de Schema
const categorySchema = new Schema({
    //on ne spécifie pas l'Id, mongoose le fait pour nous
    categoryName: {
        type: String,
        required: [true,'Vous devez saisir un nom de catégorie'],
        unique: [true,'Cette catégorie existe déjà, veuillez saisir un autre nom'],
    },
    categorySlug: {
        type: String,
        required: [true,'Vous devez saisir un raccourci pour les liens'],
        unique: [true,'Ce slug existe déjà, veuillez saisir un autre slug'],
        lowercase: true
    },
    categoryDescription: {
        type: String,
        default:null
    },
    categoryImg: { //true if an image exists with slug filename, false if not (then we use a default image)
        type: Boolean,
        required: [true,'Vous devez définir si une image existe ou non pour cette catégorie'],
        default:false
    },
    categoryNbProducts: {
        type:Number,
        required: [true,'Vous devez saisir un nombre de produits'],
        default:0
    },
}, {
    timestamps: { 
        createdAt: 'createdAt' 
    }
});

categorySchema.plugin(uniqueValidator);

//fonction mongoose.model(nom de la "table", schéma qui définie la collection)
const Category = mongoose.model("Category", categorySchema);

export default Category;