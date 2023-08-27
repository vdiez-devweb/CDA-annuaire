import Antenna from "../models/Antenna.js";
import Session from "../models/Session.js";
import { formateDate } from "../middlewares/validation.js";

/**
 * 
 * get a single antenna in webApp 
 * 
**/
export const getAntenna = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    //on récupère l'identifiant donné dans la route paramétrique
    const antennaSlug = req.params.antennaSlug;
    try{
        const antenna = await Antenna.findOne({ "antennaSlug": antennaSlug });
        if (null == antenna) {
            req.flash('message_error', "Centre de formation introuvable.");
            return res.status(404).redirect("/antennas/");
        }

        const sessions = await Session.find({"sessionAntenna": antenna._id});
        if (0 == sessions) {
            return res.status(200).render("antenna/getAntenna", {
                title: "Liste des sessions " + antenna.antennaName,
                antenna: antenna,
                sessions: "",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error, 
                message: "Ce centre n'a aucune session enregistrée."
            });
        }
        sessions.forEach(function(currentSession) {
            currentSession.sessionStartDateFormatted = formateDate(currentSession.sessionStartDate, 'view');
            currentSession.sessionEndDateFormatted = formateDate(currentSession.sessionStartDate, 'view');
        });        
        return res.status(200).render("antenna/getAntenna", {
            title: "Liste des sessions " + antenna.antennaName,
            antenna: antenna,
            sessions: sessions, 
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error, 
            message: "",
        });
    } catch(error) {
        req.flash('message_error', error);
        return res.status(404).redirect("/antennas/");
    }
};

/**
 * 
 * get all antennas in webApp
 * 
**/
export const getAntennas = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    
    try{
        const antennas = await Antenna.find();

        if (0 == antennas) {
            return res.status(404).render("antenna/getAntennas", {
                title: "Liste des centres de formation",
                antennas: "",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error, 
                message: "Aucun centre enregistré."
            });
        }
        return res.status(200).render("antenna/getAntennas", {
            title: "Liste des centres de formation",
            antennas:  antennas,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error, 
            message: ""
        });
    } catch(error) {
        req.flash('message_error', error);
        return res.status(404).redirect("/");
    }
};


