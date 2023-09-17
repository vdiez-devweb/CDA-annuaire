import express from "express";
import helmet from "helmet";
import path from "path";
import dotenv from "dotenv";
import bodyParser from  "body-parser"; // pour travailler avec Json (on pourrait utiliser express.json())
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoStore from "connect-mongo"; // pour stocker les sessions
import flash from "connect-flash"; // pour utiliser des messages transmis par la session

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

// configurer option dotenv pour les variables environnement
if (process.env.NODE_ENV !== 'production') { // on ne charge un fichier .env SAUF si on se trouve en environnement de production
  dotenv.config();
}

//on veut connecter la bdd (middleware créé dans le dossier config/connectDB.js pour Mongoose)
connectDB();

//pour résoudre  __dirname pour les assets
const __dirname = path.resolve();

// Créer App express
const app = express();

app.disable("x-powered-by");
// Ask Helmet to ignore the X-Powered-By header. avoid to expose information about the used framework to potential attackers
// Set Content Security Policies to allow use of external site (font awsome et google fonts)
const scriptSources = ["'self'", "https://kit.fontawesome.com/be816a8046.js"];
const styleSources = ["'self'", "https://fonts.googleapis.com/", "'unsafe-inline'"];
const connectSources = ["'self'", "https://fonts.googleapis.com", "https://ka-f.fontawesome.com/"];
app.use(
  helmet({
    xPoweredBy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: connectSources,
        scriptSrc: scriptSources,
        scriptSrcElem: scriptSources,
        styleSrc: styleSources,
        styleSrcElem: styleSources,
      },
    },
  })
);

//utilisation des cookies pour les jetons JWT
app.use(cookieParser()) ;

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

// utiliser un fichier route
// remplacer par app.get si on n'a que des méthodes GET dans le routeur
app.use(userRoutes);
app.use(homepageRouter); 
app.use(antennaRouter); 
app.use(sessionRouter);
app.use(legacyRouter);

// Handle 404
app.use(function(req, res) {
  res.status(400);
  res.render('404', {
    title: '404: Page non trouvée' 
  });
});

// Handle 500 error (need to be call by next(error) when error occurred)
app.use(function(error, req, res, next) {
  res.status(500);
  res.render('500', {
    title:'500: Erreur Serveur', 
    error: error
  });
});

//TODO sécuriser les routes API avant de les rendre accessibles
// app.use('/api/auth', userRoutes);
// app.use(apiAntennaRouter);
// app.use(apiSessionRouter);

app.listen(process.env.PORT || 8082, () => {
    console.log("Server is listening at port 8082");
})
