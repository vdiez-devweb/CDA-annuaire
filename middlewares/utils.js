/**
 * 
 * middleware to formate dates for different displays :
 *  -> the forms display (YYYY-mm-dd)
 *  -> the tabs short display (dd-mm-yy)
 *  -> the expands display in views (d mmm YYYY)
 *   //session.sessionStartDate.toLocaleDateString("fr"); // renvoie la date sous forme Tue Jun 20 2023 10:38:37 GMT+0200 (heure d’été d’Europe centrale)
**/
export const formateDate = (req, res, next) => {
    let innerDate = req.params[0];
    let typeDisplay = req.params[1];
    switch (typeDisplay) {
        case form:
            res = innerDate.getFullYear() + "-" + (innerDate.getMonth() < 9 ? "0" + (innerDate.getMonth() + 1) : (innerDate.getMonth() + 1) ) + "-" + innerDate.getDate();
            break;

        case tab:
            res =  innerDate.getDate() + "-" + innerDate.getMonth() + "-" + innerDate.getFullYear();

            break;
        case view:
            res =  innerDate.getDate() + " " + innerDate.toLocaleString('default', { month: 'short' }) + " " + innerDate.getFullYear();
        
            break;
        default:
            break;
    }
    return res;
};
