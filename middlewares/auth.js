import jwt from "jsonwebtoken";

/**
 * 
 * middleware to test if user is authenticated (used in routes)
 * * Version avec Cookie
**/

/**
* créer un token au moment du login User
*/
export function createAuthToken(req, res, guidUser, role) {
    const infos = { 'access': true, 'userId': guidUser, 'role': role };

    const secretJwt = process.env.TOKEN_JWT_SECRET;
    const cookieName = process.env.COOKIE_AUTH_NAME;

    // return jwt.sign(infos, secretJwt, { expiresIn: '24h' });
    try {
        const token = jwt.sign(
            infos, 
            secretJwt, 
            { expiresIn: '24h' }
        );
        req.session.authenticated = true;
        req.session.userInfos = infos;    

        req.flash('message_success', "Vous êtes bien connecté à l'application");

        // Enregistrement du token dans un cookie
        res.cookie(cookieName, token, { httpOnly: true });

        //TODO modifier le fonctionnement pour 
        //? utiliser les headers plutôt qu'un cookie. 
        //? ou bien voir si on peut modifier la session en BDD pour y ajouter le token
        //? attention, bien gérer les modifs dans le logout et les cas d'erreurs
        // app.use(session({
        //     name: cookieName,
        //     secret: process.env.SESSION_SECRET,
        //     saveUninitialized: false,
        //     resave: false, //don't save session if unmodified
        //     store: mongoStore.create({
        //       mongoUrl: process.env.MONGODB_URI,
        //       autoRemove: 'native', // Default,
        //       ttl: 14 * 24 * 60 * 60, //Time to live in seconds //TODO modifier la durée ? ici 14 jours 
        //       // crypto: {
        //       //   secret: process.env.SESSION_SECRET
        //       // },
        //       collectionName: 'appsessions',
        //     })
        //   }));
          
        //redirection en fonction du role
        if (role == 'admin'){

            return res.status(200).redirect("/admin"); 
        }

        return res.status(200).redirect("/user-account"); 
    } catch (error) {
        req.flash('message_error', "Accès refusé");

        return res.status(403).redirect("/"); ; 
    }
}

/**
* vérifier le token sur les routes protégées pour le User
*/
export function authorize(req, res, next) {
        
    const secretJwt = process.env.TOKEN_JWT_SECRET;
    const cookieName = process.env.COOKIE_AUTH_NAME;

    // Récupération du cookie
    const token = req.cookies[cookieName];

    // On vérifie si le cookie existe
    if (!token) {
        req.flash('message_error', "Accès refusé");
        return res.status(403).redirect("/"); ; // Stoppe le traitement en renvoyant une erreur 'forbidden'
        // return res.sendStatus(403); // Stoppe le traitement en renvoyant une erreur 'forbidden'
    }

    // -> puisque le cookie existe, on va vérifier le token qu'il contient
    try {
        // Vérification et récupération du payload :
        const payload = jwt.verify(token, secretJwt);

        // Place le payload dans req pour l'envoyer au middleware suivant :
        req.session.userInfos.userId = payload.userId ; 
        req.session.userInfos.access = payload.access ; 
        req.session.userInfos.role = payload.role ; 
        
        req.session.authenticated = true;
        //req.session.user = { payload.userId, payload.access, payload.role };

        // Tout est ok : on exécute le handler/middleware suivant :
        next() ; 
        
    } catch {
        // Le token n'était pas/plus valide :
        req.flash('message_error', "Accès refusé");
        res.clearCookie(cookieName) ; // On efface le cookie
        return res.status(403).redirect("/"); ; // Stoppe le traitement en renvoyant une erreur 'forbidden'
        // return res.sendStatus(403); // Stoppe le traitement en renvoyant une erreur 'forbidden'
    }
}

