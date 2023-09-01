import Session from "../models/Session.js";
import { formateDate, validateValueObjectId } from "../middlewares/validation.js";

/**
 * 
 * get a single Session in webApp 
 * 
**/
export const getSession = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    //on récupère l'identifiant donné dans la route paramétrique
    // const id = req.params.sessionId;
    const id = (req.params.sessionId != "" && typeof req.params.sessionId !== 'undefined') ? req.params.sessionId : null;

    if (!validateValueObjectId(req.params.sessionId)) {
        req.flash('message_error', "Session introuvable.");
        return res.status(404).redirect("/sessions/");
    }
    try{ //je récupère les infos du centre de formation par .populate
        const session = await Session.findOne({ "_id": id }).populate("sessionAntenna");
        if (null == session) {
            req.flash('message_error', "Session introuvable");
            return res.status(404).redirect("/sessions");
        }
        session.sessionStartDateFormatted = formateDate(session.sessionStartDate, 'view');
        session.sessionEndDateFormatted = formateDate(session.sessionEndDate, 'view');
    
        return res.status(200).render("session/getSession", {
            title: "Fiche session " + session.sessionName,
            session: session,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: ""
        });
    } catch(error) {
        req.flash('message_error', error);
        return res.status(404).redirect("/sessions/");
    }
};

/**
 * 
 * get all sessions in webApp
 * 
**/
export const getSessions = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    try{
        const sessions = await Session.find({}).populate("sessionAntenna");

        if (0 == sessions) {
            return res.status(404).render("session/getSessions", {
                title: "Liste des centres de formation",
                sessions: "",
                message: "Aucun session trouvée.",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,  
            });

        }
        sessions.forEach(function(currentSession) {
            currentSession.sessionStartDateFormatted = formateDate(currentSession.sessionStartDate, 'view');
            currentSession.sessionEndDateFormatted = formateDate(currentSession.sessionEndDate, 'view');
        });
        return res.status(200).render("session/getSessions", {
            title: "Liste des sessions",
            message: "",
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,  
            sessions: sessions 
        });
    } catch(error) {
        req.flash('message_error', error);
        return res.status(500).redirect("/");
    }
};



