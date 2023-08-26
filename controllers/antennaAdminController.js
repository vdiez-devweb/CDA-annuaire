import Antenna from "../models/Antenna.js";
import Session from "../models/Session.js";
import { formateDate } from "../middlewares/utils.js";

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
        //console.log(error);
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
            req.flash('message_error', "erreur, centre de formation introuvable.");
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
    console.log(req.body);
        try{
            // vérifier les données reçues du formulaire dans req.body
            Object.keys(req.body).forEach(key => {
                data[key] = validateValue(key, req.body[key], res.locals.tabRegions);
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
                req.flash('message_error', "ERREUR " + error);
                // return res.status(500).redirect("/admin/create-antenna"); 
                //console.log(req.body);
                //pour conserver les données saisies en cas d'erreur de validation, et éviter des les ressaisir :
                return res.status(500).render("admin/antenna/editAddAntenna", {
                    title: prefixTitle + "Création d'un centre de formation",
                    antenna: req.body,
                    action:"create",
                    nbSessionsInBDD: req.body.count,
                    message_success: "",
                    message_error: req.flash('message_error'),
                    message: ""
                });
            }
            req.flash('message_error', "ERREUR " + error);
            return res.status(500).render("admin/antenna/editAddAntenna", {
                title: prefixTitle + "Création d'un centre de formation",
                antenna: req.body,
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
 * Create Antenna (requête post) in admin dashboard 
 * 
**/
// export const ajaxPostAntenna = async (req, res, next) => {
//     const data = [];
    
//     try{
//         // vérifier les données reçues du formulaire dans req.body
//         Object.keys(req.body).forEach(key => {
//             data[key] = validateValue(key, data[key]);
//         });
//         // on créé un nouveau centre de formation avec mongoose (Antenna est un objet Schema de mongoose déclaré dans le model)
//         const antenna = await Antenna.create({
//             antennaName: data.antennaName,
//             antennaDescription: data.antennaDescription,
//             antennaSlug: data.antennaSlug,
//             antennaImg: data.antennaImg ? true : false,
//             antennaRegion: data.antennaRegion,
//             antennaPhone: data.antennaPhone,
//             antennaStatus: data.antennaStatus ? true : false,
//             antennaAddress: data.antennaAddress,
//             antennaZipCode: data.antennaZipCode,
//             antennaEmail: data.antennaEmail,
//             antennaCity: data.antennaCity
//         });
//         req.flash('message_success', "Centre de formation " + antenna.antennaName + " créé");
//         return res.status(201).redirect("/admin/antenna/" + antenna.antennaSlug);
//     } catch(error) {
//         if (error.errors){
//             req.flash('message_error', "ERREUR " + error);
//             // return res.status(500).redirect("/admin/create-antenna"); 
//             //console.log(req.body);
//             //pour conserver les données saisies en cas d'erreur de validation, et éviter des les ressaisir :
//             return res.status(500).render("admin/antenna/editAddAntenna", {
//                 title: "Modifier le centre de formation " + req.body.antennaName,
//                 antenna: req.body,
//                 action:"create",
//                 nbSessionsInBDD: req.body.count,
//                 message_success: "",
//                 message_error: req.flash('message_error'),
//                 message: ""
//             });
//         }
//         req.flash('message_error', "ERREUR " + error);
//         //! attention, avec le render, si on actualise ça relance la requête de création : j'utilise le redirect avec connect-flash
//         return res.status(500).redirect("/admin/create-antenna");
//         // return res.status(500).render("admin/antenna/getAntenna", {
//         //     title: prefixTitle + "Création d'un centre de formation",
//         //     sessions: "",
//         //     antenna: "",
//         //     flashMessage:"",
//         //     message: error
//         // });
//     }
// };

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
            req.flash('message_error', "erreur, centre de formation introuvable.");
            return res.status(404).redirect("/admin/antennas");
        }
        
        const antennaNbSessions =  await Session.countDocuments({sessionAntenna: antenna._id});
        // const antennaName = antenna.antennaName;
        // if (0 != antenna.antennaNbSessions) {
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
    const antennaSlug = req.params.antennaSlug;
    try{ 
    
        const antenna = await Antenna.findOne({ "antennaSlug": antennaSlug });
        // pour éventuellement mettre à jour le compteur de sessions du centre de formation avec le nombre réel de sessions enregistrées dans la base
        const count =  await Session.countDocuments({sessionAntenna: antenna._id});
        if (null == antenna) {
            req.flash('message_success', "Erreur : Centre de formation introuvable.");
            return res.status(404).redirect("/admin/antenna/" + antennaSlug);
        }
        return res.status(200).render("admin/antenna/editAddAntenna", {
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
        return res.status(200).redirect("/admin/antenna/" + initialSlug);
    } catch(error) {
        if (error.errors){
            req.flash('message_error', "ERREUR " + error);
            return res.status(500).redirect("/admin/update-antenna/" + initialSlug); 
            // return res.status(500).render("admin/antenna/editAddAntenna", {
            //     title: "Modifier le centre de formation " + req.body.antennaName,
            //     antenna: req.body,
            //     id: req.body.id,
            //     antennaSlug: initialSlug,
            //     action:"update",
            //     nbSessionsInBDD: req.body.antennaNbSessions,
            //     message_success: "",
            //     message_error: req.flash('message_error'),
            //     message: ""
            // });
        }        
        req.flash('message_error', "ERREUR " + error);
        return res.status(500).redirect("/admin/update-antenna/" + initialSlug);
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
       return res.status(200).redirect(req.get('Referrer'));
   } catch(err) {
       req.flash('message_error', "ERREUR " + err);
       return res.status(500).redirect(req.get('Referrer'));
   }
};


/**
 * 
 * Validate and formate the received datas from forms
 * 
**/
export const validateValue = (key, value, tabRegions) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\d{10}$|^NC$/;
    const zipCodeRegex = /^\d{5}$/;
    const slugRegex = /^[a-z0-9]{3,32}$/;
    let label = '';

    switch (key) {
        case 'antennaName':
            label = 'Le nom';
            // Test si vide
            if (null == value){ 
                throw new Error(label + ' ne peut pas être vide !');
            }
            // test le type
            if ('string' != typeof value){ 
                throw new Error(label + ' doit être une chaîne de caractères !');
            }
            value = value.trim();
            // test la longueur ou regex
            if (value.length < 5 || value.length > 100){ 
                throw new Error(label + ' doit contenir entre 5 et 100 caractères !');
            }
            // gestion du format
            // value = value.toUpperCase(); 

            break;
        case 'antennaSlug':
            label = 'Le slug';
            // Test si vide
            if (null == value) { 
                throw new Error(label + ' ne peut pas être vide !');
            }
            // test le type
            if ('string' != typeof value) { 
                throw new Error(label + ' doit être une chaîne de caractères !');
            }
            // gestion du format
            value = value.trim();
            value = value.toLowerCase(); 
            // test la longueur ou regex
            if (!slugRegex.test(value)) { 
                throw new Error(label + ' n\'est pas au format valide ! (entre 3 et 32 chiffres ou lettres en minuscules');
            }

            break;
        case 'antennaDescription':
            label = 'La description';
            // Test si vide
            if (null != value){ 
                // test le type
                if ('string' != typeof value){ 
                    throw new Error(label + ' doit être une chaîne de caractères !');
                }
                value = value.trim();
                // test la longueur ou regex
                if ( value.length > 255){ 
                    throw new Error(label + ' doit contenir moins de 255 caractères !');
                }
            }

            break;
        case 'antennaStatus':
            value = value ? true : false;

            break;
        case 'antennaImg':
            value = value ? true : false;

            break;
        case 'antennaAddress':
            label = 'L\' adresse';
            // Test si vide
            if (null != value){ 
                // test le type
                if ('string' != typeof value) { 
                    throw new Error(label + ' doit être une chaîne de caractères !');
                }
                value = value.trim();
                // test la longueur ou regex
                if (value.length < 5 || value.length > 128) { 
                    throw new Error(label + ' doit contenir entre 5 et 128 caractères !');
                }
            }

            break;
        case 'antennaZipCode':
            label = 'Le code postal';
            // Test si vide
            if (null == value){ 
                throw new Error(label + ' ne peut pas être vide !');
            }
            value = value.trim();
            // test la longueur ou regex
            if (!zipCodeRegex.test(value)){ 
                throw new Error(label + ' doit contenir 5 chiffres !');
            }

            break;
        case 'antennaCity':
            label = 'La ville';
            // Test si vide
            if (null != value){ 
                // test le type
                if ('string' != typeof value){ 
                    throw new Error(label + ' doit être une chaîne de caractères !');
                }
                value = value.trim();
                // test la longueur ou regex
                if (value.length < 5 || value.length > 100){ 
                    throw new Error(label + ' doit contenir  entre 5 et 100 caractères !');
                }
            }
            // gestion du format
            value = value.toUpperCase(); 

            break;    
        case 'antennaRegion':
            label = 'La région';
            if (tabRegions[value] === undefined) { //! tester si cette expression est valide //tester si dans les clés de res.locals.tabRegions
                throw new Error(label + ' doit être choisie !');
            }

            break; 
        case 'antennaPhone':
            label = 'Le numéro de téléphone';
            // Test si vide
            if (null == value || "" == value){ 
                value = 'NC';
            } else {
                value = value.trim();
                // test la longueur ou regex
                if (!phoneRegex.test(value)) { 
                    throw new Error(label + ' doit contenir 10 chiffres !');
                }
            }
            
            break;
        case 'antennaEmail':
            label = 'L\'email';
            // Test si vide
            if (null == value){ 
                throw new Error(label + ' ne peut pas être vide !');
            }
            // test le type
            if ('string' != typeof value){ 
                throw new Error(label + ' doit être une chaîne de caractères !');
            }
            // gestion du format
            value = value.trim();
            value = value.toLowerCase(); 
            // test la longueur ou regex
            if (!emailRegex.test(value)){ 
                throw new Error(label + ' n\'est pas au format valide !');
            }

            break;
        default:
            break;
    }

    return value;

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