/**
* vérifier le token sur les routes protégées pour le User
*/
export function authorizeAdmin(req, res, next) {
        
    const secretJwt = process.env.TOKEN_JWT_SECRET;
    const cookieName = process.env.COOKIE_AUTH_NAME;

    // Récupération du cookie
    const token = req.cookies[cookieName];

    // On vérifie si le cookie existe
    if (!token) {
        req.flash('message_error', "Accès refusé");
        return res.status(403).redirect("/"); ; // Stoppe le traitement en renvoyant une erreur 'forbidden'
        // return res.sendStatus(403); // Stoppe le traitement en renvoyant une erreur 'forbidden'
    }

    // -> puisque le cookie existe, on va vérifier le token qu'il contient
    try {
        // Vérification et récupération du payload :
        const payload = jwt.verify(token, secretJwt);

        //on vérifie que les infos dans la session sont bien comme dans le token
        if (req.session.userInfos.userId != payload.userId || req.session.userInfos.role != payload.role) {
            clearToken(res) ;
            req.session.authenticated = false;
            req.session.userInfos = { 'access': false, 'userId': null, 'role': 'anonymous' };
            req.flash('message_error', "Accès refusé");
            return res.status(403).redirect("/");
        } else {
        //req.session.user = { payload.userId, payload.access, payload.role };
            if (payload.role !='admin') {
                req.flash('message_error', "Accès refusé");
                return res.status(403).redirect("/");
            } else {
                // Tout est ok : on exécute le handler/middleware suivant :
                req.session.authenticated = true;
                req.session.userInfos.userId = payload.userId ; 
                req.session.userInfos.access = payload.access ; 
                req.session.userInfos.role = payload.role ;
                next() ; 
            }
        }        
    } catch {
        // Le token n'était pas/plus valide :
        req.flash('message_error', "Accès refusé");
        clearToken(res) ;
        return res.status(403).redirect("/"); // Stoppe le traitement en renvoyant une erreur 'forbidden'
        // return res.sendStatus(403); // Stoppe le traitement en renvoyant une erreur 'forbidden'
    }
}

/**
 *  vérifier que l'utilisateur est connecté (vérifier que les infos du token correspondent aux infos de req.session)
 */
export const isAuthenticated = (req, res, next) => { 
    const secretJwt = process.env.TOKEN_JWT_SECRET;
    const cookieName = process.env.COOKIE_AUTH_NAME;

    if (undefined == typeof req.session.userInfos || !req.session.userInfos) {
        clearToken(res) ;
        req.session.authenticated = false;
        req.session.userInfos = { 'access': false, 'userId': null, 'role': 'anonymous' };
        next() ;
    } else {
        // Récupération du cookie
        const token = req.cookies[cookieName];

        // On vérifie si le cookie existe
        if (!token) {
            clearToken(res) ;
            req.session.authenticated = false;
            req.session.userInfos = { 'access': false, 'userId': null, 'role': 'anonymous' };
            next() ; 
        } else {
            // Vérification et récupération du payload :
            const payload = jwt.verify(token, secretJwt);

            //on vérifie que les infos dans la session sont bien comme dans le token
            if (req.session.userInfos.userId != payload.userId || req.session.userInfos.role != payload.role) {
                clearToken(res) ;
                req.session.authenticated = false;
                req.session.userInfos = { 'access': false, 'userId': null, 'role': 'anonymous' };
                next() ;               
            } else {
                // Tout est ok : on exécute le handler/middleware suivant :
                req.session.authenticated = true;
                req.session.userInfos.userId = payload.userId ; 
                req.session.userInfos.access = payload.access ; 
                req.session.userInfos.role = payload.role ;
                next() ;  
            }
        }
    }
};

/**
 * 
 *  Pour déconnecter l'User 
 */
export function clearToken(res) {
    const cookieName = process.env.COOKIE_AUTH_NAME;
    // Suppression du cookie contenant le token
    res.clearCookie(cookieName) ;
    // res.clearCookie("connect.sid") ;
    // res.clearCookie("sid") ;
}

/**
* pour la version autorisation Admin avec le header authorized + jwt
*/
// export const isAuthenticated = (req, res, next) => { 
//    try {
//         const token = req.headers.authorization.split(' ')[1]; // pour ignorer le mot bearer
//         console.log(token); //!debug
//         const decodedToken = jwt.verify(token, process.env.TOKEN_JWT_SECRET);
//         const userId = decodedToken.userId;
//         req.auth = {
//             userId: userId
//         };
//    } catch (error) {
//         req.flash('message_error', "ERREUR " + error);
//         return res.status(401).redirect("/login");     
//    }
// };

