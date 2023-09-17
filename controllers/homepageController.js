import Antenna from "../models/Antenna.js";
import Session from "../models/Session.js";

//on déclare la fonction, 2 façons possibles
// exports.getHomePage = (req, res, next) => {
//     res.render("homepage", {
//         title: "Homepage";
//     })
// };

/**
 * Function to display the homepage
 * 
 */
export const getHomepage = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    let messageRegions = "";
    let messageDomaines = ""; 
    try{
        // TODO créer les domaines en BDD et les récupérer pour les afficher sous forme de bouton dans la page d’accueil
        // const domaines = ['Infrastructures ​​​​​​​et Cybersécurité','Développement d\'Application',
        //                  'Fondamentaux Numériques','Intelligence Artificielle ​​​​​​​et Data','Méthodes ​​​​​​​Agiles','Cloud ​​​​​​​et Devops'];
        const domaines = "";
        if ("" == domaines) {
            messageDomaines = "Aucun domaine de formation enregistré.";
        }        
       // récupérer les régions actives (liées à un ou des centres) pour 
       //       1- les afficher les régions sous forme de bouton dans la page d’accueil
       //       2- afficher le nombre de centre pour chaque région
       let regions = await Antenna.aggregate([
            {
              $group: {
                //Chaque _id doit être unique, si on a plusieurs documents avec la même valeur pour antennaRegion, on incrémente `count`
                _id: '$antennaRegion',
                count: { $sum: 1 }
              }
            }
          ]);// regions[0]; // { _id: "nomDeLaRegion", count: 1 }
        
        if ("" == regions) {
            messageRegions = "Aucune région recensée.";
        }
       
        return res.status(200).render("homepage", {
            title: "Accueil",
            regions,
            domaines,
            messageRegions,
            messageDomaines,
            message: "",
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,    
        });
    } catch(error) {
        // next(error);
        return res.status(500).render("homepage", {
            title: "Accueil",
            regions: "",
            domaines: "",
            message: error,
            messageRegions: "",
            messageDomaines: "",
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,    
        });
    }
};