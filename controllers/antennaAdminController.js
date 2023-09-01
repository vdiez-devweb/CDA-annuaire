import Antenna from "../models/Antenna.js";
import Session from "../models/Session.js";
import { formateDate, validateAndFormateValue, validateValueObjectId } from "../middlewares/validation.js";

// const prefixTitle = "Administration - ";
const prefixTitle = "";

// function  getAntennaSlugFromId (_id) {
//     const antenna = Antenna.findOne({ "_id": _id });
//     return antenna.antennaSlug;
// }

// function  getAntennaIdFromSlug (slug) {
//     const antenna = Antenna.findOne({ "antennaSlug": slug });
//     return antenna._id;
// }

/**
 * 
 * get the list of all antennas in admin dashboard (it's the homepage of the dashboard)
 * 
**/
export const getAntennas = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    let message = "";
    try {
        const antennas = await Antenna.find();
        if (0 == antennas || 0 == antennas.length) {
            return res.status(404).render("admin/antenna/getAntennas", {
                title: "Centres de formation",
                antennas: "",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,
                message: "Aucun centre trouvé."
            });
        }
        return res.status(200).render("admin/antenna/getAntennas", {
            title: prefixTitle + "Centres de formation",
            antennas: antennas,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: message
        });
    } catch(error) {
        req.flash('message_error', error);
        return res.status(404).redirect("/admin");
    }
};

/**
 * 
 * get a single antenna with his list of sessions in admin dashboard 
 * 
**/
export const getAntenna = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const antennaSlug = req.params.antennaSlug;

    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    let message = "";
    try{
        const antenna = await Antenna.findOne({ "antennaSlug": antennaSlug }); // .findOne renvoie null si vide
        if (null == antenna) {
            req.flash('message_error', "Centre de formation introuvable.");
            return res.status(404).redirect("/admin/antennas");
        }

        const sessions = await Session.find({"sessionAntenna": antenna._id}); // find() renvoie [] si vide (attention, pour tester le retour vide, [] == [] renvoi false, il faut tester avec 0 ou "" ([] n'est pas null))
        if (0 == sessions) {
            message= "Aucune session dans ce centre de formation.";
        } else {
            sessions.forEach(function(currentSession) {
                currentSession.sessionStartDateFormatted = formateDate(currentSession.sessionStartDate, 'view');
                currentSession.sessionEndDateFormatted = formateDate(currentSession.sessionEndDate, 'view');
            });
        }
        return res.status(200).render("admin/antenna/getAntenna", {
            title: prefixTitle + "Centre de formation",
            antenna: antenna,
            sessions: sessions,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: message
        });
    } catch(error) {
        req.flash('message_error', error);
        return res.status(500).redirect("/admin/antennas");        
    }
};

