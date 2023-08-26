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
        maxLength:[32,'Le slug doit contenir au maximum 16 caractères'],
        validate: {         // ajouter un pattern (on ne veut pas d'espace ou caractères spéciaux sur le slug)
            validator: function(PatternConstraint) {
                var regex = /^[a-z0-9]{3,32}$/;
                return (!PatternConstraint || !PatternConstraint.trim().length) || regex.test(PatternConstraint)
            }, message: 'Le slug ne doit contenir que des lettres entre a et z et des chiffre de 0 à 9'
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
    antennaNbStudents: {
        type:Number,
        required: [true,'Vous devez saisir un nombre d\'étudiants'], // TODO faire la mise à jour à l'ajout / suppression d'étudiants
        default:0
    },
    antennaRegion: {
        type:Number,
        required: [true,'Vous devez saisir le code d\'une région'], //TODO ajouter une contrainte enum ? ou utiliser une correlation code / nom région, via le choix d'un CP
        default:'NC'
    },
    antennaPhone: {
        type:Number, //TODO passer le type à string pour limiter contraindre min et max et accepter les +
        required: [true,'Vous devez saisir un numéro de téléphone'], // TODO faire la vérif avec une regex
        default:0
    },
    antennaEmail: {
        type:String,
        required: [true,'Vous devez saisir un email'], // TODO faire la vérif avec une regex
        trim: true,
        lowercase: true,
        unique: true,
        default:'NC'
    },
    antennaStatus: {
        type:Boolean,
        required: [true,'Vous devez définir le status actif ou non pour ce centre'],
        default:false //TODO Inactif par défaut ? à la création puis on doit l'activer quand on a saisi des sessions
    },
    antennaAddress: {
        type:String,
        // required: [true,'Vous devez saisir un n° et nom de voie'], 
        maxLength:[128,'L\'adresse du centre doit contenir moins de 128 caractères'],
        default:'NC'
    },   
    antennaZipCode: {
        type:String,
        min:[5, 'Le code format doit avoir 5 chiffres'],
        max:[5, 'Le code format doit avoir 5 chiffres'],
        required: [true,'Vous devez saisir un code postal'], //TODO modifier la contrainte par une longueur ?
    },  
    antennaCity: {
        type:String,
        // required: [true,'Vous devez saisir une ville'], //TODO ajouter l'utilisation d'une  API pour lier le CP et la ville ?
        maxLength:[100,'L\'adresse du centre doit contenir moins de 100 caractères'],
        default:'NC'
    }        
}, 
{ 
    timestamps: { createdAt: 'createdAt' } 
});

antennaSchema.plugin(uniqueValidator);

const Antenna = mongoose.model("Antenna", antennaSchema); //fonction mongoose.model(nom de la "table", schéma qui définie la collection)

export default Antenna;