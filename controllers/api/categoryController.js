import Category from "../../models/Category.js";

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
    const categoryImg = req.body.categoryImg ? req.body.categoryImg : false;

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