/**
 * 
 * render form to create Antenna (requête post) in admin dashboard 
 * 
**/
export const postAntenna = async (req, res, next) => {   
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    if (0 === Object.keys(req.body).length && req.body.constructor === Object) { //si on a pas encore reçu des données depuis le formulaire
        try{
            return res.status(200).render("admin/antenna/editAddAntenna", {
                title: prefixTitle + "Création d'un centre de formation",
                antenna: "",
                action:"create",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,
                message: ""
            });
        } catch(error) {
            req.flash('message_error', error);
            return res.status(500).redirect("/admin/antennas");        
        }
    } else { // on est passé par le formulaire, on traite les données
        const data = [];
        try{
            // vérifier les données reçues du formulaire dans req.body
            Object.keys(req.body).forEach(key => {
                data[key] = validateAndFormateValue(key, req.body[key], res.locals.tabRegions);
            });
            // on créé un nouveau centre de formation avec mongoose (Antenna est un objet Schema de mongoose déclaré dans le model)
            const antenna = await Antenna.create({
                antennaName: data.antennaName,
                antennaDescription: data.antennaDescription,
                antennaSlug: data.antennaSlug,
                antennaImg: data.antennaImg ,
                antennaRegion: data.antennaRegion,
                antennaPhone: data.antennaPhone,
                antennaStatus: data.antennaStatus,
                antennaAddress: data.antennaAddress,
                antennaZipCode: data.antennaZipCode,
                antennaEmail: data.antennaEmail,
                antennaCity: data.antennaCity
            });
            req.flash('message_success', "Centre de formation " + antenna.antennaName + " créé");
            return res.status(201).redirect("/admin/antenna/" + antenna.antennaSlug);
        } catch(error) {
            if (error.errors){
                req.flash('message_error', "Erreur de saisie : " + error);
                // return res.status(500).redirect("/admin/create-antenna"); 
                //console.log(req.body);
                //pour conserver les données saisies en cas d'erreur de validation, et éviter des les ressaisir :
                return res.status(500).render("admin/antenna/editAddAntenna", {
                    title: prefixTitle + "Création d'un centre de formation",
                    antenna: req.body,
                    antennaId: req.body.antennaId,
                    action:"create",
                    nbSessionsInBDD: req.body.count,
                    message_success: "",
                    message_error: req.flash('message_error'),
                    message: ""
                });
            }
            req.flash('message_error', error);
            return res.status(500).render("admin/antenna/editAddAntenna", {
                title: prefixTitle + "Création d'un centre de formation",
                antenna: req.body,
                antennaId: req.body.antennaId,
                action:"create",
                nbSessionsInBDD: req.body.count,
                message_success: "",
                message_error: req.flash('message_error'),
                message: ""
            });
        }
    }
};

/**
 * 
 * delete a single antenna in admin dashboard 
 * 
**/
// TODO supprimer plusieurs centres de formation en 1 seule fois avec des checkbox
export const deleteAntenna = async (req, res, next) => {
    const antennaSlug = req.params.antennaSlug;
 
    try{
        const antenna = await Antenna.findOne({ "antennaSlug": antennaSlug });
        if (null == antenna) {
            req.flash('message_error', "Centre de formation introuvable.");
            return res.status(404).redirect("/admin/antennas");
        }
        const antennaName = antenna.antennaName;
        
        const antennaNbSessions =  await Session.countDocuments({sessionAntenna: antenna._id});
        if (0 != antennaNbSessions) {
            req.flash('message_error', "Impossible de supprimer ce centre de formation car il contient des sessions.");
            return res.status(400).redirect("/admin/antenna/" + antenna.antennaSlug);
        } else {
            const result = await Antenna.findByIdAndDelete({ "_id": antenna._id  });
            req.flash('message_success', "Centre de formation " + antennaName + " supprimé");
            return res.status(200).redirect("/admin/antennas");
        }
      } catch(error) {
        req.flash('message_error', error);
        return res.status(500).redirect("/admin/antennas");
    }
};


