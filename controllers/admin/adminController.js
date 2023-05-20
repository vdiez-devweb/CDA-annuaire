import Category from "../../models/Category.js";
import Product from "../../models/Product.js";

const prefixTitle = "Panneau d'administration - ";

// function  getCategorySlugFromId (_id) {
//     const category = Category.findOne({ "_id": _id });
//     return category.categorySlug;
// }

// function  getCategoryIdFromSlug (slug) {
//     const category = Category.findOne({ "categorySlug": slug });
//     return category._id;
// }

/**
 * 
 * login administrator
 * 
**/
export const login = async (req, res, next) => {
    res.status(403).render("login", {
        title: "Page d'authentification",
        message: ""
    }); 
}
/**
 * 
 * authentification for administrator
 * 
**/
export const auth = (req, res, next) => {
    const username = req.body.user;
    const password = req.body.password;

    if (username && password) {
        if (req.session.authenticated) {
            res.json(session);
        } else {
            if (password === process.env.ADMIN_PASSWORD && username === process.env.ADMIN_USERNAME) {
                req.session.authenticated = true;
                req.session.user = { username };
                req.flash('message_success', 'Bienvenue sur le panneau d\'administration Concept Institut.');
                res.redirect("/admin");
            } else {
                res.status(403).render("login", {
                    title: "Login",
                    message: "Erreur mot de passe."
                });           
            }
        }
    } else {
        res.status(403).render("login", {
            title: "Login",
            message: "Erreur login ou mot de passe."
        });
    }
}
/**
 * 
 * logout for administrator, go to the homepage of the webapp
 * 
**/
export const logout = (req, res, next) => {
    req.session.destroy((err)=> {
        res.redirect("../");
    });
}

/**
 * 
 * get the list of all categories in dashboard webApp (it's the homepage of the dashboard)
 * TODO proposer un affichage type dashboard avec le nb de catégories et de produits, nb de connexion etc.
 * 
**/
export const dashboard = async (req, res, next) => {
    const categories = await Category.find({});

    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');

    if (0 == categories) {
        res.status(404).render("admin/dashboard", {
            title: prefixTitle + "Catégories",
            categories: "",
            msg_success,
            msg_error,
            message: "Aucune catégorie répertoriée."
        });
    }
    res.status(200).render("admin/dashboard", {
        title: prefixTitle + "Catégories",
        categories: categories,
        message_success: req.flash('message_success'),
        message_error: req.flash('message_error'),
        msg_success,
        msg_error,
        message: ""
    });
};

/**
 * 
 * get the list of all categories in dashboard webApp (it's the homepage of the dashboard)
 * 
**/
export const getCategories = async (req, res, next) => {
    const categories = await Category.find({});

    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');

    if (0 == categories) {
        res.status(404).render("admin/getCategories", {
            title: prefixTitle + "Catégories",
            categories: "",
            msg_success,
            msg_error,
            message: "Aucune catégorie répertoriée."
        });
    }
    res.status(200).render("admin/getCategories", {
        title: prefixTitle + "Catégories",
        categories: categories,
        message_success: req.flash('message_success'),
        message_error: req.flash('message_error'),
        msg_success,
        msg_error,
        message: ""
    });
};

