import User from "../models/User.js";
import bcrypt from "bcrypt";

/**
 * 
 * Go to a form for create user account
 * 
**/
export const signup = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    const data = req.body;
    const title = "Création d'un compte utilisateur";
    if (0 === Object.keys(data).length && data.constructor === Object){
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
        try {
            if (data.userPassword != data.userPasswordCtrl) {
                throw new Error('Les deux mots de passe doivent être identiques !');
            } else {
                Object.keys(data).forEach(key => {
                    validateValue(key, data[key]);

                });

                const hash = await bcrypt.hash(validateValue('userPassword', data.userPassword), 10);

                const user = await User.create({
                    userEmail: validateValue('userEmail', data.userEmail), 
                    userPassword: hash,
                    userFirstName: validateValue('userFirstName', data.userFirstName), 
                    userLastName: validateValue('userLastName', data.userLastName), 
                    userZipCode: validateValue('userZipCode', data.userZipCode),
                    userPhone: validateValue('userPhone', data.userPhone),
                });

                req.flash('message_success', "Votre compte utilisateur avec l'adresse mail " + user.userEmail + " a bien été créé.");
                return res.status(201).redirect("/");
                //TODO voir pour rediriger sur une page my account
            }
        } catch (error) {
            if (error.errors){
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
 * 
 * Go to a form to login a user account
 * 
**/
export const login = (req, res, next) => {
    
};

/**
 * 
 * Validate received datas from forms
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
            console.log('key : ' + key + 'valeur : ');
            console.log(value);
            // Test si vide
            if (null == value || "" == value){ 
                value = 'NC';
            } else {
                // test la longueur ou regex
                if (!zipCodeRegex.test(value)){ 
                    throw new Error(label + ' doit contenir 10 chiffres !');
                }
            }

            break;
        default:
            break;
    }
    
    return value;

};