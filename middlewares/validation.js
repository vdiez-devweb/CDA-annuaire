/**
 * 
 * middleware to validate values from forms datas before send them to DB
 * 
**/
const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^\d{10}$|^NC$/;
const zipCodeRegex = /^\d{5}$/;
const slugRegex = /^[a-z0-9]{3,32}$/;
const pwdRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;


/**
 * Middleware to formate dates for different displays :
 * (session.sessionStartDate.toLocaleDateString("fr"); // renvoie la date sous forme Tue Jun 20 2023 10:38:37 GMT+0200 (heure d’été d’Europe centrale))
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
        case 'complete':
            return  innerDate.getDate() + " " + innerDate.toLocaleString('default', { month: 'short' }) + " " + innerDate.getFullYear() + " à " + innerDate.getHours() + "h" + innerDate.getMinutes(); //+ "m" + innerDate.getSeconds()
        
            break;
        default:
            return  innerDate.getDate() + " " + innerDate.toLocaleString('default', { month: 'short' }) + " " + innerDate.getFullYear();

            break;
    }
};


/**
 * 
 * Validate and formate the received datas from antenna forms 
 * 
**/
export const validateValue = (key, value, tabValues = []) => {

    let label = '';

    switch (key) {
        case 'sessionName':
        case 'antennaName':
            label = 'Le nom';
            // Test si vide
            if (null == value){ 
                throw new Error(label + ' ne peut pas être vide !');
            }
            // test le type
            if ('string' != typeof value){ 
                throw new Error(label + ' doit être une chaîne de caractères !');
            }
            value = value.trim();
            // test la longueur ou regex
            if (value.length < 5 || value.length > 100){ 
                throw new Error(label + ' doit contenir entre 5 et 100 caractères !');
            }
            // gestion du format
            // value = value.toUpperCase(); 

            break;
        case 'antennaSlug':
            label = 'Le slug';
            // Test si vide
            if (null == value) { 
                throw new Error(label + ' ne peut pas être vide !');
            }
            // test le type
            if ('string' != typeof value) { 
                throw new Error(label + ' doit être une chaîne de caractères !');
            }
            // gestion du format
            value = value.trim();
            value = value.toLowerCase(); 
            // test la longueur ou regex
            if (!slugRegex.test(value)) { 
                throw new Error(label + ' n\'est pas au format valide ! (entre 3 et 32 chiffres ou lettres en minuscules');
            }

            break;
        case 'sessionDescription':
        case 'antennaDescription':
            label = 'La description';
            // Test si vide
            if (null != value){ 
                // test le type
                if ('string' != typeof value){ 
                    throw new Error(label + ' doit être une chaîne de caractères !');
                }
                value = value.trim();
                // test la longueur ou regex
                if ( value.length > 255){ 
                    throw new Error(label + ' doit contenir moins de 255 caractères !');
                }
            }

            break;
        case 'antennaStatus':
        case 'sessionAlternation':
        case 'sessionInternship':
        case 'sessionStatus':
        case 'antennaImg':
            value = value ? true : false;

            break;
        case 'antennaAddress':
            label = 'L\' adresse';
            // Test si vide
            if (null != value){ 
                // test le type
                if ('string' != typeof value) { 
                    throw new Error(label + ' doit être une chaîne de caractères !');
                }
                value = value.trim();
                // test la longueur ou regex
                if (value.length < 5 || value.length > 128) { 
                    throw new Error(label + ' doit contenir entre 5 et 128 caractères !');
                }
            }

            break;
        case 'userZipCode':
        case 'antennaZipCode':
            label = 'Le code postal';
            // Test si vide
            if (null == value){ 
                throw new Error(label + ' ne peut pas être vide !');
            }
            value = value.trim();
            // test la longueur ou regex
            if (!zipCodeRegex.test(value)){ 
                throw new Error(label + ' doit contenir 5 chiffres !');
            }

            break;
        case 'antennaCity':
            label = 'La ville';
            // Test si vide
            if (null != value){ 
                // test le type
                if ('string' != typeof value){ 
                    throw new Error(label + ' doit être une chaîne de caractères !');
                }
                value = value.trim();
                // test la longueur ou regex
                if (value.length < 5 || value.length > 100){ 
                    throw new Error(label + ' doit contenir  entre 5 et 100 caractères !');
                }
            }
            // gestion du format
            value = value.toUpperCase(); 

            break;    
        case 'antennaRegion':
            label = 'La région';
            if (tabRegions[value] === undefined) { //! tester si cette expression est valide //tester si dans les clés de res.locals.tabRegions
                throw new Error(label + ' doit être choisie !');
            }

            break; 
        case 'antennaPhone':
        case 'userPhone':
                    label = 'Le numéro de téléphone';
            // Test si vide
            if (null == value || "" == value){ 
                value = 'NC';
            } else {
                value = value.trim();
                // test la longueur ou regex
                if (!phoneRegex.test(value)) { 
                    throw new Error(label + ' doit contenir 10 chiffres !');
                }
            }
            
            break;
        case 'userEmail':
        case 'antennaEmail':
            label = 'L\'email';
            // Test si vide
            if (null == value){ 
                throw new Error(label + ' ne peut pas être vide !');
            }
            // test le type
            if ('string' != typeof value){ 
                throw new Error(label + ' doit être une chaîne de caractères !');
            }
            // gestion du format
            value = value.trim();
            value = value.toLowerCase(); 
            // test la longueur ou regex
            if (!emailRegex.test(value)){ 
                throw new Error(label + ' n\'est pas au format valide !');
            }

            break;

        case 'sessionAntennaId':
            label = 'Le centre de formation';
                if (value == 0) { 
                    throw new Error(label + ' doit être choisi !');
                }
    
            break; 
        case 'sessionNumIdentifier':
                label = 'Le numéro identifiant Ypareo';
                // Test si vide
                if (null == value){ 
                    throw new Error(label + ' ne peut pas être vide !');
                }
                // test le type
                if ('string' != typeof value){ 
                    throw new Error(label + ' doit être une chaîne de caractères !');
                }
                value = value.trim();
                // test la longueur ou regex
                if (value.length < 5 || value.length > 100){ 
                    throw new Error(label + ' doit contenir entre 5 et 100 caractères !');
                }
                // gestion du format
                // value = value.toUpperCase(); 
    
                break;
        case 'sessionType':
            label = 'Le type de formation';
                if (value == 0) { 
                    throw new Error(label + ' doit être choisi !');
                }
    
            break; 
        case 'sessionStartDate':
        case 'sessionEndDate':
            if (value == 'sessionStartDate') { 
                label = 'La date de début'; 
            } else if (value == 'sessionEndDate') { 
                label = 'La date de fin'; 
            }
            if (value != '') { //! quel format attendu si saisi ?
                //throw new Error(label + ' n\'est pas au bon format !');
            }
    
            break; 
    
        
                    

        case 'userPassword':
            label = 'Le mot de passe';
            // Test si vide
            if (null == value){ 
                throw new Error(label + ' ne peut pas être vide !');
            }
            // test le type
            if ('string' != typeof value){ 
                throw new Error(label + ' doit être une chaîne de caractères !');
            }
            // test la longueur ou regex
            if (!pwdRegex.test(value)){ 
                throw new Error(label + ' n\'est pas au format valide !');
            }

            break;
        case 'userLastName':
            label = 'Le nom';
            // Test si vide
            if (null == value){ 
                throw new Error(label + ' ne peut pas être vide !');
            }
            // test le type
            if ('string' != typeof value){ 
                throw new Error(label + ' doit être une chaîne de caractères !');
            }
            // test la longueur ou regex
            if (value.length < 2 || value.length > 100){ 
                throw new Error(label + ' doit contenir entre 2 et 100 caractères !');
            }
            // gestion du format
            value = value.toUpperCase(); 

            break;
        case 'userFirstName':
            label = 'Le prénom';
            // Test si vide
            if (null == value){ 
                throw new Error(label + ' ne peut pas être vide !');
            }
            // test le type
            if ('string' != typeof value){ 
                throw new Error(label + ' doit être une chaîne de caractères !');
            }
            // test la longueur ou regex
            if (value.length < 2 || value.length > 100){ 
                throw new Error(label + ' doit contenir entre 2 et 100 caractères !');
            }
            // gestion du format //TODO forcer une majuscule au début de chaque mot séparé par un espace ou un tiret : https://flexiple.com/javascript/javascript-capitalize-first-letter/
            break;


        default:
            break;
    }
    
    return value;

};