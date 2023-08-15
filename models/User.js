import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator"; // pour permettre d'utiliser validatorError sur l'unicité de champ

const { Schema } = mongoose; // on importe l'objet Schema de mongoose

//on créé l'objet instance de Schema
const userSchema = new Schema({    //on ne spécifie pas l'Id, mongoose le fait pour nous
    userEmail: {
        type:String,
        required: [true,'Vous devez saisir un email'], 
        unique: [true,'Cet email existe déjà, veuillez saisir un autre email'],
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(v) {
              return /^\S+@\S+\.\S+$/.test(v);
            },
            message: `L'email n'a pas un format valide, 1 minuscule, un chiffre et un caractère spécial.`
          },
        default:'NC'
    },
    userPassword: {
        type: String,
        required: [true,'Vous devez saisir un mot de passe'],
        // minLength:[6,'Le mot de passe doit contenir au moins 6 caractères'],
        // maxLength:[32,'Le mot de passe doit contenir au maximum 32 caractères'],
        validate: {
            validator: function(v) {
              return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(v);
            },
            message: `Le mot de passe doit contenir au moins 8 caractères dont au moins 1 majuscule, 1 minuscule, un chiffre et un caractère spécial.`
          },
        },
    userRole: {
        type: String,
        maxLength:[64,'Le rôle doit contenir au maximum 64 caractères'],
        default:'student'
    },
    userFirstName: {
        type: String,
        required: [true,'Vous devez saisir un prénom'],
        minLength:[2,'Le prénom doit contenir au moins 2 caractères'],
        maxLength:[100,'Le prénom doit contenir au maximum 100 caractères'],
    },
    userLastName: {
        type: String,
        required: [true,'Vous devez saisir un nom'],
        minLength:[2,'Le nom doit contenir au moins 2 caractères'],
        maxLength:[100,'Le nom doit contenir au maximum 100 caractères'],
    },
    userPhone: {
        type:String,
        // minLength:[10, 'Le numéro de téléphone doit avoir 10 chiffres'],
        // maxLength:[10, 'Le numéro de téléphone doit avoir 10 chiffres'],
        validate: {
            validator: function(v) {
              return /^\d{10}$|^NC$/.test(v);
            },
            // message: props => `${props.value} n'est pas un numéro de téléphone valide !`
            message: `Le numéro de téléphone n'est pas un numéro de téléphone valide !`
          },
        default:'NC'
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
        required: [true,'Vous devez saisir un code postal'], //TODO modifier la contrainte par une longueur ? /[0-9]{5}
        // minLength:[5, 'Le code postal doit avoir 5 chiffres'],
        // maxLength:[5, 'Le code postal doit avoir 5 chiffres'],
        validate: {
            validator: function(v) {
              return /^\d{5}$/.test(v);
            },
            message: `Le code postal n'est pas au format valide !`
          },
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