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
        const productSchema = {
            productName: productName, 
            productPrice: productPrice,
            productDescription : productDescription,
            productCategory: productCategory,
        }
        const product = await Product.create(productSchema);
        //renvoyer les infos à la vue
        res.status(201).json({ product });
    } catch(error) {
        // !pour retravailler le message renvoyé, (ne sera pas visible en production), => utiliser les exceptions
        // if (error.errors) {//si on a des erreurs de validation Mongoose :
        //     let customError = {}; //on créé un tableau vide
        //     let fieldsInErrors = Object.keys(error.errors); // on récupère les champs qui sont en erreur
            


        //     //on parcours l'objet d'erreurs pour construire la réponse
        //     (fieldsInErrors).forEach(currentField => {
        //         // switch (error.errors[currentField].) {
        //         //     case kind:
                        
        //         //         break;
                        
        //         //         default:
        //         //             break;
        //         // }
                        
                        
        //         customError[currentField] = error.errors[currentField]['properties']['message']; //message pour le required
        //         if (error.errors[currentField]['properties']['type'] == "unique") { // message pour l'unicité
        //             customError[currentField] = 'Le champ ' + currentField + ' doit être unique, <' 
        //                                         + error.errors[currentField]['properties']['value'] + '> existe déjà!';
        //         }
        //     });
        //     error = customError;
        // }
        res.status(400).json({ error });
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
    } catch(error) {
        // !pour retravailler le message renvoyé, (ne sera pas visible en production), => utiliser les exceptions
        // let customError = {}; //on créé un objet vide
        // let fieldsInErrors = []; // on créé un tableau vide
        // if (error.errors) {//si on a des erreurs de validation Mongoose :
        //     fieldsInErrors = Object.keys(error.errors); // on récupère les champs qui sont en erreur
        //     (fieldsInErrors).forEach(currentField => { //on parcours l'objet d'erreurs pour construire la réponse
        //         customError[currentField] = error.errors[currentField]['properties']['message'];
        //     });
        //     error = customError;
        // }
        // if (error.codeName == "DuplicateKey") {//si on a des erreurs de validation Mongoose (duplication)
        //     fieldsInErrors = Object.keys(error.keyValue); // on récupère les champs qui sont en erreur de duplication
        //     (fieldsInErrors).forEach(currentField => {
        //         customError[currentField] = 'Le champ ' + currentField + ' doit être unique, <' + error['keyValue'][currentField] + '> existe déjà!';
        //     });
        //     error = customError;
        // }
        res.status(400).json({ error });
        // res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, catégorie non trouvée" });
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

        res.status(200).json({ "Message": "Produit supprimé." });
    } catch {
        res.status(404).json("Erreur : Produit introuvable.");
    }
};



