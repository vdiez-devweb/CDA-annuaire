import Antenna from "../models/Antenna.js";

const prefixTitle = "";

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
        const antennas = await Antenna.find();
        if (0 == antennas) {
            return res.status(404).render("admin/dashboard", {
                title: prefixTitle + "Dashboard",
                antennas: "",
                msg_success,
                msg_error,
                message: "Aucun centre de formation répertorié."
            });
        }
        return res.status(200).render("admin/dashboard", {
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
        return res.status(500).render("admin/dashboard", {
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

//* ANCIENNE VERSION DE L'AUTHENTIFICATION ADMIN

// /**
//  * 
//  * login administrator
//  * 
// **/
// export const login = async (req, res, next) => {
//     let dashboardHomepageURL = process.env.BASE_URL + "/admin";   
//     // si on vient directement sur la page de login (referrer undefined) on initialise le referrer avec la homepage du dashboard
//     let referer = (typeof req.get('Referrer') == 'undefined') ? dashboardHomepageURL : req.get('Referrer');

//     //si on vient du dashboard admin, on envoie bien le referrer, sinon on renvoie la homepage du dashboard
//     let fromURL = referer.includes(dashboardHomepageURL) ? referer : dashboardHomepageURL;   
//     // console.log('referrer : [' + req.get('Referrer') + ']'); //referrer : [http://localhost:8082/admin/session/6490cadd817026d33f7c1da9]
//     // console.log('originalUrl : [' + req.originalUrl + ']'); //originalUrl : [/admin/login/]
//     if (req.session.authenticated && req.session.userInfos) { //si l'utilisateur est déjà authentifié, on le redirige vers le referrer
//         // res.json(session);
//         // console.log('referrer : [' + req.get('Referrer') + ']'); //referrer : [http://localhost:8082/admin/session/6490cadd817026d33f7c1da9]
//         // console.log('originalUrl : [' + req.originalUrl + ']'); //originalUrl : [/admin/login/]
//         // console.log('déjà identifié');
//         return res.redirect(dashboardHomepageURL);
//     } else { //sinon on va l'authentifier
//         return res.status(200).render("admin/login", {
//             title: "Page d'authentification",
//             message: "",
//             fromURL: fromURL 
//         }); 
//     }
// }
// /**
//  * 
//  * authentification for administrator
//  * 
// **/
// export const auth = (req, res, next) => {
//     const username = req.body.user;
//     const password = req.body.password;
//     const fromURL = req.body.fromURL;
//     //console.log('authentification ' + req.session.authenticated); //? debug à nettoyer
//     if (username && password) {
//         if (req.session.authenticated && req.session.userInfos == { username }) { //si l'utilisateur est déjà authentifié avec le même username, on redirige
//             // res.json(session);
//             return res.redirect(fromURL);
//         } else {
//             if (password === process.env.ADMIN_PASSWORD && username === process.env.ADMIN_USERNAME) {
//                 req.session.authenticated = true;
//                 req.session.userInfos = { username };
//                 req.flash('message_success', 'Bienvenue sur le panneau d\'administration de l\'annuaire.');
//                 return res.redirect(fromURL);
//             } else {
//                 return res.status(403).render("admin/login", {
//                     title: "Login",
//                     message: "Erreur login ou mot de passe.",
//                     fromURL: fromURL
//                 });           
//             }
//         }
//     } else {
//         return res.status(403).render("admin/login", {
//             title: "Login",
//             fromURL: fromURL,
//             message: "Erreur login ou mot de passe."
//         });
//     }
// }
// /**
//  * 
//  * logout for administrator, go to the homepage of the admin dashboard
//  * 
// **/
// export const logout = (req, res, next) => {
   
//     // res.clearCookie('process.env.SESSION_NAME');

//     req.session.destroy((err)=> {
//         res.redirect(process.env.BASE_URL);
//     });
// }
};
