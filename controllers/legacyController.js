//on déclare la fonction, 2 façons possibles
// exports.getHomePage = (req, res, next) => {
//     res.render("homepage", {
//         title: "Homepage";
//     })
// };

export const getLegacy = (req, res, next) => {
    try{
        res.render("legacy", {
            title: "Mentions légales"
        });
    } catch (err){
        console
    }
};