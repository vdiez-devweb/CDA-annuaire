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
        let messageRegions = "";
        let messageDomaines = ""; 
        
        // TODO récupérer les domaines pour les afficher sous forme de bouton dans la page d’accueil
        const domaines = ['Infrastructures ​​​​​​​et Cybersécurité','Développement d\'Application','Fondamentaux Numériques','Intelligence Artificielle ​​​​​​​et Data','Méthodes ​​​​​​​Agiles','Cloud ​​​​​​​et Devops'];
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
       
        res.status(200).render("homepage", {
            title: "Bienvenue sur l'annuaire des étudiants de Simplon",
            regions,
            domaines,
            messageRegions,
            messageDomaines,
            message: ""
        });
    } catch(error) {
        res.status(500).render("homepage", {
            title: "Accueil",
            regions: "",
            domaines: "",
            message: error,
            messageRegions: "",
            messageDomaines: "",
        });
    }
};