import Antenna from "../../models/Antenna.js";
import Session from "../../models/Session.js";

/**
 * 
 * get all antennas in API  //!API
 * 
**/
export const apiGetAntennas = async (req, res, next) => {
    const apiAntennas = await Antenna.find();
    try{
        if (0 == apiAntennas.length) {
            return res.status(404).json({ "message": "Aucun centre de formation n'est trouvé" });
        }
        return res.status(200).json({ apiAntennas });
    } catch (error) {
        return res.status(404).json(error);
    }
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
        if (0 == antenna.deletedCount){
            return res.status(404).json("Erreur : centre de formation introuvable.");
        }

        return res.status(200).json({ "Message": "centre de formation supprimé." });
    } catch (error) {
        return res.status(404).json(error);
    }
};

/**
 * 
 * Create Antenna (requête post) in API //!API
 * 
**/
export const apiPostAntenna = async (req, res, next) => {
    // envoyer le nom du centre de formation via req.body
    // const antennaName = req.body.antennaName;
    // const antennaSlug = req.body.antennaSlug;
    // const antennaDescription = req.body.antennaDescription;
    // const antennaImg = req.body.antennaImg ? req.body.antennaImg : false;
    // const antennaRegion = req.body.antennaRegion;
    // const antennaPhone = req.body.antennaPhone;
    // const antennaStatus = req.body.antennaStatus ? req.body.antennaStatus : false;
    // const antennaAddress = req.body.antennaAddress;
    // const antennaZipCode = req.body.antennaZipCode;
    // const antennaCity = req.body.antennaCity;
    const data = req.body;
    
    // on créé un nouveau centre de formation avec mongoose (Antenna est un objet Schema de mongoose déclaré dans le model)
    try{
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
        // console.log(antenna); //? commentaire debug à supprimer ///////////////////////
        // return res.status(201).redirect("/antennas");
        // return res.status(201).send("antenna created : ", antenna);
        
        return res.status(201).json({ antenna });
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
        return res.status(400).json({ error });
    }
};

/**
 * 
 * Update Antenna (requête patch) in API //!API
 * 
**/
export const apiUpdateAntenna = async (req, res, next) => {
    const data = req.body;
     try {
        //pour mettre à jour le nombre de sessions dans l'antenne
        const antennaNbSessions =  await Session.countDocuments({sessionAntenna: data.id});
        const result = await Antenna.findByIdAndUpdate(
            { 
                "_id": data.id 
            }, 
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
                antennaNbSessions: antennaNbSessions
            }, 
            { 
                new: true,
                runValidators:true,
            }
            //  (err, doc)
        );
        if (null == result) {
            return res.status(404).json("Erreur : centre de formation introuvable.");
        }
        return res.status(200).json({ 
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
        //     // return res.status(400).json({ customError });
        // }
        // return res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, centre de formation non trouvé" });
        return res.status(500).json({ error });
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
        const antenna = await Antenna.findById( id );
        if (null == antenna) {
            return res.status(404).json({ "message": "le centre de formation n'existe pas" });
        }
        return res.status(200).json({ antenna });
    } catch(err) {
        return res.status(500).json({ err });
    }
    // const apiAntennas = await Antenna.find({});
};

