import Product from "../models/Product.js";
import Category from "../models/Category.js";

/**
 * 
 * Create Product (requête post) in API  //!API
 * 
**/
export const apiPostProduct = async (req, res, next) => {
    // récupérer les infos du produit à créer via req.body
    const productName = req.body.productName;
    const productPrice = req.body.productPrice;
    const productDescription = req.body.productDescription;
    const productCategory = req.body.productCategory;
    try {
        //créer le produit en BDD
        const product = await Product.create({
            productName: productName, 
            productPrice: productPrice,
            productDescription : productDescription,
            productCategory: productCategory,
        });
        //renvoyer les infos à la vue
        // res.status(201).redirect("/products");
        // res.status(201).send("Product created : ", product);
        res.status(201).json({ product });
    } catch(err) {
        console.log(err);
    }
};

/**
 * 
 * Update Product (requête patch) in API //!API
 * 
**/
export const apiUpdateProduct = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique et le nouveau nom passé dans le corps de la requête
    const id = req.body.id;
    const productName = req.body.productName;
    const productPrice = req.body.productPrice;
    const productDescription = req.body.productDescription;
    const productCategory = req.body.productCategory;
    try{
        const result = await Product.findByIdAndUpdate(
            { "_id": id }, 
            { 
                productName,
                productPrice: productPrice,
                productDescription : productDescription,
                productCategory: productCategory,
            }, 
            { new: true }
            //  (err, doc)
        );
        if (null == result) {
            res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, produit non trouvé" });
        }
        res.status(200).json({ 
            result
        });
    } catch(err) {
        res.status(404).json({ "ErrorMessage": err });
    }
};

/**
 * 
 * get a single Product in API  //!API
 * 
**/
export const apiGetProduct = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.ProductId;
    try{
        const Product = await Product.findOne({ "_id": id });
        if (null == Product) {
            res.status(404).json({ "message": "la catégorie n'existe pas" });
        }
        res.status(200).json({ Product });
    } catch(err) {
        res.status(500).json({ "message": "serveur erreur" });
    }
    const apiProducts = await Product.find({});
 
};

/**
 * 
 * get a single Product in webApp 
 * 
**/
export const getProduct = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.productId;
    try{
        const product = await Product.findOne({ "_id": id });
        if (null == product) {
            res.status(404).render("product/getProduct", {
                title: "Erreur Fiche produit",
                product: "",
                message: "Erreur : produit introuvable."
            });
        }
        const category = await Category.findOne({ "_id": product.productCategory });
        res.status(200).render("product/getProduct", {
            title: "Fiche Produit " + product.productName,
            product: product,
            category: category,
            message: ""
        });
    } catch {
        res.status(404).render("product/getProduct", {
            title: "Erreur Fiche produit",
            product: "",
            message: "Erreur serveur."
        });
    }
};

/**
 * 
 * get all products in webApp
 * 
**/
export const getProducts = async (req, res, next) => {
    try{
        const products = await Product.find({});
        if (0 == products.length) {
            res.status(404).render("Product/getProducts", {
                title: "Liste des produits",
                products: "",
                message: "Aucun produit trouvé."
            });
        }

        res.status(200).render("Product/getProducts", {
            title: "Liste des produits",
            message: "",
            products: products 
        });
    } catch(error) {
        res.status(500).render("Product/getProducts", {
            title: "Liste des produits",
            products: "",
            message: "Erreur serveur."
        });
    }
};

/**
 * 
 * get all products in webApp
 * 
**/
// export const getProductsByCategory = async (req, res, next) => {
//     const categoryId = req.params.productId;

//     try{
//         const category = await Category.findOne({ "_id": categoryId });
//         const products = await Product.find({"productCategory": categoryId});
//         //Peut-on récupérer la catégorie avec la méthode getCategory ???        
//         if (0 == category) {
//             res.status(404).render("product/getProductsByCategory", {
//                 title: "Liste des produits",
//                 products: "",
//                 category: "",
//                 message: "Catégorie introuvable."
//             });
//         }
//         if (0 == products.length) {
//             res.status(404).render("product/getProductsByCategory", {
//                 title: "Liste des produits",
//                 products: "",
//                 category: category,
//                 message: "Aucun produit trouvé."
//             });
//         }
//         res.status(200).render("product/getProductsByCategory", {
//             title: "Liste des produits",
//             message: "",
//             category: category,
//             products: products 
//         });
//     } catch(error) {
//         res.status(500).render("product/getProductsByCategory", {
//             title: "Liste des produits",
//             products: "",
//             category: "",
//             message: error
//         });
//     }
// };

/**
 * 
 * get all products in API  //!API
 * 
**/
export const apiGetProducts = async (req, res, next) => {
    const apiProducts = await Product.find();
    if (0 == apiProducts.length) {
        res.status(404).json( "Aucun produit n'est trouvé" );
    }
    res.status(200).json({ apiProducts });
 };

/**
 * 
 * delete a single Product in webApp 
 * 
**/
export const deleteProduct = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.productId;

    try{
        //je veux stocker le nom de la catégorie à supprimer
        const result = await Product.findByIdAndDelete({ "_id": id });

        res.status(200).render("product/deleteProduct", {
            title: "Suppression produit",
            // product: result,
            message: "Produit " + result.productName + " supprimé."
        });
    } catch {
        res.status(404).render("product/deleteProduct", {
            title: "Erreur suppression produit",
            // product: null,
            message: "Erreur : produit introuvable."
        });
    }
};

/**
 * 
 * delete a single Product in API  //!API
 * 
**/
export const apiDeleteProduct = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.ProductId;

    try{
        const Product = await Product.deleteOne({ "_id": id });
        console.log(Product);

        res.status(200).json({ "Erreur": "catégorie supprimée." });
    } catch {
        res.status(404).json("Erreur : catégorie introuvable.");
    }
};



