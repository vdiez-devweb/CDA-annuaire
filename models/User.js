import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator"; // pour permettre d'utiliser validatorError sur l'unicité de champ

const { Schema } = mongoose; // on importe l'objet Schema de mongoose

//on créé l'objet instance de Schema
const userSchema = new Schema({    //on ne spécifie pas l'Id, mongoose le fait pour nous
    userEmail: {
        type:String,
        required: [true,'Vous devez saisir un email'], // TODO faire la vérif avec une regex
        unique: [true,'Cet email existe déjà, veuillez saisir un autre email'],
        trim: true,
        lowercase: true,
        unique: true,
        default:'NC'
    },
    userPassword: {
        type: String,
        maxLength:[250,'La description du centre doit contenir au maximum 250 caractères'],
        default:null
    },
    userRole: {
        type: String,
        maxLength:[250,'Le rôle doit contenir au maximum 250 caractères'],
        default:'student'
    },
    userName: {
        type: String,
        required: [true,'Vous devez saisir un nom du centre'],
        minLength:[5,'Le nom du centre doit contenir au moins 5 caractères'],
        maxLength:[100,'Le nom du centre doit contenir au maximum 100 caractères'],
    },
    userPhone: {
        type:Number,
        required: [true,'Vous devez saisir un nombre d\'étudiants'], // TODO faire la vérif avec une regex
        default:0
    },
    userStatus: {
        type:Boolean,
        required: [true,'Vous devez définir le status actif ou non pour ce centre'],
        default:false //TODO Inactif par défaut ? à la création puis on doit l'activer quand on a saisi des sessions
    },
    userAddress: {
        type:String,
        // required: [true,'Vous devez saisir un n° et nom de voie'], 
        default:'NC'
    },   
    userZipCode: {
        type:String,
        min:[5, 'Le code format doit avoir 5 chiffres'],
        max:[5, 'Le code format doit avoir 5 chiffres'],
        required: [true,'Vous devez saisir un code postal'], //TODO modifier la contrainte par une longueur ?
    },  
    userCity: {
        type:String,
        // required: [true,'Vous devez saisir une ville'], //TODO ajouter l'utilisation d'une  API pour lier le CP et la ville ?
        default:'NC'
    }        
}, 
{ 
    timestamps: { createdAt: 'createdAt' } 
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema); //fonction mongoose.model(nom de la "table", schéma qui définie la collection)

export default User;