/**
 * 
 * get a single category with his list of products in dashboard webApp 
 * 
**/
export const getCategory = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const categorySlug = req.params.categorySlug;

    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');

    try{
        const category = await Category.findOne({ "categorySlug": categorySlug });
        const products = await Product.find({"productCategory": category._id});

        if (0 == category) {
            res.status(404).render("admin/getCategory", {
                title: prefixTitle + "Liste des produits par catégorie",
                products: "",
                category: "",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,
                message: "Catégorie introuvable."
            });
        }
        if ("" == products) {
            res.status(200).render("admin/getCategory", {
                title: prefixTitle + "Liste des produits " + category.categoryName,
                products: "",
                category: category,
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,
                message: "Aucun produit dans cette catégorie."
            });
        }
        res.status(200).render("admin/getCategory", {
            title: prefixTitle + "Liste des produits " + category.categoryName,
            category: category,
            products: products,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: ""
        });
    } catch(error) {
        req.flash('message_error', error);
        res.status(500).render("admin/getCategory", {
            title: prefixTitle + "Liste des produits",
            products: "",
            category: "",
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: ""
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
        category: "",
        message: ""
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
    const categoryImg = req.body.categoryImg ? req.body.categoryImg : false;

    try{
        // on créé une nouvelle catégorie avec mongoose (Category est un objet Schema de mongoose déclaré dans le model)
        const category = await Category.create({
            // categoryName: categoryName,
            categoryName, // si la clé = valeur, on ne répète pas
            categoryDescription,
            categorySlug,
            categoryImg
        });
        req.flash('message_success', "Catégorie " + category.categoryName + " créée");
        res.status(201).redirect("/admin/category/" + category.categorySlug);
    } catch(error) {
        //! attention, avec le render, si on actualise ça relance la requête de création : j'utilise le redirect avec connect-flash
        req.flash('message_error', "ERREUR " + error);
        res.status(500).redirect("/admin/categories");
        // res.status(500).render("admin/getCategory", {
        //     title: prefixTitle + "Création d'une catégorie",
        //     products: "",
        //     category: "",
        //     flashMessage:"",
        //     message: error
        // });
    }
};

/**
 * 
 * delete a single category in webApp 
 * 
**/
// TODO supprimer plusieurs catégories en 1 seule fois avec des checkbox
export const deleteCategory = async (req, res, next) => {
    const categorySlug = req.params.categorySlug;
 
    try{
        const category = await Category.findOne({ "categorySlug": categorySlug });
        const nbProducts = await Product.count({"productCategory": category._id});
        const categoryName = category.categoryName;

        if (0 == category) {
            req.flash('message_error', "erreur, catégorie introuvable.");
            res.status(404).redirect("/admin/categories");
        }
        if (0 != nbProducts) {
            req.flash('message_error', "Impossible de supprimer cette catégorie car elle contient des produits."),
            res.status(500).redirect("/admin/category/" + category.categorySlug);
        } else {
            const result = await Category.findByIdAndDelete({ "_id": category._id  });
            req.flash('message_success', "Catégorie " + categoryName + " supprimée");
            res.status(200).redirect("/admin/categories");
        }
      } catch(error) {
        req.flash('message_error', error);
        res.status(200).redirect("/admin/categories");
    }
};

/**
 * 
 * get the list of all products in dashboard webApp 
 * 
**/
export const getProducts = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    try{
        const products = await Product.find({}).populate("productCategory");

        if (0 == products.length) {
            res.status(404).render("admin/getProducts", {
                title: prefixTitle + "Liste des produits",
                products: "",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,
                message: "Aucun produit trouvé."
            });
        }
        res.status(200).render("admin/getProducts", {
            title: prefixTitle + "Liste des produits",
            products: products,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: "",
        });
    } catch(error) {
        res.status(500).render("admin/getProducts", {
            title: prefixTitle + "Liste des produits",
            products: "",
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: error
        });
    }
};
    
/**
 * 
 * delete a single category in webApp 
 * 
**/
// TODO supprimer plusieurs produits en 1 seule fois avec des checkbox
export const deleteProduct = async (req, res, next) => {
    const productId = req.params.productId;
    const categorySlug = req.params.categorySlug;

    try{
        const product = await Product.findByIdAndDelete({ "_id": productId });
        if (null != product) {
            req.flash('message_success', "Produit " + product.productName + " supprimé.");
            if (categorySlug) {
                res.status(200).redirect("/admin/category/" + categorySlug);
            } else {
                res.status(200).redirect("/admin/products/");
            }
        } else {
            req.flash('message_error', "ERREUR produit introuvable.");
            if (categorySlug) {
                res.status(500).redirect("/admin/category/" + categorySlug);
            } else {
                res.status(500).redirect("/admin/products/");
            }
        }
      } catch(error) {
        req.flash('message_error', "ERREUR " + error);
        if (categorySlug) {
            res.status(500).redirect("/admin/category/" + categorySlug);
        } else {
            res.status(500).redirect("/admin/products/");
        }
    }
};

/**
 * 
 * render form to create Product (requête post) in admin dashboard 
 * 
**/
export const postProduct = async(req, res, next) => {
    const categorySlug = req.params.categorySlug;
    let categorySelected = null;
    if (categorySlug != null) {
        categorySelected = await Category.findOne({ "categorySlug": categorySlug });
        if (categorySelected) categorySelected = categorySelected._id.toString()
    } 
    const categories = await Category.find({});

    if (0 == categories) {
        res.status(404).render("admin/createProduct", {
            title: prefixTitle + " Création de produit",
            categories: "",
            categorySelected: categorySelected,
            message: "Aucune catégorie répertoriée, vous devez créer une catégorie avant de pouvoir ajouter un produit."
        });
    }
    res.status(200).render("admin/createProduct", {
        title: prefixTitle + " Création de produit",
        categories: categories,
        categorySelected: categorySelected,
        message: ""
    });
};

/**
 * 
 * Create Product (requête post) in admin dashboard 
 * 
**/
export const ajaxPostProduct = async (req, res, next) => {
    // envoyer le nom de la catégorie via req.body
    const productName = req.body.productName;
    const productDescription = req.body.productDescription;
    const productPrice = req.body.productPrice;
    const productCategoryId = req.body.productCategoryId;
    
    try{
        // on créé un nouveau produit avec mongoose (Product est un objet Schema de mongoose déclaré dans le model)
        const product = await Product.create({
            productName, // si la clé = valeur, on ne répète pas
            productDescription,
            productPrice, 
            productCategory: productCategoryId
        });

        const category = await Category.findOne({ "_id": productCategoryId });

        req.flash('message_success', "Produit " + product.productName + " créé");
        res.status(201).redirect("/admin/category/" + category.categorySlug);
    } catch(error) {
        req.flash('message_error', "ERREUR " + error);
        res.status(500).redirect("/admin/products/");
    }
};