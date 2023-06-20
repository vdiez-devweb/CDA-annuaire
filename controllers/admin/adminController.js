import Antenna from "../../models/Antenna.js";
import Session from "../../models/Session.js";

const prefixTitle = "Administration - ";

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
 * login administrator
 * 
**/
export const login = async (req, res, next) => {
    let dashboardHomepageURL = process.env.BASE_URL + "/admin";   
    // si on vient directement sur la page de login (referrer undefined) on renverra sur la homepage du dashboard
    let referer = (typeof req.get('Referrer') == 'undefined') ? dashboardHomepageURL : req.get('Referrer');

    //si on vient du dashboard admin, on envoie bien le referrer, sinon on renvoie l'url /admin (homepage du dashboard)
    let fromURL = referer.includes(dashboardHomepageURL) ? referer : dashboardHomepageURL;   
    
    if (req.session.authenticated && req.session.user) { //si l'utilisateur est déjà authentifié, on le redirige vers le referrer
        // res.json(session);
        res.redirect(dashboardHomepageURL);
    } else {
        res.status(200).render("login", {
            title: "Page d'authentification",
            message: "",
            fromURL: fromURL 
        }); 
    }
}
/**
 * 
 * authentification for administrator
 * 
**/
export const auth = (req, res, next) => {
    const username = req.body.user;
    const password = req.body.password;
    const fromURL = req.body.fromURL;
    //console.log('authentif ' + req.session.authenticated); //? debug à nettoyer
    if (username && password) {
        if (req.session.authenticated && req.session.user == { username }) { //TODO est-ce nécessaire ?
            // res.json(session);
            res.redirect(fromURL);
        } else {
            if (password === process.env.ADMIN_PASSWORD && username === process.env.ADMIN_USERNAME) {
                req.session.authenticated = true;
                req.session.user = { username };
                req.flash('message_success', 'Bienvenue sur le panneau d\'administration de l\'annuaire.');
                res.redirect(fromURL);
            } else {
                res.status(403).render("login", {
                    title: "Login",
                    message: "Erreur mot de passe.",
                    fromURL: fromURL
                });           
            }
        }
    } else {
        res.status(403).render("login", {
            title: "Login",
            fromURL: fromURL,
            message: "Erreur login ou mot de passe."
        });
    }
}
/**
 * 
 * logout for administrator, go to the homepage of the admin dashboard
 * 
**/
export const logout = (req, res, next) => {
    req.session.destroy((err)=> {
        res.redirect("../");
    });
}

/**
 * 
 * get the list of all antennas in admin dashboard (it's the homepage of the dashboard)
 * TODO proposer un affichage type dashboard avec le nb de centres de formation et de sessions, nb de connexion etc.
 * 
**/
export const dashboard = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    try{
        const antennas = await Antenna.find({});
        if (0 == antennas) {
            return res.status(404).render("admin/dashboard", {
                title: prefixTitle + "Dashboard",
                antennas: "",
                msg_success,
                msg_error,
                message: "Aucun centre de formation répertorié."
            });
        }
        res.status(200).render("admin/dashboard", {
            title: prefixTitle + "Dashboard",
            antennas: antennas,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: ""
        });
    } catch(error) {
        req.flash('message_error', error);
        res.status(500).render("admin/dashboard", {
            title: prefixTitle + "Dashboard",
            sessions: "",
            antenna: "",
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: ""
        });
    }


};

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
            return res.status(404).render("admin/getAntennas", {
                title: "Liste des centres de formation",
                antennas: "",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,
                message: "Aucun centre trouvé."
            });
            message= "Aucun centre de formation répertorié.";
            antennas = "";
        }
        res.status(200).render("admin/getAntennas", {
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

        if ("" == sessions) {
            message= "Aucune session dans ce centre de formation.";
        }
        res.status(200).render("admin/getAntenna", {
            title: prefixTitle + "Liste des sessions " + antenna.antennaName,
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

    res.status(200).render("admin/createAntenna", {
        title: prefixTitle + "Création de centre de formation ",
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
            antennaImg: data.antennaImg,
            antennaRegion: data.antennaRegion,
            antennaPhone: data.antennaPhone,
            antennaStatus: data.antennaStatus,
            antennaAddress: data.antennaAddress,
            antennaZipCode: data.antennaZipCode,
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
        // res.status(500).render("admin/getAntenna", {
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
 * get the list of all sessions in admin dashboard 
 * 
**/
export const getSessions = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    try{
        const sessions = await Session.find({}).populate("sessionAntenna");
        if (null == sessions || 0 == sessions.length) {
            return res.status(404).render("admin/getSessions", {
                title: "Liste des sessions",
                sessions: "",
                message: "Aucun session trouvée."
            });
        }
        res.status(200).render("admin/getSessions", {
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
        res.status(200).render("admin/getSession", {
            title: "Fiche Session " + session.sessionName,
            session: session,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: ""
        });
    } catch (error) {
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
    const antennaSlug = req.params.antennaSlug;
    let antennaSelected = null;
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    try {
        if (antennaSlug != null) {
            antennaSelected = await Antenna.findOne({ "antennaSlug": antennaSlug });
            if (antennaSelected) antennaSelected = antennaSelected._id.toString();
        } 
        const antennas = await Antenna.find({});

        if (0 == antennas) {
            req.flash('message_error', "Aucun centre de formation répertorié, vous devez créer un centre de formation avant de pouvoir ajouter une session.");
            return res.status(404).render("admin/createSession", {
                title: prefixTitle + " Création de session",
                antennas: "",
                antennaSelected: antennaSelected,
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,
                antennaSlug,
                message: ""
            });
        }
        res.status(200).render("admin/createSession", {
            title: prefixTitle + " Création de session",
            antennas: antennas,
            antennaSelected: antennaSelected,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,    
            message: "",
            antennaSlug
        });
    } catch {
        res.status(404).render("admin/getSessions", {
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

        const antennaSlug = session.sessionAntenna.antennaSlug;
        antennaSelected = session.sessionAntenna._id.toString();

        // if (antennaSlug != null) {
        //     antennaSelected = await Antenna.findOne({ "antennaSlug": antennaSlug });
        //     if (antennaSelected) antennaSelected = antennaSelected._id.toString()
        // }     

        const antennas = await Antenna.find({});

        if (null == session) {
            req.flash('message_error', "Erreur : session introuvable.");
            return res.status(404).redirect(req.get('Referrer'));
        }
        if (0 == antennas) {
            req.flash('message_error', "Erreur : Aucun centre de formation répertorié.");
            return res.status(404).redirect(req.get('Referrer'));
        }
        res.status(200).render("admin/updateSession", {
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
        res.status(200).render("admin/updateAntenna", {
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
            antennaImg: data.antennaImg,
            antennaRegion: data.antennaRegion,
            antennaPhone: data.antennaPhone,
            antennaStatus: data.antennaStatus,
            antennaAddress: data.antennaAddress,
            antennaZipCode: data.antennaZipCode,
            antennaCity: data.antennaCity,
            antennaNbSessions: data.antennaNbSessions,
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
 * TODO
 * Update number of Students  in a Session in admin dashboard 
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

/**
 * TODO ? 
 * Update number of Students  in an Antenna in admin dashboard 
 * 
**/
// export const ajaxUpdateNbStudentsInAntenna = async (req, res, next) => {
//     const id = req.params.sessionId;
//     //TODO chercher les sessions de cette antenne et ajouter le nombre d'étudiants qui y ont participé 
// };