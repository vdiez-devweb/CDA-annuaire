import Session from "../models/Session.js";

/**
 * 
 * get a single Session in webApp 
 * 
**/
export const getSession = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.sessionId;
    try{ //je récupère les infos du centre de formation par .populate
        const session = await Session.findOne({ "_id": id }).populate("sessionAntenna");
        if (null == session) {
            return res.status(404).render("session/getSession", {
                title: "Erreur Fiche session",
                session: "",
                message: "Erreur : session introuvable."
            });
        }
        session.sessionStartDateFormatted = formateDate(session.sessionStartDate, 'view');
        session.sessionEndDateFormatted = formateDate(session.sessionEndDate, 'view');
    
        return res.status(200).render("session/getSession", {
            title: "Fiche session " + session.sessionName,
            session: session,
            message: ""
        });
    } catch(error) {
        return res.status(404).render("session/getSession", {
            title: "Erreur Fiche session",
            session: "",
            message: "Erreur " + error
        });
    }
};

/**
 * 
 * get all sessions in webApp
 * 
**/
export const getSessions = async (req, res, next) => {
    try{
        const sessions = await Session.find({}).populate("sessionAntenna");

        if (0 == sessions.length) {
            return res.status(404).render("session/getSessions", {
                title: "Liste des sessions",
                sessions: "",
                message: "Aucun session trouvée."
            });
        }
        sessions.forEach(function(currentSession) {
            currentSession.sessionStartDateFormatted = formateDate(currentSession.sessionStartDate, 'view');
            currentSession.sessionEndDateFormatted = formateDate(currentSession.sessionEndDate, 'view');
        });
        return res.status(200).render("session/getSessions", {
            title: "Liste des sessions",
            message: "",
            sessions: sessions 
        });
    } catch(error) {
        return res.status(500).render("session/getSessions", {
            title: "Liste des sessions",
            sessions: "",
            message: "Erreur serveur."
        });
    }
};



