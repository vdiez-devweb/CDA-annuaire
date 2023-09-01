import Antenna from "../models/Antenna.js";
import Session from "../models/Session.js";

//on déclare la fonction, 2 façons possibles
// exports.getHomePage = (req, res, next) => {
//     res.render("homepage", {
//         title: "Homepage";
//     })
// };

export const getHomepage = async (req, res, next) => {
    try{
        // const antennas = await Antenna.find();
        // const sessions = await Session.find();
        let msg_success = req.flash('message_success');
        let msg_error = req.flash('message_error');
        let messageRegions = "";
        let messageDomaines = ""; 
        
        // TODO récupérer les domaines pour les afficher sous forme de bouton dans la page d’accueil
        // const domaines = ['Infrastructures ​​​​​​​et Cybersécurité','Développement d\'Application','Fondamentaux Numériques','Intelligence Artificielle ​​​​​​​et Data','Méthodes ​​​​​​​Agiles','Cloud ​​​​​​​et Devops'];
        const domaines = "";
        if ("" == domaines) {
            messageDomaines = "Aucun domaine de formation enregistré.";
        }        
       // récupérer les régions actives pour les afficher sous forme de bouton dans la page d’accueil
        let regions = await Antenna.aggregate([
            {
              $group: {
                // Each `_id` must be unique, so if there are multiple documents with the same value for antennaRegion, we increment `count`.
                _id: '$antennaRegion',
                count: { $sum: 1 }
              }
            }
          ]);
        // regions[0]; // { _id: "nomDeLaRegion", count: 1 }
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