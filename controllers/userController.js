import User from "../models/User.js";
import bcrypt from "bcrypt";
import { formateDate, validateAndFormateValue } from "../middlewares/validation.js";


import {
    createAuthToken, 
    clearToken
} from "../middlewares/auth.js";

/**
 * 
 * Go to a form for create user account (student)
 * 
**/
export const signup = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    const data = req.body;
    const title = "Création d'un compte utilisateur";
    // display form
    if (req.session.userInfos.access == true) { //si on accède à la route en étant déjà connecté
        res.status(200).redirect("/user-account"); 
    } else if (0 === Object.keys(data).length && data.constructor === Object) { //si on a pas encore reçu des données depuis le formulaire
        return res.status(200).render("signup", {
            title: title,
            action: "create",
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,    
            message: "",
            user: "",
        });
    } else {
        // On créé User a partir des données reçues du formulaire 
        try {
            if (data.userPassword != data.userPasswordCtrl) {
                throw new Error('Les deux mots de passe doivent être identiques !');
            } else { // on vérifie et reformate les données reçues avant de les passer en BDD
                Object.keys(data).forEach(key => {
                    data[key] = validateAndFormateValue(key, data[key]);
                });

                // on crypte le mot de passe reçu du formulaire
                const hash = await bcrypt.hash(data.userPassword, 10);

                //on créé l'utilisateur avec les données validées
                const user = await User.create({
                    userEmail: data.userEmail, 
                    userPassword: hash,
                    userFirstName: data.userFirstName, 
                    userLastName: data.userLastName, 
                    userZipCode: data.userZipCode,
                    userPhone: data.userPhone,
                });

                req.flash('message_success', "Votre compte utilisateur avec l'adresse mail " + user.userEmail + " a bien été créé.");

                return res.status(201).redirect("/login");
            }
        } catch (error) {
            if (error.errors){
                req.flash('message_error', error + " Vous devrez ressaisir le mot de passe");
                // return res.status(500).redirect("/signup"); 
                return res.status(401).render("signup", {
                    title: title,
                    action: "create",
                    message_success: req.flash('message_success'),
                    message_error: req.flash('message_error'),
                    msg_success,
                    msg_error,    
                    message: "",
                    user: data,
                });
            }
            req.flash('message_error', error + " Vous devrez ressaisir le mot de passe");
            // return res.status(500).redirect("/signup"); 
            return res.status(500).render("signup", { 
                title: title,
                action: "create",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,    
                message: "",
                user: data,
            }); 
        }
    }
};

/**
 * Log a user in the app
 * 1 -> if no datas received, Go to a form to login a user account 
 * 2 -> if datas received from form, trait datas to check if they are valide and create the session & token
 * 
**/
export const login = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    const data = req.body;
    const title = "Identification";

    if (typeof req.session.userInfos.access != 'undefined' && req.session.userInfos.access == true) {
        res.status(200).redirect("/user-account"); 
    } else if (0 === Object.keys(data).length && data.constructor === Object){
        return res.status(200).render("login", {
            title: title,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,    
            message: "",
        });
    } else {
        try  {
            const user = await User.findOne({userEmail: req.body.userEmail})

            if (null == user){
                req.flash('message_error', "La paire identifiant / mot de passe est incorrecte");
                return res.status(401).redirect("/login"); 
            } else if (!bcrypt.compare(req.body.userPassword, user.userPassword)){
                req.flash('message_error', "La paire identifiant / mot de passe est incorrecte");
                return res.status(401).redirect("/login"); 
            } else {

                return createAuthToken(req, res, user._id.toString() , user.userRole);
            }
        } catch (error) {
            req.flash('message_error', "ERREUR " + error);
            return res.status(500).redirect("/login"); 
        }
    }
};

/**
 * logout User (delete cookie / token)
 * 
 */
export const logout = (req, res) => {
    clearToken(res) ;
    req.session.destroy((err)=> {
        res.redirect(process.env.BASE_URL);
    });
};

/**
 * Display the account page of the User
 * 
 */
export const userAccount = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');

    const id = req.session.userInfos.userId;

    try {
        //récupérer les infos du compte en session
        const user = await User.findOne({_id: id });
        user.createdAtFormatted = formateDate(user.createdAt, 'complete');
        user.updatedAtFormatted = formateDate(user.updatedAt, 'complete');
        return res.status(200).render("userAccount", {
            title: "Mon compte",
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: "",
            user

        });
    } catch(error) {
        req.flash('message_error', "ERREUR " + error);
        return res.status(500).redirect("/"); 
    }
};