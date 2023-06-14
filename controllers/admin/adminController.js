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
    let dashboardHomepageURL = process.env.BASE_URL + "/admin";   
    // si on vient directement sur la page de login (referrer undefined) on renverra sur la homepage du dashboard
    let referer = (typeof req.get('Referrer') == 'undefined') ? dashboardHomepageURL : req.get('Referrer');

    //si on vient du dashboard admin, on envoie bien le referrer, sinon on renvoie l'url /admin (homepage du dashboard)
    let fromURL = referer.includes(dashboardHomepageURL) ? referer : dashboardHomepageURL;   
    
    res.status(403).render("login", {
        title: "Page d'authentification",
        message: "",
        fromURL: fromURL 
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
    const fromURL = req.body.fromURL;

    if (username && password) {
        if (req.session.authenticated) {
            res.json(session);
        } else {
            if (password === process.env.ADMIN_PASSWORD && username === process.env.ADMIN_USERNAME) {
                req.session.authenticated = true;
                req.session.user = { username };
                req.flash('message_success', 'Bienvenue sur le panneau d\'administration Concept Institut.');
                res.redirect(fromURL);
            } else {
                res.status(403).render("login", {
                    title: "Login",
                    message: "Erreur mot de passe.",
                    fromURL: fromURL
                });           
            }
        }
    } else {
        res.status(403).render("login", {
            title: "Login",
            fromURL: fromURL,
            message: "Erreur login ou mot de passe."
        });
    }
}
/**
 * 
 * logout for administrator, go to the homepage of the admin dashboard
 * 
**/
export const logout = (req, res, next) => {
    req.session.destroy((err)=> {
        res.redirect("../");
    });
}

/**
 * 
 * get the list of all categories in admin dashboard (it's the homepage of the dashboard)
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
 * get the list of all categories in admin dashboard (it's the homepage of the dashboard)
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
 * get a single category with his list of products in admin dashboard 
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
        if (error.errors){
            req.flash('message_error', "ERREUR " + error);
            res.status(500).redirect("/admin/create-product/"); 
            return;           
        }
        req.flash('message_error', "ERREUR " + error);
        //! attention, avec le render, si on actualise ça relance la requête de création : j'utilise le redirect avec connect-flash
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
 * delete a single category in admin dashboard 
 * 
**/
// TODO supprimer plusieurs catégories en 1 seule fois avec des checkbox
export const deleteCategory = async (req, res, next) => {
    const categorySlug = req.params.categorySlug;
 
    try{
        const category = await Category.findOne({ "categorySlug": categorySlug });
        const categoryName = category.categoryName;

        if (0 == category) {
            req.flash('message_error', "erreur, catégorie introuvable.");
            res.status(404).redirect("/admin/categories");
        }
        if (0 != category.categoryNbProducts) {
            req.flash('message_error', "Impossible de supprimer cette catégorie car elle contient des produits."),
            res.status(400).redirect("/admin/category/" + category.categorySlug);
        } else {
            const result = await Category.findByIdAndDelete({ "_id": category._id  });
            req.flash('message_success', "Catégorie " + categoryName + " supprimée");
            res.status(200).redirect("/admin/categories");
        }
      } catch(error) {
        req.flash('message_error', error);
        res.status(500).redirect("/admin/categories");
    }
};

/**
 * 
 * get the list of all products in admin dashboard 
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
 * get a single Product in admin dashboard 
 * 
**/
export const getProduct = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');


    const id = req.params.productId;
    try{ //je récupère les infos de la catégorie par .populate
        const product = await Product.findOne({ "_id": id }).populate("productCategory");
        if (null == product) {
            res.status(404).render("admin/getProduct", {
                title: "Erreur Fiche produit",
                product: "",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,                
                message: "Erreur : produit introuvable."
            });
        }
        res.status(200).render("admin/getProduct", {
            title: "Fiche Produit " + product.productName,
            product: product,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: ""
        });
    } catch {
        res.status(404).render("admin/getProduct", {
            title: "Erreur Fiche produit",
            product: "",
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: "Erreur serveur."
        });
    }
};
    
