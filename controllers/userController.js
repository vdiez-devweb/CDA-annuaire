import User from "../models/User.js";
import bcrypt from "bcrypt";
import { formateDate } from "../middlewares/utils.js";


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
    } else if (0 === Object.keys(data).length && data.constructor === Object){ //si on a pas encore reçu des données depuis le formulaire
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
                    data[key] = validateValue(key, data[key]);
                });

                // on crypte le mot de passe reçu du formulaire
                const hash = await bcrypt.hash(data.userPassword, 10);

                //on créé l'utilisateur avec les données validées
                const user = await User.create({
                    // userEmail: validateValue('userEmail', data.userEmail), 
                    // userPassword: hash,
                    // userFirstName: validateValue('userFirstName', data.userFirstName), 
                    // userLastName: validateValue('userLastName', data.userLastName), 
                    // userZipCode: validateValue('userZipCode', data.userZipCode),
                    // userPhone: validateValue('userPhone', data.userPhone),
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
                req.flash('message_error', "ERREUR " + error);
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
            req.flash('message_error', "ERREUR " + error);
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

    if (req.session.userInfos.access == true) {
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

/**
 * 
 * Validate and formate the received datas from forms
 * 
**/
export const validateValue = (key, value) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    const pwdRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const phoneRegex = /^\d{10}$|^NC$/;
    const zipCodeRegex = /^\d{5}$/;
    let label = '';
    switch (key) {
        case 'userEmail':
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
            value = value.toLowerCase(); 
            // test la longueur ou regex
            if (!emailRegex.test(value)){ 
                throw new Error(label + ' n\'est pas au format valide !');
            }

            break;
        case 'userPassword':
            label = 'Le mot de passe';
            // Test si vide
            if (null == value){ 
                throw new Error(label + ' ne peut pas être vide !');
            }
            // test le type
            if ('string' != typeof value){ 
                throw new Error(label + ' doit être une chaîne de caractères !');
            }
            // test la longueur ou regex
            if (!pwdRegex.test(value)){ 
                throw new Error(label + ' n\'est pas au format valide !');
            }

            break;
        case 'userLastName':
            label = 'Le nom';
            // Test si vide
            if (null == value){ 
                throw new Error(label + ' ne peut pas être vide !');
            }
            // test le type
            if ('string' != typeof value){ 
                throw new Error(label + ' doit être une chaîne de caractères !');
            }
            // test la longueur ou regex
            if (value.length < 2 || value.length > 100){ 
                throw new Error(label + ' doit contenir entre 2 et 100 caractères !');
            }
            // gestion du format
            value = value.toUpperCase(); 

            break;
        case 'userFirstName':
            label = 'Le prénom';
            // Test si vide
            if (null == value){ 
                throw new Error(label + ' ne peut pas être vide !');
            }
            // test le type
            if ('string' != typeof value){ 
                throw new Error(label + ' doit être une chaîne de caractères !');
            }
            // test la longueur ou regex
            if (value.length < 2 || value.length > 100){ 
                throw new Error(label + ' doit contenir entre 2 et 100 caractères !');
            }
            // gestion du format //TODO forcer une majuscule au début de chaque mot séparé par un espace ou un tiret : https://flexiple.com/javascript/javascript-capitalize-first-letter/
            break;
        case 'userZipCode':
            label = 'Le code postal';
            // Test si vide
            if (null == value){ 
                throw new Error(label + ' ne peut pas être vide !');
            }
            // test la longueur ou regex
            if (!zipCodeRegex.test(value)){ 
                throw new Error(label + ' doit contenir 5 chiffres !');
            }

            break;
        case 'userPhone':
            label = 'Le numéro de téléphone';
            // Test si vide
            if (null == value || "" == value){ 
                value = 'NC';
            } else {
                // test la longueur ou regex
                if (!phoneRegex.test(value)){ 
                    throw new Error(label + ' doit contenir 10 chiffres !');
                }
            }

            break;
        default:
            break;
    }
    
    return value;

};