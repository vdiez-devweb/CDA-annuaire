import Antenna from "../models/Antenna.js";
import Session from "../models/Session.js";

/**
 * 
 * get a single antenna in webApp 
 * 
**/
export const getAntenna = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const antennaSlug = req.params.antennaSlug;
    try{
        const antenna = await Antenna.findOne({ "antennaSlug": antennaSlug });
        if (null == antenna) {
            return res.status(404).render("antenna/getAntenna", {
                title: "Centre de formation",
                sessions: "",
                antenna: "",
                message: "Le centre que vous recherchez est introuvable."
            });
        }

        const sessions = await Session.find({"sessionAntenna": antenna._id});
        if (0 == sessions) {
            return res.status(200).render("antenna/getAntenna", {
                title: "Liste des sessions " + antenna.antennaName,
                sessions: "",
                antenna: antenna,
                message: "Aucune session trouvée."
            });
        }
        sessions.forEach(function(currentSession) {
            currentSession.sessionStartDateFormatted = currentSession.sessionStartDate.getDate() + " " + currentSession.sessionStartDate.toLocaleString('default', { month: 'short' }) + " " + currentSession.sessionStartDate.getFullYear();
            currentSession.sessionEndDateFormatted = currentSession.sessionEndDate.getDate() + " " + currentSession.sessionEndDate.toLocaleString('default', { month: 'short' }) + " " + currentSession.sessionEndDate.getFullYear();
        });        
        res.status(200).render("antenna/getAntenna", {
            title: "Liste des sessions " + antenna.antennaName,
            message: "",
            antenna: antenna,
            sessions: sessions 
        });
    } catch(error) {
        res.status(500).render("antenna/getAntenna", {
            title: "Liste des sessions",
            sessions: "",
            antenna: "",
            message: error
        });
    }
};

/**
 * 
 * get all antennas in webApp
 * 
**/
export const getAntennas = async (req, res, next) => {
    try{
        const antennas = await Antenna.find();
        //console.log(antennas); //? commentaire debug à supprimer ///////////////////////
        if (0 == antennas) {
            return res.status(404).render("antenna/getAntennas", {
                title: "Liste des centres de formation",
                antennas: "",
                message: "Aucun centre enregistré."
            });
        }
        res.status(200).render("antenna/getAntennas", {
            title: "Liste des centres de formation",
            antennas:  antennas,
            message: ""
        });
    } catch(error) {
        res.status(500).render("antenna/getAntennas", {
            title: "Erreur Liste des centres de formation",
            antennas: "",
            message: error
        });
    }
};


