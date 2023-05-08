import Category from "../models/Category.js";

//on déclare la fonction, 2 façons possibles
// exports.getHomePage = (req, res, next) => {
//     res.render("homepage", {
//         title: "Homepage";
//     })
// };

export const getHomepage = async (req, res, next) => {
    const categories = await Category.find({});

    res.render("homepage", {
        title: "Accueil",
        categories: categories,
        message: ""
    });
};