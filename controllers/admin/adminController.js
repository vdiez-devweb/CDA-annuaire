import Category from "../../models/Category.js";
import Product from "../../models/Product.js";

const prefixTitle = "Panneau d'administration - ";
/**
 * 
 * get the list of all categories in dashboard webApp (it's the homepage of the dashboard)
 * 
**/
export const dashboard = async (req, res, next) => {
    const categories = await Category.find({});

    if (0 == categories) {
        res.status(404).render("admin/dashboard", {
            title: prefixTitle + "Catégories",
            products: "",
            category: "",
            flashMessage:"",
            message: "Aucune catégorie répertoriée."
        });
    }
    res.status(200).render("admin/dashboard", {
        title: prefixTitle + "Catégories",
        categories: categories,
        flashMessage:"",
        message: ""
    });
};

/**
 * 
 * get the list of all products in dashboard webApp 
 * 
**/
export const getProducts = async (req, res, next) => {
    //TODO ajouter le slug aux infos envoyées
    try{
        const products = await Product.find({});
        if (0 == products.length) {
            res.status(404).render("admin/getProducts", {
                title: prefixTitle + "Liste des produits",
                products: "",
                flashMessage:"",
                message: "Aucun produit trouvé."
            });
        }
        
        res.status(200).render("admin/getProducts", {
            title: prefixTitle + "Liste des produits",
            message: "",
            flashMessage:"",
            products: products 
        });
    } catch(error) {
        res.status(500).render("admin/getProducts", {
            title: prefixTitle + "Liste des produits",
            products: "",
            flashMessage:"",
            message: "Erreur serveur."
        });
    }
};
    
/**
 * 
 * get a single category with his list of products in dashboard webApp 
 * 
**/
export const getCategory = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const categorySlug = req.params.categorySlug;
    try{
        const category = await Category.findOne({ "categorySlug": categorySlug });
        const products = await Product.find({"productCategory": category._id});

        if (0 == category) {
            res.status(404).render("admin/getCategory", {
                title: prefixTitle + "Liste des produits par catégorie",
                products: "",
                category: "",
                flashMessage:"",
                message: "Catégorie introuvable."
            });
        }
        if ("" == products) {
            res.status(200).render("admin/getCategory", {
                title: prefixTitle + "Liste des produits " + category.categoryName,
                products: "",
                category: category,
                flashMessage:"",
                message: "Aucun produit dans cette catégorie."
            });
        }
        res.status(200).render("admin/getCategory", {
            title: prefixTitle + "Liste des produits " + category.categoryName,
            flashMessage:"",
            message: "",
            category: category,
            products: products 
        });
    } catch(error) {
        res.status(500).render("admin/getCategory", {
            title: prefixTitle + "Liste des produits",
            products: "",
            category: "",
            flashMessage:"",
            message: error
        });
    }
};

/**
 * 
 * render form to create Category (requête post) in admin dashboard 
 * 
**/
export const postCategory = (req, res, next) => {
    res.status(200).render("admin/createCategory", {
        title: prefixTitle + "Création de catégorie ",
        message: "",
        flashMessage: "",
        category: ""
    });
};

/**
 * 
 * Create Category (requête post) in admin dashboard 
 * 
**/
export const ajaxPostCategory = async (req, res, next) => {
    // envoyer le nom de la catégorie via req.body
    const categoryName = req.body.categoryName;
    const categoryDescription = req.body.categoryDescription;
    const categorySlug = req.body.categorySlug;

    //console.log(categoryName + " " + categorySlug + " " + categoryDescription);

    try{
        // on créé une nouvelle catégorie avec mongoose (Category est un objet Schema de mongoose déclaré dans le model)
        const category = await Category.create({
            // categoryName: categoryName,
            categoryName, // si la clé = valeur, on ne répète pas
            categoryDescription,
            categorySlug
        });

        res.status(201).render("admin/getCategory", {
            title: prefixTitle + "Création de catégorie ",
            message: "Aucun produit enregistré",
            products: "",
            flashMessage: "Catégorie " + category.categoryName + "créée",
            category: category
        });
    } catch(error) {
        res.status(500).render("admin/getCategory", {
            title: prefixTitle + "Création d'une catégorie",
            products: "",
            category: "",
            flashMessage:"",
            message: error
        });
    }
};

/**
 * 
 * delete a single category in webApp 
 * 
**/
export const deleteCategory = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const categorySlug = req.body.categorySlug;

    try{
        //je veux stocker le nom de la catégorie à supprimer
        // const result = await Category.findByIdAndDelete({ "_id": id });
        
        
        //tester si la catégorie a des produits
        const category = await Category.findOne({ "categorySlug": categorySlug });
        console.log(category);

        const nbProducts = await Product.count({"productCategory": category.category._id});
        console.log(nbProducts);
        
        //const result = await Category.findByIdAndDelete({ "categorySlug": categorySlug });

        // res.status(200).render("category/deleteCategory", {
        //     title: "Category",
        //     category: result,
        //     message: "Catégorie " + result.categoryName + " supprimée."
        // });
    } catch(error) {
        res.status(404).render("admin/dashboard", {
            title: "Category",
            category: null,
            // message: "Erreur : catégorie introuvable."
            flashMessage:"",
            message: error
        });
    }
};