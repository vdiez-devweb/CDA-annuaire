import Product from "../models/Product.js";

/**
 * 
 * get a single Product in webApp 
 * 
**/
export const getProduct = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.productId;
    try{ //je récupère les infos de la catégorie par .populate
        const product = await Product.findOne({ "_id": id }).populate("productCategory");
        if (null == product) {
            res.status(404).render("product/getProduct", {
                title: "Erreur Fiche produit",
                product: "",
                message: "Erreur : produit introuvable."
            });
        }
        res.status(200).render("product/getProduct", {
            title: "Fiche Produit " + product.productName,
            product: product,
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
        const products = await Product.find({}).populate("productCategory");

        if (0 == products.length) {
            res.status(404).render("product/getProducts", {
                title: "Liste des produits",
                products: "",
                message: "Aucun produit trouvé."
            });
        }

        res.status(200).render("product/getProducts", {
            title: "Liste des produits",
            message: "",
            products: products 
        });
    } catch(error) {
        res.status(500).render("product/getProducts", {
            title: "Liste des produits",
            products: "",
            message: "Erreur serveur."
        });
    }
};



