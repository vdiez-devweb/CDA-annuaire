import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const { Schema } = mongoose;

const sessionSchema = new Schema({
    sessionName: {
        type: String,
        required: [true,'Vous devez saisir un nom de session'],
        minLength:[5,'Le nom de session doit contenir au moins 5 caractères'],
        maxLength:[100,'Le nom de session doit contenir au maximum 100 caractères'],
        // unique: true
        unique: 'Ce session existe déjà, veuillez saisir un autre nom'
    },    
    sessionNumIdentifier: {
        type: String,
        required: [true,'Vous devez saisir un numéro identifiant Ypareo'], // TODO vérifier le nom de l'identifiant + les contraintes regex etc.
        minLength:[5,'L\'identifiant Ypareo de session doit contenir au moins 5 caractères'],
        maxLength:[100,'L\'identifiant Ypareo de session doit contenir au maximum 100 caractères'],
        // unique: true
        unique: 'Ce session existe déjà, veuillez saisir un autre nom'
    },    
    sessionType: {
        type:String,
        maxLength:[250,'Le type de la session doit contenir au maximum 250 caractères'], //TODO enum ?
        required: [true,'Vous devez choisir un type de formation'],
        default:'Autre'
    },
    sessionDescription: {
        type:String,
        maxLength:[250,'La description de la session doit contenir au maximum 250 caractères'],
        default:null
    },
    sessionStartDate: {
        type:Date,
        required: [true,'Vous devez définir une date de début pour cette session'],
        default: Date.now        //TODO validation
    },
    sessionEndDate: {
        type:Date,
        required: [true,'Vous devez définir une date de fin pour cette session'],
        default: () => new Date(+new Date() + 90*24*60*60*1000), // défaut 90 jours après le jour de début //TODO validation + voir cohérence avec startDate
    },
    sessionAlternation: {
        type:Boolean,
        required: [true,'Vous devez définir si alternance ou pas'],
        default:false //TODO non alternance par défaut ? 
    },   
    sessionInternship: {
        type:Boolean,
        required: [true,'Vous devez définir si stage ou pas'],
        default:false //TODO non stage par défaut ? 
    },  
    sessionStatus: {
        type:Boolean,
        required: [true,'Vous devez définir le status actif ou non pour cette session'],
        default:false //TODO Inactif par défaut ? à la création puis on doit l'activer après ?
    },
    sessionNbStudents: {    // anciennement sessionPrice
        type:Number,
        default:0,
        required: [true,'Vous devez saisir un nombre d\'étudiants'], // TODO faire la mise à jour à l'ajout / suppression d'étudiants + refresh de la session
        // validate: {
        //     validator: function(number) {
        //       return (typeof number === 'Number');
        //     },
        //     message: props => `doit être un nombre! vous avez saisi ${props.value}`
        //   }
    },
    sessionAntenna: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Antenna'
    },
}, {
    timestamps: { 
        createdAt: 'createdAt' 
    }
});

sessionSchema.plugin(uniqueValidator);

//fonction mongoose.model(nom de la "table", schéma qui définie la collection)
const session = mongoose.model("session", sessionSchema, 'annuaire_sessions');

export default session;