/**
 * 
 * render form to update Session (requête patch) in admin dashboard 
 * 
**/
export const updateAntenna = async(req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');

    const antennaSlug = (req.params.antennaSlug != "" && typeof req.params.antennaSlug !== 'undefined') ? req.params.antennaSlug : req.body.initialSlug != "" ? req.body.initialSlug : null;

    if (0 === Object.keys(req.body).length && req.body.constructor === Object) { //si on a pas encore reçu des données depuis le formulaire
        try{ 
            const antenna = await Antenna.findOne({ "antennaSlug": antennaSlug });
            // pour éventuellement mettre à jour le compteur de sessions du centre de formation avec le nombre réel de sessions enregistrées dans la base
            const count =  await Session.countDocuments({sessionAntenna: antenna._id});
            if (null == antenna) {
                req.flash('message_error', "Centre de formation introuvable.");
                return res.status(404).redirect("/admin/antennas");
            }
            return res.status(200).render("admin/antenna/editAddAntenna", {
                title: "Modifier le centre de formation " + antenna.antennaName,
                antenna: antenna,
                antennaId: antenna._id,
                action:"update",
                nbSessionsInBDD: count,
                antennaSlug: antennaSlug,
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,  
                message: ""
            });
        } catch (error) {    
            if (antennaSlug) {
                req.flash('message_error', error);
                return res.status(500).redirect("/admin/antenna/" + antennaSlug);
            } else { 
                req.flash('message_error', error);
                return res.status(500).redirect("/admin/antennas/");
            }
        }
    } else { // on est passé par le formulaire, on traite les données
        let data = [];
        const initialSlug = req.body.initialSlug;

        try{
            Object.keys(req.body).forEach(key => {
                data[key] = validateAndFormateValue(key, req.body[key], res.locals.tabRegions);
            });

            const result = await Antenna.findByIdAndUpdate(
            { "_id": data.antennaId }, 
            { 
                antennaName: data.antennaName,
                antennaDescription: data.antennaDescription,
                antennaSlug: data.antennaSlug,
                antennaImg: data.antennaImg ,
                antennaRegion: data.antennaRegion,
                antennaPhone: data.antennaPhone,
                antennaStatus: data.antennaStatus,
                antennaAddress: data.antennaAddress,
                antennaZipCode: data.antennaZipCode,
                antennaCity: data.antennaCity,
                antennaNbSessions: data.antennaNbSessions,
                antennaEmail: data.antennaEmail,
                // antennaNbStudents: data.antennaNbStudents,
            }, 
            { 
                new: true,
                runValidators:true,
            }
            //  (err, doc)
            );

            if (null == result) {
                req.flash('message_error', "La mise à jour a échoué");
                return res.status(404).redirect("/admin/antennas/");
            }
    
            req.flash('message_success', "Centre de formation " + result.antennaName + " modifié");
            return res.status(200).redirect("/admin/antenna/" + data.antennaSlug);
        } catch(error) {

            if (error.errors){
                req.flash('message_error', error);
                return res.status(500).render("admin/antenna/editAddAntenna", {
                    title: "Modifier le centre de formation " + req.body.antennaName,
                    antenna: req.body,
                    antennaId: req.body.antennaId,
                    antennaSlug: initialSlug,
                    action:"update",
                    nbSessionsInBDD: req.body.antennaNbSessions,
                    // nbSessionsInBDD: req.body.count,
                    message_success: "",
                    message_error: req.flash('message_error'),
                    message: ""
                });
            }        
            req.flash('message_error', error);
            return res.status(500).render("admin/antenna/editAddAntenna", {
                title: "Modifier le centre de formation " + req.body.antennaName,
                antenna: req.body,
                antennaId: req.body.antennaId,
                antennaSlug: initialSlug,
                action:"update",
                nbSessionsInBDD: req.body.antennaNbSessions,
                // nbSessionsInBDD: req.body.count,
                message_success: "",
                message_error: req.flash('message_error'),
                message: ""
            });
        }
    }

};

/**
 * 
 * Update number of Session in a antenna in admin dashboard 
 * 
**/
export const ajaxUpdateNbSessionsInAntenna = async (req, res, next) => {
    const id = req.params.antennaId;
    if (!validateValueObjectId(id)) {
        req.flash('message_error', "Aucune session trouvée avec l'identifiant." + sessionId);
        return res.status(404).redirect(req.get('Referrer'));
    }

    const antennaNbSessions =  await Session.countDocuments({sessionAntenna: id});
    
   try{
       const result = await Antenna.findByIdAndUpdate(
       { "_id": id }, 
       { 
           antennaNbSessions: antennaNbSessions,
       }, 
       { new: true }
       //  (err, doc)
       );
       if (null == result) {
           req.flash('message_error', "mise à jour impossible, centre de formation non trouvé");
           return res.status(404).redirect(req.get('Referrer'));
       }
       req.flash('message_success', "le compteur de sessions du centre de formation " + result.antennaName + " a été rafraîchi ");
       return res.status(200).redirect(req.get('Referrer'));
   } catch(err) {
       req.flash('message_error', "ERREUR " + err);
       return res.status(500).redirect(req.get('Referrer'));
   }
};

/**
 * TODO ? 
 * Update number of Students  in an Antenna in admin dashboard 
 * 
**/
// export const ajaxUpdateNbStudentsInAntenna = async (req, res, next) => {
//     const id = req.params.sessionId;
//     //TODO chercher les sessions de cette antenne et ajouter le nombre d'étudiants qui y ont participé 
// };