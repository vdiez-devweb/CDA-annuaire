import Antenna from "../../models/Antenna.js";

/**
 * 
 * get all antennas in API  //!API
 * 
**/
export const apiGetAntennas = async (req, res, next) => {
    const apiAntennas = await Antenna.find({});
    if (null == apiAntennas) {
        res.status(404).json({ "message": "Aucun centre de formation n'est trouvé" });
    }
    res.status(200).json({ apiAntennas });
 };

/**
 * 
 * delete a single antenna in API //!API
 * 
**/
export const apiDeleteAntenna = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.antennaId;

    try{
        const antenna = await Antenna.deleteOne({ "_id": id });
        //console.log(antenna); //? commentaire debug à supprimer ///////////////////////

        res.status(200).json({ "Message": "centre de formation supprimé." });
    } catch {
        res.status(404).json("Erreur : centre de formation introuvable.");
    }
};

/**
 * 
 * Create Antenna (requête post) in API //!API
 * 
**/
export const apiPostAntenna = async (req, res, next) => {
    // envoyer le nom du centre de formation via req.body
    const antennaName = req.body.antennaName;
    const antennaDescription = req.body.antennaDescription;
    const antennaSlug = req.body.antennaSlug;
    const antennaImg = req.body.antennaImg ? req.body.antennaImg : false;

    // on créé un nouveau centre de formation avec mongoose (Antenna est un objet Schema de mongoose déclaré dans le model)
    try{
        const antenna = await Antenna.create({
            // antennaName: antennaName,
            antennaName, // si la clé = valeur, on ne répète pas
            antennaDescription,
            antennaSlug,
            antennaImg 
        });
        // console.log(antenna); //? commentaire debug à supprimer ///////////////////////
        // res.status(201).redirect("/antennas");
        // res.status(201).send("antenna created : ", antenna);
        res.status(201).json({ antenna });
    } catch (error) {
        // !pour retravailler le message renvoyé, (ne sera pas visible en production), => utiliser les exceptions
        // if (error.errors) {//si on a des erreurs de validation Mongoose :
        //     let customError = {}; //on créé un tableau vide
        //     let fieldsInErrors = Object.keys(error.errors); // on récupère les champs qui sont en erreur
        //     //on parcours l'objet d'erreurs pour construire la réponse
        //     (fieldsInErrors).forEach(currentField => {
        //         customError[currentField] = error.errors[currentField]['properties']['message'];
        //         if (error.errors[currentField]['properties']['type'] == "unique") {
        //             customError[currentField] = 'Le champ ' + currentField + ' doit être unique, <' 
        //                                         + error.errors[currentField]['properties']['value'] + '> existe déjà!';
        //         }
        //     });
        //     error = customError;
        // }
        res.status(400).json({ error });
    }
};

/**
 * 
 * Update Antenna (requête patch) in API //!API
 * 
**/
export const apiUpdateAntenna = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique et le nouveau nom passé dans le corps de la requête
    const id = req.body.id;
    const antennaName = req.body.antennaName;
    const antennaDescription = req.body.antennaDescription;
    const antennaSlug = req.body.antennaSlug;
    const antennaImg = req.body.antennaImg;
    try {
        const result = await Antenna.findByIdAndUpdate(
            { 
                "_id": id 
            }, 
            { 
                antennaName,
                antennaDescription,
                antennaSlug,
                antennaImg 
            }, 
            { new: true }
            //  (err, doc)
        );
        //console.log(result); //? commentaire debug à supprimer ///////////////////////
        res.status(200).json({ 
            result
        });
    } catch(error) {
        // !pour retravailler le message renvoyé, (ne sera pas visible en production), => utiliser les exceptions
        // let customError = {}; //on créé un objet vide
        //let fieldsInErrors = []; // on créé un tableau vide
        // if (error.errors) {//si on a des erreurs de validation Mongoose :
        //     fieldsInErrors = Object.keys(error.errors); // on récupère les champs qui sont en erreur
        //     (fieldsInErrors).forEach(currentField => { //on parcours l'objet d'erreurs pour construire la réponse
        //         customError[currentField] = error.errors[currentField]['properties']['message'];
        //     });
        // }
        // if (error.codeName == "DuplicateKey") {//si on a des erreurs de validation Mongoose (duplication)
        //     fieldsInErrors = Object.keys(error.keyValue); // on récupère les champs qui sont en erreur de duplication
        //     (fieldsInErrors).forEach(currentField => {
        //         error.message = 'Le champ ' + currentField + ' doit être unique, <' + error['keyValue'][currentField] + '> existe déjà!';
        //         console.log(error.message);  //? commentaire debug à supprimer ///////////////////////
        //     });
        //     // res.status(400).json({ customError });
        // }
        // res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, centre de formation non trouvé" });
        res.status(400).json({ error });
    }
};

/**
 * 
 * get a single antenna in API //!API 
 * 
**/
export const apiGetAntenna = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.antennaId;
    try{
        const antenna = await Antenna.findOne({ "_id": id });
        if (null == antenna) {
            res.status(404).json({ "message": "le centre de formation n'existe pas" });
        }
        res.status(200).json({ antenna });
    } catch(err) {
        res.status(500).json({ "message": "serveur erreur" });
    }
    // const apiAntennas = await Antenna.find({});
};

