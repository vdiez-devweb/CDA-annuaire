import Antenna from "../models/Antenna.js";
import Session from "../models/Session.js";

/**
 * 
 * get a single antenna in webApp 
 * 
**/
export const getAntenna = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const antennaSlug = req.params.antennaSlug;
    try{
        const antenna = await Antenna.findOne({ "antennaSlug": antennaSlug });
        const sessions = await Session.find({"productAntenna": antenna._id});

        if (0 == antenna) {
            res.status(404).render("antenna/getAntenna", {
                title: "Liste des sessions par centre de formation",
                sessions: "",
                antenna: "",
                message: "Centre introuvable."
            });
        }
        if ("" == sessions) {
            res.status(404).render("antenna/getAntenna", {
                title: "Liste des sessions " + antenna.antennaName,
                sessions: "",
                antenna: antenna,
                message: "Aucune session trouvé."
            });
        }
        res.status(200).render("antenna/getAntenna", {
            title: "Liste des sessions " + antenna.antennaName,
            message: "",
            antenna: antenna,
            sessions: sessions 
        });
    } catch(error) {
        res.status(500).render("antenna/getAntenna", {
            title: "Liste des sessions",
            sessions: "",
            antenna: "",
            message: error
        });
    }
};



/**
 * TODO utilisé pour récupérer le nb de session pour chaque centre de formation ///////////////////:
 * get count of Sessions in a antenna in webApp  
 * 
**/
// export const getCountSessionInAntenna = async (antenna, compteur, res, next) => {
//     //? test 1 /////////////////////
//     const count =  await Session.countDocuments({productAntenna: antenna._id});
//     console.log('mon compteur ' + antenna._id + " : " + count);
//     // res.end(count);
//     return count;   

//     //? test 3 ///////////////////// (retirer le async sur la fonction)
//     // return new Promise(resolve => {
//     //     setTimeout(() => {
//     //       resolve(Session.countDocuments({productAntenna: antenna._id}));
//     //     }, 2000);
//     //   });
// }

/**
 * 
 * get all antennas in webApp
 * 
**/
export const getAntennas = async (req, res, next) => {
    try{
        const antennas = await Antenna.find({});

        if (null == antennas) {
            res.status(404).render("antenna/getAntennas", {
                title: "Liste des centres de formation",
                antennas: "",
                message: "Aucun centre enregistré."
            });
        }
        res.status(200).render("antenna/getAntennas", {
            title: "Liste des centres de formation",
            antennas:  antennas,
            message: ""
        });
    } catch(error) {
        res.status(500).render("antenna/getAntennas", {
            title: "Erreur Liste des centres de formation",
            antennas: "",
            message: error
        });
    }
};


