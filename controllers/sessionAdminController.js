import Antenna from "../models/Antenna.js";
import Session from "../models/Session.js";
import { formateDate } from "../middlewares/utils.js";

const prefixTitle = "";

/**
 * 
 * get the list of all sessions in admin dashboard 
 * 
**/
export const getSessions = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    try{
        const sessions = await Session.find().populate("sessionAntenna");
        if (0 == sessions || 0 == sessions.length) {
            return res.status(404).render("admin/session/getSessions", {
                title: "Liste des sessions",
                sessions: "",
                message: "Aucun session trouvée."
            });
        }
        sessions.forEach(function(currentSession) {
            currentSession.sessionStartDateFormatted = formateDate(currentSession.sessionStartDate, 'tab');
            currentSession.sessionEndDateFormatted = formateDate(currentSession.sessionEndDate, 'tab');
        });
        res.status(200).render("admin/session/getSessions", {
            title: prefixTitle + "Liste des sessions",
            sessions: sessions,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: "",
        });
    } catch(error) {
        req.flash('message_error', error);
        res.status(500).redirect("/admin/");
    }
};

/**
 * 
 * get a single Session in admin dashboard 
 * 
**/
export const getSession = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');

    const id = req.params.sessionId;
    try{ //je récupère les infos du centre de formation par .populate
        const session = await Session.findOne({ "_id": id }).populate("sessionAntenna");
        if (null == session) {
            req.flash('message_error', "Aucune session trouvée avec l'identifiant." + id);
            return res.status(404).redirect("/admin/sessions");
        }
        session.sessionStartDateFormatted = formateDate(session.sessionStartDate, 'view');
        session.sessionEndDateFormatted = formateDate(session.sessionEndDate, 'view');

        res.status(200).render("admin/session/getSession", {
            title: "Fiche Session " + session.sessionName,
            session: session,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: ""
        });
    } catch (error) {
        console.log(error);
        req.flash('message_error', error);
        res.status(500).redirect("/admin/sessions");
    }
};
    
/**
 * 
 * delete a single antenna in admin dashboard 
 * 
**/
// TODO supprimer plusieurs sessions en 1 seule fois avec des checkbox
export const deleteSession = async (req, res, next) => {
    const sessionId = req.params.sessionId;
    const antennaSlug = req.params.antennaSlug;

    try{
        const session = await Session.findByIdAndDelete({ "_id": sessionId });
        //console.log(session); //? debug
        if (null == session) {
            req.flash('message_error', "ERREUR session introuvable.");
            if (antennaSlug) {
                res.status(404).redirect("/admin/antenna/" + antennaSlug);
            } else {
                res.status(404).redirect("/admin/sessions/");
            }
        } else {         
            const antenna = await Antenna.findByIdAndUpdate(
                { "_id": session.sessionAntenna }, 
                { $inc: { antennaNbSessions: -1 } }, 
                { new: true }
                //  (err, doc)
            );

            req.flash('message_success', "La session " + session.sessionName + " supprimée.");
            if (antennaSlug) {
                res.status(200).redirect("/admin/antenna/" + antennaSlug);
            } else {
                res.status(200).redirect("/admin/sessions/");
            }
        }  
      } catch(error) {
        req.flash('message_error', "ERREUR " + error);
        if (antennaSlug) {
            res.status(500).redirect("/admin/antenna/" + antennaSlug);
        } else {
            res.status(500).redirect("/admin/sessions/");
        }
    }
};

/**
 * 
 * render form to create Session (requête post) in admin dashboard 
 * 
**/
export const postSession = async(req, res, next) => {
    const antennaSlug = req.params.antennaSlug != "" ? req.params.antennaSlug : null;
    let antennaSelected = null;
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    try {
        if (null != antennaSlug) {
            antennaSelected = await Antenna.findOne({ "antennaSlug": antennaSlug });
            if (antennaSelected) antennaSelected = antennaSelected._id.toString();
        } 
        const antennas = await Antenna.find();

        if (0 == antennas) {
            req.flash('message_error', "Aucun centre de formation répertorié, vous devez créer un centre de formation avant de pouvoir ajouter une session.");
            return res.status(404).render("admin/session/editAddSession", {
                title: prefixTitle + " Création de session",
                antennas: "",
                session:"",
                action: "create",
                antennaSelected: antennaSelected,
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,
                antennaSlug,
                message: ""
            });
        }
        res.status(200).render("admin/session/editAddSession", {
            title: prefixTitle + " Création de session",
            antennas: antennas,
            session:"",
            action: "create",
            antennaSelected: antennaSelected,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,    
            message: "",
            antennaSlug
        });
    } catch {
        res.status(404).render("admin/session/getSessions", {
            title: "Erreur Fiche session",
            session: "",
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            antennaSlug,
            message: "Erreur serveur."
        });
    }
};

