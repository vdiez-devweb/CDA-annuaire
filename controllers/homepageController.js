import Antenna from "../models/Antenna.js";

//on déclare la fonction, 2 façons possibles
// exports.getHomePage = (req, res, next) => {
//     res.render("homepage", {
//         title: "Homepage";
//     })
// };

export const getHomepage = async (req, res, next) => {
    try{
        const antennas = await Antenna.find({});
        console.log(antennas);
        if ("" == antennas) {
            return res.status(404).render("homepage", {
                title: "Accueil",
                antennas: "",
                message: "Aucun centre enregistré."
            });
        }
        res.status(200).render("homepage", {
            title: "Accueil",
            antennas:  antennas,
            message: ""
        });
    } catch(error) {
        res.status(500).render("homepage", {
            title: "Accueil",
            antennas: "",
            message: error
        });
    }
};