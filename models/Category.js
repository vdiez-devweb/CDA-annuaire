import mongoose from "mongoose";
// on importe l'objet Schema de mongoose
const { Schema } = mongoose;

//on créé l'objet instance de Schema
const categorySchema = new Schema({
    categoryName: {
        //on ne spécifie pas l'Id, mongoose le fait pour nous
        type: String,
        require: true,
        unique: true
    },
    categoryDescription: {
        //on ne spécifie pas l'Id, mongoose le fait pour nous
        type: String
    },
    categorySlug: {
        //on ne spécifie pas l'Id, mongoose le fait pour nous
        type: String,
        require: true,
        unique: true
    },
});

//fonction mongoose.model(nom de la "table", schéma qui définie la collection)
const Category = mongoose.model("Category", categorySchema);

export default Category;