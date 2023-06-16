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
            res.status(404).render("session/getSession", {
                title: "Erreur Fiche session",
                session: "",
                message: "Erreur : session introuvable."
            });
        }
        res.status(200).render("session/getSession", {
            title: "Fiche session " + session.sessionName,
            session: session,
            message: ""
        });
    } catch {
        res.status(404).render("session/getSession", {
            title: "Erreur Fiche session",
            session: "",
            message: "Erreur serveur."
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
            res.status(404).render("session/getSessions", {
                title: "Liste des sessions",
                sessions: "",
                message: "Aucun session trouvée."
            });
        }

        res.status(200).render("session/getSessions", {
            title: "Liste des sessions",
            message: "",
            sessions: sessions 
        });
    } catch(error) {
        res.status(500).render("session/getSessions", {
            title: "Liste des sessions",
            sessions: "",
            message: "Erreur serveur."
        });
    }
};



