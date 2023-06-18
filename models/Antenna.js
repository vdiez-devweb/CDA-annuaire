import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator"; // pour permettre d'utiliser validatorError sur l'unicité de champ

const { Schema } = mongoose; // on importe l'objet Schema de mongoose

//on créé l'objet instance de Schema
const antennaSchema = new Schema({    //on ne spécifie pas l'Id, mongoose le fait pour nous
    antennaName: {
        type: String,
        required: [true,'Vous devez saisir un nom du centre'],
        unique: [true,'Ce centre existe déjà, veuillez saisir un autre nom'],
        minLength:[5,'Le nom du centre doit contenir au moins 5 caractères'],
        maxLength:[100,'Le nom du centre doit contenir au maximum 100 caractères'],
    },
    antennaSlug: {
        type: String,
        required: [true,'Vous devez saisir un raccourci pour les liens'],
        unique: [true,'Ce slug existe déjà, veuillez saisir un autre slug'],
        lowercase: [true,'Le slug doit être en minuscules'], 
        minLength:[3,'Le slug doit contenir au moins 3 caractères'],
        maxLength:[16,'Le slug doit contenir au maximum 16 caractères'],
        validate: {         // ajouter un pattern (on ne veut pas d'espace ou caractères spéciaux sur le slug)
            validator: function(PatternConstraint) {
                var regex = /[a-z]{3,16}/;
                return (!PatternConstraint|| !PatternConstraint.trim().length) || regex.test(PatternConstraint)
            }, message: 'Le slug ne doit contenir que des lettres entre a et z'
        } 
    },
    antennaDescription: {
        type: String,
        maxLength:[250,'La description du centre doit contenir au maximum 250 caractères'],
        default:null
    },
    antennaImg: { //true if an image exists with slug filename, false if not (then we use a default image)
        type: Boolean,
        required: [true,'Vous devez définir si une image existe ou non pour ce centre'],
        default:false
    },
    antennaNbSessions: {
        type:Number,
        required: [true,'Vous devez saisir un nombre de sessions'],
        default:0
    },
}, 
{ 
    timestamps: { createdAt: 'createdAt' } 
});

antennaSchema.plugin(uniqueValidator);

const Antenna = mongoose.model("Antenna", antennaSchema); //fonction mongoose.model(nom de la "table", schéma qui définie la collection)

export default Antenna;