/**
 * 
 * delete a single category in admin dashboard 
 * 
**/
// TODO supprimer plusieurs produits en 1 seule fois avec des checkbox
export const deleteProduct = async (req, res, next) => {
    const productId = req.params.productId;
    const categorySlug = req.params.categorySlug;

    try{
        const product = await Product.findByIdAndDelete({ "_id": productId });
        if (null != product) {
            const category = await Category.findByIdAndUpdate(
                { "_id": product.productCategory }, 
                { $inc: { categoryNbProducts: -1 } }, 
                { new: true }
                //  (err, doc)
            );

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
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
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
        message_success: req.flash('message_success'),
        message_error: req.flash('message_error'),
        msg_success,
        msg_error,    
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

        //const category = await Category.findOne({ "_id": productCategoryId });
        const category = await Category.findByIdAndUpdate(
            { "_id": productCategoryId }, 
            { $inc: { categoryNbProducts: 1 } }, 
            { new: true }
            //  (err, doc)
        );
        req.flash('message_success', "Produit " + product.productName + " créé");
        res.status(201).redirect("/admin/category/" + category.categorySlug);
    } catch(error) {
        if (error.errors){
            req.flash('message_error', "ERREUR " + error);
            res.status(500).redirect("/admin/create-product/"); 
            return;           
        }
        req.flash('message_error', "ERREUR " + error);
        res.status(500).redirect("/admin/products/");
    }
};

/**
 * 
 * render form to update Product (requête patch) in admin dashboard 
 * 
**/
export const updateProduct = async(req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.productId;
    try{ 
    
        const product = await Product.findOne({ "_id": id }).populate("productCategory");

        const categorySlug = product.productCategory.categorySlug;
        let categorySelected = product.productCategory._id.toString();

        // if (categorySlug != null) {
        //     categorySelected = await Category.findOne({ "categorySlug": categorySlug });
        //     if (categorySelected) categorySelected = categorySelected._id.toString()
        // }     

        const categories = await Category.find({});

        if (null == product) {
            res.status(404).render("admin/getProducts", {
                title: "Erreur modification produit",
                product: "",
                categories: "",
                categorySelected: categorySelected,
                message: "Erreur : produit introuvable."
            });
        }
        if (0 == categories) {
            res.status(404).render("admin/updateProduct", {
                title: prefixTitle + " Modifier un produit",
                categories: "",
                categorySelected: categorySelected,
                message: "Erreur : Aucune catégorie répertoriée."
            });
        }
        res.status(200).render("admin/updateProduct", {
            title: "Modifier Produit " + product.productName,
            categories: categories,
            categorySelected: categorySelected,
            product: product,
            message: ""
        });
    } catch {
        res.status(404).render("admin/getProducts", {
            title: "Erreur modification produit",
            categories: "",
            categorySelected: categorySelected,
            product: "",
            message: "Erreur serveur."
        });
    }
};

/**
 * 
 * Update Product (requête patch) in admin dashboard 
 * 
**/
export const ajaxUpdateProduct = async (req, res, next) => {
     //on récupère l'identifiant donné dans la route paramétrique et le nouveau nom passé dans le corps de la requête
     const id = req.params.productId;
     const productName = req.body.productName;
     const productDescription = req.body.productDescription;
     const productPrice = req.body.productPrice;
     const productCategoryId = req.body.productCategoryId;
    try{
        const result = await Product.findByIdAndUpdate(
        { "_id": id }, 
        { 
            productName,
            productPrice: productPrice,
            productDescription : productDescription,
            productCategoryId: productCategoryId,
        }, 
        { new: true }
        //  (err, doc)
        );
        if (null == result) {
            res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, produit non trouvé" });
        }
        req.flash('message_success', "Produit " + result.productName + " modifié ");
        res.status(200).redirect("/admin/product/" + id);
    } catch(error) {
        if (error.errors){
            req.flash('message_error', "ERREUR " + error);
            res.status(500).redirect("/admin/create-product/"); 
            return;           
        }
        req.flash('message_error', "ERREUR " + error);
        res.status(500).redirect("/admin/products/");
    }
};

/**
 * 
 * render form to update Product (requête patch) in admin dashboard 
 * 
**/
export const updateCategory = async(req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const categorySlug = req.params.categorySlug;
    try{ 
    
        const category = await Category.findOne({ "categorySlug": categorySlug });
        // pour éventuellement mettre à jour le compteur de produits de la catégorie avec le nombre réel de produits enregistré dans la base
        const count =  await Product.countDocuments({productCategory: category._id});

        if (null == category) {
            res.status(404).render("admin/getCategories", {
                title: "Erreur modification catégorie",
                category: "",
                message: "Erreur : Catégorie introuvable."
            });
        }
        res.status(200).render("admin/updateCategory", {
            title: "Modifier catégorie " + category.categoryName,
            category: category,
            nbProductsInBDD: count,
            message: ""
        });
    } catch {
        res.status(404).render("admin/getCategories", {
            title: "Erreur modification catégorie",
            category: "",
            message: "Erreur serveur."
        });
    }
};

/**
 * 
 * Update Product (requête patch) in admin dashboard 
 * 
**/
export const ajaxUpdateCategory = async (req, res, next) => {
     //on récupère l'identifiant donné dans la route paramétrique et le nouveau nom passé dans le corps de la requête
     const id = req.body.id;
     const categorySlug = req.body.categorySlug;
     const categoryName = req.body.categoryName;
     const categoryDescription = req.body.categoryDescription;
     const categoryImg = req.body.categoryImg;
     const categoryNbProducts = req.body.categoryNbProducts;
    try{
        const result = await Category.findByIdAndUpdate(
        { "_id": id }, 
        { 
            categoryName,
            categorySlug :categorySlug,
            categoryDescription : categoryDescription,
            categoryImg: categoryImg,
            categoryNbProducts: categoryNbProducts,
        }, 
        { new: true }
        //  (err, doc)
        );
        if (null == result) {
            res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, catégorie non trouvée" });
        }
        req.flash('message_success', "Catégorie " + result.categoryName + " modifiée ");
        res.status(200).redirect("/admin/category/" + categorySlug);
    } catch(error) {
        if (error.errors){
            req.flash('message_error', "ERREUR " + error);
            res.status(500).redirect("/admin/create-product/"); 
            return;           
        }        
        req.flash('message_error', "ERREUR " + error);
        res.status(500).redirect("/admin/categories/");
    }
};

/**
 * 
 * Update number of Product in a category in admin dashboard 
 * 
**/
export const ajaxUpdateNbProductsInCategory = async (req, res, next) => {
    const id = req.params.categoryId;
    const categoryNbProducts =  await Product.countDocuments({productCategory: id});
    
   try{
       const result = await Category.findByIdAndUpdate(
       { "_id": id }, 
       { 
           categoryNbProducts: categoryNbProducts,
       }, 
       { new: true }
       //  (err, doc)
       );
       if (null == result) {
           res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, catégorie non trouvée" });
       }
       req.flash('message_success', "le compteur de produits de la catégorie " + result.categoryName + " a été rafraîchi ");
       res.status(200).redirect(req.get('Referrer'));
   } catch(err) {
       req.flash('message_error', "ERREUR " + err);
       res.status(500).redirect(req.get('Referrer'));
   }
};