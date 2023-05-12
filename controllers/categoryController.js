import Category from "../models/Category.js";
import Product from "../models/Product.js";

/**
 * 
 * get a single category in webApp 
 * 
**/
export const getCategory = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const categorySlug = req.params.categorySlug;
    try{
        const category = await Category.findOne({ "categorySlug": categorySlug });
        const products = await Product.find({"productCategory": category._id});

        if (0 == category) {
            res.status(404).render("category/getCategory", {
                title: "Liste des produits par catégorie",
                products: "",
                category: "",
                message: "Catégorie introuvable."
            });
        }
        if ("" == products) {
            res.status(404).render("category/getCategory", {
                title: "Liste des produits " + category.categoryName,
                products: "",
                category: category,
                message: "Aucun produit trouvé."
            });
        }
        res.status(200).render("category/getCategory", {
            title: "Liste des produits " + category.categoryName,
            message: "",
            category: category,
            products: products 
        });
    } catch(error) {
        res.status(500).render("category/getCategory", {
            title: "Liste des produits",
            products: "",
            category: "",
            message: error
        });
    }
};

/**
 * 
 * get all categories in webApp
 * 
**/
export const getCategories = async (req, res, next) => {
    try{
        const categories = await Category.find({});
        //console.log(categories);
        if (null == categories) {
            res.status(404).render("category/getCategories", {
                title: "Catégories de produits",
                categories: "",
                message: "Aucune catégorie enregistrée."
            });
        }
        res.status(200).render("category/getCategories", {
            title: "Catégories de produits",
            categories:  categories,
            message: ""
        });
    } catch(error) {
        res.status(500).render("category/getCategories", {
            title: "Erreur Catégories de produits",
            categories: "",
            message: "Erreur serveur."
        });
    }
};

/**
 * 
 * get all categories in API  //!API
 * 
**/
export const apiGetCategories = async (req, res, next) => {
    const apiCategories = await Category.find({});
    if (null == apiCategories) {
        res.status(404).json({ "message": "Aucune catégorie n'est trouvée" });
    }
    res.status(200).json({ apiCategories });
 };

/**
 * 
 * delete a single category in API //!API
 * 
**/
export const apiDeleteCategory = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.categoryId;

    try{
        const category = await Category.deleteOne({ "_id": id });
        //console.log(category);

        res.status(200).json({ "Message": "catégorie supprimée." });
    } catch {
        res.status(404).json("Erreur : catégorie introuvable.");
    }
};

/**
 * 
 * Create Category (requête post) in API //!API
 * 
**/
export const apiPostCategory = async (req, res, next) => {
    // envoyer le nom de la catégorie via req.body
    const categoryName = req.body.categoryName;
    const categoryDescription = req.body.categoryDescription;
    const categorySlug = req.body.categorySlug;
    const categoryImg = req.body.categoryImg;

    // on créé une nouvelle catégorie avec mongoose (Category est un objet Schema de mongoose déclaré dans le model)
    const category = await Category.create({
        // categoryName: categoryName,
        categoryName, // si la clé = valeur, on ne répète pas
        categoryDescription,
        categorySlug,
        categoryImg 
    });

    // console.log(category);
    // res.status(201).redirect("/categories");
    // res.status(201).send("category created : ", category);
    res.status(201).json({ category });
};

/**
 * 
 * Update Category (requête patch) in API //!API
 * 
**/
export const apiUpdateCategory = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique et le nouveau nom passé dans le corps de la requête
    const id = req.body.id;
    const categoryName = req.body.categoryName;
    const categoryDescription = req.body.categoryDescription;
    const categorySlug = req.body.categorySlug;
    const categoryImg = req.body.categoryImg;
    try {
        const result = await Category.findByIdAndUpdate(
            { 
                "_id": id 
            }, 
            { 
                categoryName,
                categoryDescription,
                categorySlug,
                categoryImg 
            }, 
            { new: true }
            //  (err, doc)
            );
            //console.log(result);
            res.status(200).json({ 
                result
            });
    } catch(err) {
        res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, catégorie non trouvée" });
        // res.status(404).json({ err });
    }
};

/**
 * 
 * get a single category in API //!API 
 * 
**/
export const apiGetCategory = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.categoryId;
    try{
        const category = await Category.findOne({ "_id": id });
        if (null == category) {
            res.status(404).json({ "message": "la catégorie n'existe pas" });
        }
        res.status(200).json({ category });
    } catch(err) {
        res.status(500).json({ "message": "serveur erreur" });
    }
    // const apiCategories = await Category.find({});
};

