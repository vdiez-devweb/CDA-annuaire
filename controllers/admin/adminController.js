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
        flashMessage: "",
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
                req.session.flashMessage = "";
                req.session.error = "";
                req.session.success = "";
                res.redirect("/admin");
            } else {
                res.status(403).render("login", {
                    title: "",
                    flashMessage: "",
                    message: "Erreur mot de passe."
                });           
            }
        }
    } else {
        res.status(403).render("login", {
            title: "",
            flashMessage: "",
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
 * 
**/
export const dashboard = async (req, res, next) => {
    const categories = await Category.find({});

    let flashMessage = req.session.flashMessage ;
    let message = req.session.error ;
    req.session.error = "";
    req.session.flashMessage = "";

    if (0 == categories) {
        res.status(404).render("admin/dashboard", {
            title: prefixTitle + "Catégories",
            // products: "",
            categories: "",
            flashMessage,
            message: "Aucune catégorie répertoriée."
        });
    }
    res.status(200).render("admin/dashboard", {
        title: prefixTitle + "Catégories",
        categories: categories,
        flashMessage,
        message
    });
};

/**
 * 
 * get the list of all products in dashboard webApp 
 * 
**/
//TODO ajouter le slug aux infos envoyées ?
export const getProducts = async (req, res, next) => {

    let flashMessage = req.session.flashMessage ;
    let message = req.session.error ;
    req.session.error = "";
    req.session.flashMessage = "";
    
    try{
        const products = await Product.find({});
        if (0 == products.length) {
            res.status(404).render("admin/getProducts", {
                title: prefixTitle + "Liste des produits",
                products: "",
                flashMessage,
                message: "Aucun produit trouvé."
            });
        }
        
        res.status(200).render("admin/getProducts", {
            title: prefixTitle + "Liste des produits",
            message,
            flashMessage,
            products: products 
        });
    } catch(error) {
        res.status(500).render("admin/getProducts", {
            title: prefixTitle + "Liste des produits",
            products: "",
            flashMessage,
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

    let flashMessage = req.session.flashMessage ;
    let message = req.session.error ;
    req.session.error = "";
    req.session.flashMessage = "";

    try{
        const category = await Category.findOne({ "categorySlug": categorySlug });
        const products = await Product.find({"productCategory": category._id});

        if (0 == category) {
            res.status(404).render("admin/getCategory", {
                title: prefixTitle + "Liste des produits par catégorie",
                products: "",
                category: "",
                flashMessage,
                message: "Catégorie introuvable."
            });
        }
        if ("" == products) {
            res.status(200).render("admin/getCategory", {
                title: prefixTitle + "Liste des produits " + category.categoryName,
                products: "",
                category: category,
                flashMessage,
                message: "Aucun produit dans cette catégorie."
            });
        }
        res.status(200).render("admin/getCategory", {
            title: prefixTitle + "Liste des produits " + category.categoryName,
            flashMessage,
            message,
            category: category,
            products: products 
        });
    } catch(error) {
        res.status(500).render("admin/getCategory", {
            title: prefixTitle + "Liste des produits",
            products: "",
            category: "",
            flashMessage,
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
    let flashMessage = req.session.flashMessage ;
    let message = req.session.error ;
    req.session.error = "";
    req.session.flashMessage = "";
    
    res.status(200).render("admin/createCategory", {
        title: prefixTitle + "Création de catégorie ",
        message,
        flashMessage,
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
    const categoryImg = req.body.categoryImg;

    let flashMessage = req.session.flashMessage ;
    let message = req.session.error ;
    req.session.error = "";
    req.session.flashMessage = "";
    
    try{
        // on créé une nouvelle catégorie avec mongoose (Category est un objet Schema de mongoose déclaré dans le model)
        const category = await Category.create({
            // categoryName: categoryName,
            categoryName, // si la clé = valeur, on ne répète pas
            categoryDescription,
            categorySlug,
            categoryImg
        });
        req.session.flashMessage = "Catégorie " + category.categoryName + " créée";
        res.status(201).redirect("/admin/category/" + category.categorySlug);
        // res.status(201).render("admin/getCategory", {
        //     title: prefixTitle + "Création de catégorie ",
        //     message: "Aucun produit enregistré",
        //     products: "",
        //     flashMessage: "Catégorie " + category.categoryName + " créée",
        //     category: category
        // });
    } catch(error) {
        //! attention, avec le render, si on actualise ça relance la requête de création 
        req.session.error = error;
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
    let flashMessage = req.session.flashMessage ;
    let message = req.session.error ;
    req.session.error = "";
    req.session.flashMessage = "";
    
    try{
        const category = await Category.findOne({ "categorySlug": categorySlug });
        const nbProducts = await Product.count({"productCategory": category._id});
        if (0 == category) {
            res.status(404).render("admin/deleteCategory", {
                title: prefixTitle + "Suppression d'une catégorie",
                categoryName: "",
                flashMessage,
                message: "Catégorie introuvable."
            });
        }
        const categoryName = category.categoryName;
        if (0 != nbProducts) {
            req.session.error = "Impossible de supprimer cette catégorie car elle contient des produits.";
            res.status(500).redirect("/admin/category/" + category.categorySlug);
            // res.status(200).render("admin/deleteCategory", {
            //     title: prefixTitle + "Suppression d'une catégorie",
            //     categoryName: categoryName,
            //     flashMessage,
            //     message: "Impossible de supprimer cette catégorie car elle contient des produits."
            // });
        } else {
            const result = await Category.findByIdAndDelete({ "_id": category._id  });
            res.status(200).render("admin/deleteCategory", {
                title: prefixTitle + "Suppression d'une catégorie",
                flashMessage:"Catégorie " + categoryName + " supprimée",
                categoryName: categoryName,
                message,
            });
        }

      } catch(error) {
        res.status(404).render("admin/deleteCategory", {
            title: "Suppression de catégorie",
            categoryName: "",
            flashMessage,
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
    let flashMessage = req.session.flashMessage ;
    let message = req.session.error ;
    req.session.error = "";
    req.session.flashMessage = "";
        // console.log("produit ID " + productId);
    try{
        const product = await Product.findByIdAndDelete({ "_id": productId });
       //? console.log("produit " + product);
            if (null != product) {
                req.session.flashMessage = "Produit " + product.productName + " supprimé.";
                if (categorySlug) {
                    res.status(200).redirect("/admin/category/" + categorySlug);
                } else {
                    res.status(200).redirect("/admin/products/");
                }
                // res.status(200).render("admin/deleteProduct", {
                //     title: prefixTitle + "Suppression d'un produit",
                //     flashMessage:"Produit supprimé",
                //     product: product,
                //     message: "",
                // });
            } else {
                req.session.error = "ERREUR : produit introuvable.";
                if (categorySlug) {
                    res.status(500).redirect("/admin/category/" + categorySlug);
                } else {
                    res.status(500).redirect("/admin/products/");
                }
                // res.status(404).render("admin/deleteProduct", {
                //     title: prefixTitle + "Suppression d'un produit",
                //     flashMessage:"",
                //     product: product,
                //     message: "Erreur : produit introuvable.",
                // });
            }
      } catch(error) {
        // console.log("ERREUR : " + error);
        req.session.error = "ERREUR " + error;
        if (categorySlug) {
            res.status(500).redirect("/admin/category/" + categorySlug);
        } else {
            res.status(500).redirect("/admin/products/");
        }
        // res.status(500).render("admin/deleteProduct", {
        //     title: "Suppression de produit",
        //     product: "",
        //     flashMessage:"",
        //     message: error
        // });
    }
};

/**
 * 
 * render form to create Product (requête post) in admin dashboard 
 * 
**/
export const postProduct = async(req, res, next) => {
    const categorySlug = req.params.categorySlug;
    const categorySelected = await Category.findOne({ "categorySlug": categorySlug });

    const categories = await Category.find({});
    let flashMessage = req.session.flashMessage ;
    let message = req.session.error ;
    req.session.error = "";
    req.session.flashMessage = "";

    if (0 == categories) {
        res.status(404).render("admin/createProduct", {
            title: prefixTitle + " Création de produit",
            categories: "",
            flashMessage,
            message: "Aucune catégorie répertoriée, vous devez créer une catégorie avant de pouvoir ajouter un produit."
        });
    }
    console.log(categorySelected._id);
    res.status(200).render("admin/createProduct", {
        title: prefixTitle + " Création de produit",
        categories: categories,
        categorySelected: categorySelected._id.toString(),
        flashMessage,
        message
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

    let flashMessage = req.session.flashMessage ;
    let message = req.session.error ;
    req.session.error = "";
    req.session.flashMessage = "";

    //console.log(productName + " " + productSlug + " " + productDescription);

    try{
        // on créé un nouveau produit avec mongoose (Product est un objet Schema de mongoose déclaré dans le model)
        const product = await Product.create({
            productName, // si la clé = valeur, on ne répète pas
            productDescription,
            productPrice, 
            productCategory: productCategoryId
        });
        const category = await Category.findOne({ "_id": productCategoryId });

        req.session.flashMessage = "Produit " + product.productName + " créé";
        res.status(201).redirect("/admin/category/" + category.categorySlug);
        // res.status(201).render("admin/getProduct", {
        //     title: prefixTitle + "Création du produit ",
        //     product: product,
        //     category: category,
        //     flashMessage: "Produit " + product.productName + " créé",
        //     message: ""
        // });    
    } catch(error) {
        req.session.error = "ERREUR " + error;
        res.status(500).redirect("/admin/products/");
        // res.status(500).render("admin/getProduct", {
        //     title: prefixTitle + "Création d'un produit",
        //     product: "",
        //     flashMessage:"",
        //     category: "",
        //     message: error
        // });
    }
};