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
 * TODO utilisé pour récupérer le nb de produit pour chaque catégorie ///////////////////:
 * get count of Products in a category in webApp  
 * 
**/
// export const getCountProductInCategory = async (category, compteur, res, next) => {
//     //? test 1 /////////////////////
//     const count =  await Product.countDocuments({productCategory: category._id});
//     console.log('mon compteur ' + category._id + " : " + count);
//     // res.end(count);
//     return count;   

//     //? test 3 ///////////////////// (retirer le async sur la fonction)
//     // return new Promise(resolve => {
//     //     setTimeout(() => {
//     //       resolve(Product.countDocuments({productCategory: category._id}));
//     //     }, 2000);
//     //   });
// }

/**
 * 
 * get all categories in webApp
 * 
**/
export const getCategories = async (req, res, next) => {
    var countProducts = [];
    try{
        const categories = await Category.find({});

        //TODO récupérer le nb de produit pour chaque catégorie ///////////////////////////////////:
        //? test 3 /////////////////////
        // async function asyncCall(item) {
        //     console.log('calling');
        //     const result = await getCountProductInCategory(item);
        //     console.log(result);
        //     return result;
        // }
        // categories.forEach( currentCategory => {
            
        //     countProducts.push({"id": currentCategory._id.toString(), "countProduct":  Promise.all(asyncCall(currentCategory))});
        // })
        // console.log(countProducts);

        
        //? test 1 /////////////////////
        // categories.forEach( currentCategory => {
        //     let compteur =  getCountProductInCategory(currentCategory)
        //         .then(function(result){
        //             console.log(result);
        //         })
        //             .then(function(result){
        //                 compteur = result;
        //             //countProducts.push({"id": currentCategory._id.toString(), "countProduct":  compteur});

        //         })
        //     // console.log('mon compteur intermédiaire : ');console.log(compteur); 
        //    countProducts.push({"id": currentCategory._id.toString(), "countProduct":  compteur});
        //     // console.log('mon tableau intermédiaire : ');console.log(countProducts);console.log('\n'); 
        //     //currentCategory._id returns : new ObjectId("645a519a04393b26b88147e7")
        //     //currentCategory._id.toString() returns : '645a519a04393b26b88147e7'
        //     //getCountProductInCategory(currentCategory) returns : Promise { <pending> }
        // });
        // console.log(countProducts);


        //? test 2 /////////////////////
        //! version avec Promise à résoudre :
        // categories.forEach(currentCategory => {
        //     let compteur =  getCountProductInCategory(currentCategory)
        //     countProducts.push({"id": currentCategory._id.toString(), "countProduct":  compteur})
        //     //currentCategory._id returns : new ObjectId("645a519a04393b26b88147e7")
        //     //currentCategory._id.toString() returns : '645a519a04393b26b88147e7'
        //     //getCountProductInCategory(currentCategory) returns : Promise { <pending> }
        // });
        // console.log(countProducts);

        //TODO fin /////////////////////////////////////////////////////////

        if (null == categories) {
            res.status(404).render("category/getCategories", {
                title: "Catégories de produits",
                categories: "",
                countProducts,
                message: "Aucune catégorie enregistrée."
            });
        }
        res.status(200).render("category/getCategories", {
            title: "Catégories de produits",
            categories:  categories,
            countProducts,
            message: ""
        });
    } catch(error) {
        res.status(500).render("category/getCategories", {
            title: "Erreur Catégories de produits",
            categories: "",
            countProducts,
            message: error
        });
    }
};


