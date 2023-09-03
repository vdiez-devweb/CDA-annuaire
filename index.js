import express from "express";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
import bodyParser from  "body-parser"; // pour travailler avec Json (on pourrait utiliser express.json())
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import mongoStore from "connect-mongo";

import connectDB from "./config/connectDB.js";
//import des routes
import userRoutes from "./routes/userRoutes.js";
import homepageRouter from "./routes/homepageRoutes.js";
import antennaRouter from "./routes/antennaRoutes.js";
import sessionRouter from "./routes/sessionRoutes.js";
import legacyRouter from "./routes/legacyRoutes.js";
//TODO sécuriser les routes API avant de les rendre accessibles
// import apiAntennaRouter from "./routes/api/antennaRoutes.js";
// import apiSessionRouter from "./routes/api/sessionRoutes.js";

// import createPopper from '@popperjs/core';

// configurer option dotenv pour les variables environnement
dotenv.config();
//on veut connecter la bdd (middleware créé dans le dossier config/connectDB.js pour Mongoose)
connectDB();

//pour résoudre  __dirname pour les assets
const __dirname = path.resolve();

// Créer App express
const app = express();

//utilisation des cookies pour les jetons JWT
app.use(cookieParser()) ;

//utilisation de session avec cookie pour stocker le passage des flash messages
// app.use(session({
//   name: process.env.SESSION_NAME,
//   secret: process.env.SESSION_SECRET,
//   cookie: { 
//     maxAge: 180000, //en millisecondes 60000 = 1 minute
//     secure: false 
//   },
//   resave: false,
//   saveUninitialized: false, //évite que le serveur génère un nouvel identifiant de session à chaque fois que l’utilisateur enverra une requête.
// }));

//utilisation de session avec connection MongoDB pour stocker le passage des flash messages
app.use(session({
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false, //don't save session if unmodified
  store: mongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    autoRemove: 'native', // Default,
    ttl: 24 * 60 * 60, //Time to live in seconds //TODO modifier la durée ? ici 1 jour 
    // crypto: {
    //   secret: process.env.SESSION_SECRET
    // },
    collectionName: 'annuaire_appsessions',
  })
}));

app.use(flash());

// middleware pour que 'user' et le tableau des régions soient disponibles pour tous les templates
app.use(function(req, res, next) {
  res.locals.userInfos = req.session.userInfos,
  //res.locals.flashes = req.flash();
  res.locals.typeSession = [
    'Titre Professionnel inscrit au RNCP',
    'Certificats de qualification professionnelle (CQP)',
    'Validation des Acquis de l\'Expérience (VAE)',
    'Bootcamp',
    'Autre'
  ],
  res.locals.tabRegions = {
      11: "Île-de-France",
      24: "Centre-Val de Loire",
      27: "Bourgogne-Franche-Comté",
      28: "Normandie",
      32: "Hauts-de-France",
      44: "Grand Est",
      52: "Pays de la Loire",
      53: "Bretagne",
      75: "Nouvelle-Aquitaine",
      76: "Occitanie",
      84: "Auvergne-Rhône-Alpes",
      93: "Provence-Alpes-Côte d'Azur",
      94: "Corse",
  }
  next();
});

// app.locals.baseURL = process.env.BASE_URL;

//on veut envoyer les requêtes en json (on peut aussi utiliser app.use(express.json()); )
// pour toutes les requêtes qui ont 'application/json' comme Content-Type, le body est mis à disposition directement sur l'objet req (req.body)
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// on indique quel moteur de template on utilise
app.set("view engine", "ejs");
// on indique dans quel dossier on trouve les vues
app.set("views", "views"); 

// on indique dans quel dossier on trouve les fichiers statics (img css etc.) => dossier public
app.use(express.static(path.join(__dirname, "/public")));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap')); //redirect bootstrap

//ou utiliser un fichier route
// app.use('/api/auth', userRoutes);
app.use(userRoutes);
app.use(homepageRouter); // remplacer par app.get si on n'a que des méthodes GET dans le routeur
app.use(antennaRouter); // remplacer par app.get si on n'a que des méthodes GET dans le routeur
app.use(sessionRouter); // remplacer par app.get si on n'a que des méthodes GET dans le routeur
app.use(legacyRouter); // remplacer par app.get si on n'a que des méthodes GET dans le routeur
//TODO sécuriser les routes API avant de les rendre accessibles
// app.use(apiAntennaRouter);
// app.use(apiSessionRouter);
//app.use(createPopper);

app.listen(process.env.PORT || 8082, () => {
    console.log("Server is listening at port 8082");
})
