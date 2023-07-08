import Antenna from "../models/Antenna.js";
import Session from "../models/Session.js";

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
        const antennas = await Antenna.find({});
        if (0 == antennas || null == antennas) {
            return res.status(404).render("admin/antenna/getAntennas", {
                title: "Liste des centres de formation",
                antennas: "",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,
                message: "Aucun centre trouvé."
            });
        }
        return res.status(200).render("admin/antenna/getAntennas", {
            title: prefixTitle + "Liste des centres de formation",
            antennas: antennas,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: message
        });
    } catch(error) {
        req.flash('message_error', error);
        console.log(error);
        res.status(404).redirect("/admin");
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
        const antenna = await Antenna.findOne({ "antennaSlug": antennaSlug });
        //console.log(antenna); //? debug à supprimer
        if (0 == antenna || null == antenna) {
            req.flash('message_error', "erreur, centre de formation introuvable.");
            return res.status(404).redirect("/admin/antennas");
        }
        const sessions = await Session.find({"sessionAntenna": antenna._id});
        sessions.forEach(function(currentSession) {
            currentSession.sessionStartDateFormatted = currentSession.sessionStartDate.getDate() + " " + currentSession.sessionStartDate.toLocaleString('default', { month: 'short' }) + " " + currentSession.sessionStartDate.getFullYear();
            currentSession.sessionEndDateFormatted = currentSession.sessionEndDate.getDate() + " " + currentSession.sessionEndDate.toLocaleString('default', { month: 'short' }) + " " + currentSession.sessionEndDate.getFullYear();
        });
        if ("" == sessions) {
            message= "Aucune session dans ce centre de formation.";
        }
        res.status(200).render("admin/antenna/getAntenna", {
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
export const postAntenna = (req, res, next) => {   
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');

    res.status(200).render("admin/antenna/editAddAntenna", {
        title: prefixTitle + "Création d'un centre de formation",
        antenna: "",
        action:"create",
        message_success: req.flash('message_success'),
        message_error: req.flash('message_error'),
        msg_success,
        msg_error,
        message: ""
    });
};

/**
 * 
 * Create Antenna (requête post) in admin dashboard 
 * 
**/
export const ajaxPostAntenna = async (req, res, next) => {
    // envoyer le nom du centre de formation via req.body
    const data = req.body;

    try{
        // on créé un nouveau centre de formation avec mongoose (Antenna est un objet Schema de mongoose déclaré dans le model)
        const antenna = await Antenna.create({
            antennaName: data.antennaName,
            antennaDescription: data.antennaDescription,
            antennaSlug: data.antennaSlug,
            antennaImg: data.antennaImg ? true : false,
            antennaRegion: data.antennaRegion,
            antennaPhone: data.antennaPhone,
            antennaStatus: data.antennaStatus ? true : false,
            antennaAddress: data.antennaAddress,
            antennaZipCode: data.antennaZipCode,
            antennaEmail: data.antennaEmail,
            antennaCity: data.antennaCity
        });
        req.flash('message_success', "Centre de formation " + antenna.antennaName + " créé");
        res.status(201).redirect("/admin/antenna/" + antenna.antennaSlug);
    } catch(error) {
        if (error.errors){
            req.flash('message_error', "ERREUR " + error);
            return res.status(500).redirect("/admin/create-antenna"); 
        }
        req.flash('message_error', "ERREUR " + error);
        //! attention, avec le render, si on actualise ça relance la requête de création : j'utilise le redirect avec connect-flash
        res.status(500).redirect("/admin/create-antenna");
        // res.status(500).render("admin/antenna/getAntenna", {
        //     title: prefixTitle + "Création d'un centre de formation",
        //     sessions: "",
        //     antenna: "",
        //     flashMessage:"",
        //     message: error
        // });
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
        
        if (0 == antenna) {
            req.flash('message_error', "erreur, centre de formation introuvable.");
            return res.status(404).redirect("/admin/antennas");
        }
        const antennaName = antenna.antennaName;
        if (0 != antenna.antennaNbSessions) {
            req.flash('message_error', "Impossible de supprimer ce centre de formation car il contient des sessions.");
            return res.status(400).redirect("/admin/antenna/" + antenna.antennaSlug);
        } else {
            const result = await Antenna.findByIdAndDelete({ "_id": antenna._id  });
            req.flash('message_success', "Centre de formation " + antennaName + " supprimé");
            res.status(200).redirect("/admin/antennas");
        }
      } catch(error) {
        req.flash('message_error', error);
        res.status(500).redirect("/admin/antennas");
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
    const antennaSlug = req.params.antennaSlug;
    try{ 
    
        const antenna = await Antenna.findOne({ "antennaSlug": antennaSlug });
        // pour éventuellement mettre à jour le compteur de sessions du centre de formation avec le nombre réel de sessions enregistrées dans la base
        const count =  await Session.countDocuments({sessionAntenna: antenna._id});

        if (null == antenna) {
            req.flash('message_success', "Erreur : Centre de formation introuvable.");
            return res.status(404).redirect("/admin/antenna/" + antennaSlug);
        }
        res.status(200).render("admin/antenna/editAddAntenna", {
            title: "Modifier le centre de formation " + antenna.antennaName,
            antenna: antenna,
            action:"update",
            nbSessionsInBDD: count,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,  
            message: ""
        });
    } catch (error) {
        req.flash('message_success', error);
        return res.status(500).redirect("/admin/antenna/" + antennaSlug);
    }
};

/**
 * 
 * Update Session (requête patch) in admin dashboard 
 * 
**/
export const ajaxUpdateAntenna = async (req, res, next) => {
    const data = req.body;
    const initialSlug = data.initialSlug;

    try{
        const result = await Antenna.findByIdAndUpdate(
        { "_id": data.id }, 
        { 
            antennaName: data.antennaName,
            antennaDescription: data.antennaDescription,
            antennaSlug: data.antennaSlug,
            antennaImg: data.antennaImg ? true : false,
            antennaRegion: data.antennaRegion,
            antennaPhone: data.antennaPhone,
            antennaStatus: data.antennaStatus ? true : false,
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
            return res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, centre de formation non trouvé" });
        }

        req.flash('message_success', "Centre de formation " + result.antennaName + " modifié");
        res.status(200).redirect("/admin/antenna/" + initialSlug);
    } catch(error) {
        if (error.errors){
            req.flash('message_error', "ERREUR " + error);
            return res.status(500).redirect("/admin/update-antenna/" + initialSlug); 
        }        
        req.flash('message_error', "ERREUR " + error);
        res.status(500).redirect("/admin/update-antenna/" + initialSlug);
    }
};


/**
 * 
 * Update number of Session in a antenna in admin dashboard 
 * 
**/
export const ajaxUpdateNbSessionsInAntenna = async (req, res, next) => {
    const id = req.params.antennaId;
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
           return res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, centre de formation non trouvé" });
       }
       req.flash('message_success', "le compteur de sessions du centre de formation " + result.antennaName + " a été rafraîchi ");
       res.status(200).redirect(req.get('Referrer'));
   } catch(err) {
       req.flash('message_error', "ERREUR " + err);
       res.status(500).redirect(req.get('Referrer'));
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