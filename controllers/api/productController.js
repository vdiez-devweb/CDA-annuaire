import Product from "../../models/Product.js";

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
    const id = req.params.productId;
    try{
        const product = await Product.findOne({ "_id": id });
        if (null == product) {
            res.status(404).json({ "message": "le produit n'existe pas" });
        }
        res.status(200).json({ product });
    } catch(err) {
        res.status(500).json({ "message": "serveur erreur" });
    }
    // const apiProducts = await Product.find({});
 
};

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
 * delete a single Product in API  //!API
 * 
**/
export const apiDeleteProduct = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.productId;

    try{
        const product = await Product.deleteOne({ "_id": id });
        console.log(product);

        res.status(200).json({ "Message": "Produit supprimé." });
    } catch {
        res.status(404).json("Erreur : Produit introuvable.");
    }
};