/**
 * 
 * Create Session (requête post) in admin dashboard 
 * 
**/
export const ajaxPostSession = async (req, res, next) => {
    // envoyer le nom du centre de formation via req.body
    const data = req.body;
    
    try{
        // on créé une nouvelle session avec mongoose (Session est un objet Schema de mongoose déclaré dans le model)
        const session = await Session.create({
            sessionName: data.sessionName, 
            sessionDescription : data.sessionDescription,
            sessionNumIdentifier: data.sessionNumIdentifier,
            sessionType: data.sessionType,
            sessionAlternation: data.sessionAlternation,
            sessionInternship: data.sessionInternship,
            sessionStatus: data.sessionStatus,
            sessionStartDate: data.sessionStartDate,
            sessionEndDate: data.sessionEndDate,
            sessionAntenna: data.sessionAntennaId,
        });

        //on met à jour automatiquement le nombre de session dans son centre de formation
        const antenna = await Antenna.findByIdAndUpdate(
            { "_id": data.sessionAntennaId }, 
            { $inc: { antennaNbSessions: 1 } }, 
            { new: true }
            //  (err, doc)
        );
        req.flash('message_success', "Session " + session.sessionName + " créée");
        res.status(201).redirect("/admin/session/" + session._id);
    } catch(error) {
        if (error.errors){
            req.flash('message_error', "ERREUR " + error);
            return res.status(500).redirect("/admin/create-session/" + data.antennaSlug); 
        }
        req.flash('message_error', "ERREUR " + error);
        res.status(500).redirect("/admin/sessions/create-session/" + data.antennaSlug);
    }
};

/**
 * 
 * render form to update Session (requête patch) in admin dashboard 
 * 
**/
export const updateSession = async(req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    let antennaSelected = req.params.antennaSelected;
    const id = req.params.sessionId;
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    
    try{ 
        const session = await Session.findOne({ "_id": id }).populate("sessionAntenna");

        if (null == session) {
            req.flash('message_error', "Erreur : session introuvable.");
            return res.status(404).redirect(req.get('Referrer'));
        } else {
            session.sessionStartDateToEditForm = formateDate(session.sessionStartDate, 'form');
            session.sessionEndDateToEditForm = formateDate(session.sessionEndDate, 'form');  
        }
        const antennaSlug = session.sessionAntenna.antennaSlug;
        antennaSelected = session.sessionAntenna._id.toString();

        // if (antennaSlug != null) {
        //     antennaSelected = await Antenna.findOne({ "antennaSlug": antennaSlug });
        //     if (antennaSelected) antennaSelected = antennaSelected._id.toString()
        // }     

        const antennas = await Antenna.find();

        if (0 == antennas) {
            req.flash('message_error', "Erreur : Aucun centre de formation répertorié.");
            return res.status(404).redirect(req.get('Referrer'));
        }
        res.status(200).render("admin/session/editAddSession", {
            title: "Modifier la session " + session.sessionName,
            antennas: antennas,
            action: "update",
            antennaSelected: antennaSelected,
            session: session,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,            
            message: ""
        });
    } catch (error) {
        req.flash('message_error', error);
        return res.status(404).redirect(req.get('Referrer'));
    }
};

/**
 * 
 * Update Session (requête patch) in admin dashboard 
 * 
**/
export const ajaxUpdateSession = async (req, res, next) => {
     //on récupère l'identifiant donné dans la route paramétrique et le nouveau nom passé dans le corps de la requête
     const id = req.params.sessionId;
     const data = req.body;

    try{
        const result = await Session.findByIdAndUpdate(
        { "_id": id }, 
        { 
            sessionName: data.sessionName, 
            sessionDescription : data.sessionDescription,
            sessionNumIdentifier: data.sessionNumIdentifier,
            sessionType: data.sessionType,
            sessionAlternation: data.sessionAlternation,
            sessionInternship: data.sessionInternship,
            sessionStatus: data.sessionStatus,
            sessionStartDate: data.sessionStartDate,
            sessionEndDate: data.sessionEndDate,
            sessionAntenna: data.sessionAntennaId,
            sessionNbStudents: data.sessionNbStudents,
        }, 
        { 
            new: true,
            runValidators:true,
        }
        //  (err, doc)
        );
        if (null == result) {
            req.flash('message_error', "Erreur : mise à jour impossible, session non trouvée");
            return res.status(404).redirect("/admin/session/" + id); 
        }
        req.flash('message_success', "Session " + result.sessionName + " modifiée");
        res.status(200).redirect("/admin/session/" + id);
    } catch(error) {
        if (error.errors){
            req.flash('message_error', "ERREUR " + error);
            return res.status(500).redirect("/admin/update-session/" + id); 
        }
        req.flash('message_error', "ERREUR " + error);
        res.status(500).redirect("/admin/update-session/" + id);
    }
};

/**
 * TODO
 * Update number of Students in a Session in admin dashboard 
 * 
**/
// export const ajaxUpdateNbStudentsInSession = async (req, res, next) => {
//     const id = req.params.sessionId;
//     const sessionNbStudents =  await Student.countDocuments({studentSessions: id});//TODO adapter avec le tableau de sessions
    
//    try{
//        const result = await Session.findByIdAndUpdate(
//        { "_id": id }, 
//        { 
//             sessionNbStudents: sessionNbStudents, //TODO adapter avec le tableau de sessions
//        }, 
//        { new: true }
//        //  (err, doc)
//        );
//        if (null == result) {
//            return res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, session non trouvée" });
//        }
//        req.flash('message_success', "le compteur d'étudiants de la session " + result.sessionName + " a été rafraîchi ");
//        res.status(200).redirect(req.get('Referrer'));
//    } catch(error) {
//        req.flash('message_error', "ERREUR " + error);
//        res.status(500).redirect(req.get('Referrer'));
//    }
// };
