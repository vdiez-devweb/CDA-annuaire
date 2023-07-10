import Session from "../../models/Session.js";
import Antenna from "../../models/Antenna.js";

/**
 * 
 * Create Session (requête post) in API  //!API
 * 
**/
export const apiPostSession = async (req, res, next) => {
    // récupérer les infos de la session à créer via req.body
    const data = req.body;
    try {
        //créer la session en BDD
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
            sessionAntenna: data.sessionAntenna,

        });
        //on met à jour automatiquement le nombre de session dans son centre de formation
        const antenna = await Antenna.findByIdAndUpdate(
            { "_id": data.sessionAntenna }, 
            { $inc: { antennaNbSessions: 1 } }, 
            { new: true }
            //  (err, doc)
        );
        //renvoyer les infos à la vue
        if (null == session) {
            return res.status(400).json("Erreur sur la création")
        }
        return res.status(201).json({ session });
    } catch(error) {
        // !pour retravailler le message renvoyé, (ne sera pas visible en production), => utiliser les exceptions
        // if (error.errors) {//si on a des erreurs de validation Mongoose :
        //     let customError = {}; //on créé un tableau vide
        //     let fieldsInErrors = Object.keys(error.errors); // on récupère les champs qui sont en erreur
            


        //     //on parcours l'objet d'erreurs pour construire la réponse
        //     (fieldsInErrors).forEach(currentField => {
        //         // switch (error.errors[currentField].) {
        //         //     case kind:
                        
        //         //         break;
                        
        //         //         default:
        //         //             break;
        //         // }
                        
                        
        //         customError[currentField] = error.errors[currentField]['properties']['message']; //message pour le required
        //         if (error.errors[currentField]['properties']['type'] == "unique") { // message pour l'unicité
        //             customError[currentField] = 'Le champ ' + currentField + ' doit être unique, <' 
        //                                         + error.errors[currentField]['properties']['value'] + '> existe déjà!';
        //         }
        //     });
        //     error = customError;
        // }
        return res.status(500).json({ error });
    }
};

/**
 * 
 * Update Session (requête patch) in API //!API
 * 
**/
export const apiUpdateSession = async (req, res, next) => {
    const data = req.body;
    try{
        const result = await Session.findByIdAndUpdate(
            { "_id": data.id }, 
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
                sessionAntenna: data.sessionAntenna,
            }, 
            { 
                new: true,
                runValidators:true,
            }
            //  (err, doc)
        );
        if (null == result) {
            return res.status(404).json({ "Erreur": "mise à jour impossible, session non trouvée" });
        }
        return res.status(200).json({ 
            result
        });
    } catch(error) {
        // !pour retravailler le message renvoyé, (ne sera pas visible en production), => utiliser les exceptions
        // let customError = {}; //on créé un objet vide
        // let fieldsInErrors = []; // on créé un tableau vide
        // if (error.errors) {//si on a des erreurs de validation Mongoose :
        //     fieldsInErrors = Object.keys(error.errors); // on récupère les champs qui sont en erreur
        //     (fieldsInErrors).forEach(currentField => { //on parcours l'objet d'erreurs pour construire la réponse
        //         customError[currentField] = error.errors[currentField]['properties']['message'];
        //     });
        //     error = customError;
        // }
        // if (error.codeName == "DuplicateKey") {//si on a des erreurs de validation Mongoose (duplication)
        //     fieldsInErrors = Object.keys(error.keyValue); // on récupère les champs qui sont en erreur de duplication
        //     (fieldsInErrors).forEach(currentField => {
        //         customError[currentField] = 'Le champ ' + currentField + ' doit être unique, <' + error['keyValue'][currentField] + '> existe déjà!';
        //     });
        //     error = customError;
        // }
        return res.status(400).json({ error });
        // return res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, centre non trouvé" });
    }
};

/**
 * 
 * get a single Session in API  //!API
 * 
**/
export const apiGetSession = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.sessionId;
    try{
        const session = await Session.findById(id);
        if (null == session) {
            return res.status(404).json({ "message": "la session n'existe pas" });
        }
        return res.status(200).json({ session });
    } catch(error) {
        return res.status(500).json(error);
    }
    // const apiSessions = await Session.find({});
 
};

/**
 * 
 * get all sessions in API  //!API
 * 
**/
export const apiGetSessions = async (req, res, next) => {
    try {
        const apiSessions = await Session.find();
        if (0 == apiSessions.length || apiSessions == 0) {
            return res.status(404).json( "Aucune session n'est trouvée" );
        }
        return res.status(200).json({ apiSessions });
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * 
 * delete a single Session in API  //!API
 * 
**/
export const apiDeleteSession = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.sessionId;

    try{
        const session = await Session.deleteOne({ "_id": id });
        if (0 == session.deletedCount){
            return res.status(404).json("Erreur : Session introuvable.");
        }
        return res.status(200).json({ "Message": "Session supprimée." });
    } catch (error) {
        return res.status(500).json(error);
    }
};



