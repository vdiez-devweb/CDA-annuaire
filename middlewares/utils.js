/**
 * 
 * middleware to formate dates for different displays :
 *  -> the forms display (YYYY-mm-dd)
 *  -> the tabs short display (dd-mm-yy)
 *  -> the expands display in views (d mmm YYYY)
 *   
 * @param {Date}      innerDate 
 * @param {string}        typeDisplay 
 * 
 * @returns {string}
 */

export const formateDate = (innerDate, typeDisplay) => {
    switch (typeDisplay) {
        case 'form':
            return innerDate.getFullYear() + "-" + (innerDate.getMonth() < 9 ? "0" + (innerDate.getMonth() + 1) : (innerDate.getMonth() + 1)) + "-" + (innerDate.getDate() < 10 ? ("0" + innerDate.getDate()) : innerDate.getDate());
            break;

        case 'tab':
            return  (innerDate.getDate() < 10 ? ("0" + innerDate.getDate()) : innerDate.getDate()) + "-" + (innerDate.getMonth() < 9 ? "0" + (innerDate.getMonth() + 1) : (innerDate.getMonth() + 1)) + "-" + (innerDate.getFullYear() >= 2000 ? innerDate.getFullYear()-2000 : innerDate.getFullYear()-1900);

            break;
        case 'view':
            return  innerDate.getDate() + " " + innerDate.toLocaleString('default', { month: 'short' }) + " " + innerDate.getFullYear();
        
            break;
        default:
            return  innerDate.getDate() + " " + innerDate.toLocaleString('default', { month: 'short' }) + " " + innerDate.getFullYear();

            break;
    }
};
