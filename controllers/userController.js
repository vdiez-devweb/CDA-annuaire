import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { formateDate } from "../middlewares/utils.js";


import {
    createAuthToken, 
    isAuthenticated,
    clearToken
} from "../middlewares/auth.js";

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
    // display form
    if (req.session.userInfos.access == true) {
        res.status(200).redirect("/user-account"); 
    } else if (0 === Object.keys(data).length && data.constructor === Object){
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
        // create User with datas received from the form
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
 * 
 * Go to a form to login a user account and check if 
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
                // req.flash('message_success', "Vous êtes bien connecté à l'application");

                // return res.status(200).json({
                //     userId: user._id,
                //     token: jwt.sign(
                //         { 'access': 'authenticated', 'userId': user._id, 'role': user.userRole },
                //         process.env.TOKEN_JWT_SECRET,
                //         { expiresIn: '24h' }
                //     )
                // });

                // res.set('userId', user._id);
                // res.set('token', jwt.sign(
                //     { 'access': 'authenticated', 'userId': user._id, 'role': user.userRole },
                //     process.env.TOKEN_JWT_SECRET,
                //     { expiresIn: '24h' }
                // ));

                return createAuthToken(req, res, user._id.toString() , user.userRole); //? test d'une autre manière
    // const infos = { 'access': 'authenticated', 'userId': user._id, 'role': user.userRole };

    // const secretJwt = process.env.TOKEN_JWT_SECRET;
    // const cookieName = process.env.COOKIE_AUTH_NAME;

    // const accessToken = jwt.sign(
    //     infos, 
    //     secretJwt, 
    //     { expiresIn: '24h' }
    // )
    // req.headers.authorization = accessToken;
    // res.json({
    //     accessToken
    // });

                // const token = jwt.sign({ 'access': 'authenticated', 'userId': user._id, 'role': user.userRole }, process.env.TOKEN_JWT_SECRET, { expiresIn: '24h' });
                // console.log(token); //!debug
                // console.log(req.cookies[process.env.COOKIE_AUTH_NAME]); //!debug

                // return res.status(200).redirect("/user-account");    
                // return res.status(200).redirect("/"); //? pour tester d'une autre manière   
                // return res.status(200).render("login", {
                //     title: title,
                //     message_success: req.flash('message_success'),
                //     message_error: req.flash('message_error'),
                //     msg_success,
                //     msg_error,    
                //     message: "",
                //     auth: "authenticated",
                //     userId: user._id,
                //     token: jwt.sign(
                //         { userId: user._id, userRole: user.userRole },
                //         process.env.TOKEN_JWT_SECRET,
                //         { expiresIn: '24h' }
                //     )
                // });
            }
        } catch (error) {
            req.flash('message_error', "ERREUR " + error);
            return res.status(500).redirect("/login"); 
        }
    }
};

/**
 * logout User (delete cookie)
 * 
 */
export const logout = (req, res) => {
    clearToken(res) ;
    req.session.destroy((err)=> {
        res.redirect(process.env.BASE_URL);
    });
};

/**
 * Account page of the User
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