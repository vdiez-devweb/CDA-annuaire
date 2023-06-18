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
        const antennas = await Antenna.find({});
        const sessions = await Session.find({});
        // TODO récupérer les domaines et les régions pour les afficher sous forme de bouton dans la page d’accueil
        let messageAntenna = "";
        let messageSession = ""; 
        if ("" == antennas) {
            messageAntenna = "Aucun centre enregistré.";
        }
        if ("" == sessions) {
            messageSession = "Aucune session enregistrée.";
        }
        res.status(200).render("homepage", {
            title: "Bienvenue sur l'annuaire des étudiants de Simplon",
            antennas:  antennas,
            sessions:  sessions,
            messageAntenna,
            messageSession,
            message: ""
        });
    } catch(error) {
        res.status(500).render("homepage", {
            title: "Accueil",
            antennas: "",
            sessions:  "",
            message: error,
            messageAntenna: "",
            messageSession: ""
        });
    }
};