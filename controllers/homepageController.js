import Antenna from "../models/Antenna.js";

//on déclare la fonction, 2 façons possibles
// exports.getHomePage = (req, res, next) => {
//     res.render("homepage", {
//         title: "Homepage";
//     })
// };

export const getHomepage = async (req, res, next) => {
    const antennas = await Antenna.find({});

    res.render("homepage", {
        title: "Accueil",
        antennas: antennas,
        message: ""
    });
};