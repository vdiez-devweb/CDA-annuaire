import express from "express";
import session from "express-session";
// pour travailler avec Json
import bodyParser from  "body-parser"; 
// module interne de node.Js, pas besoin de la télécharger
import path from "path";
import connectDB from "./config/connectDB.js";
import dotenv from "dotenv";
import flash from "connect-flash";
import homepageRouter from "./routes/homepageRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import productRouter from "./routes/productRoutes.js";
import legacyRouter from "./routes/legacyRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

// configurer option dotenv
dotenv.config();
//on veut connecter la bdd
connectDB();

//pour résoudre  __dirname pour les assets
const __dirname = path.resolve();

// Créer App express
const app = express();

app.use(session({
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 60000, secure: false },
        resave: false,
        saveUninitialized: false, //évite que le serveur génère un nouvel identifiant de session à chaque fois que l’utilisateur enverra une requête.
}));
app.use(flash());

// middleware to make 'user' available to all templates
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    // console.log(req.session.user);
    next();
  });

// app.locals.baseURL = process.env.BASE_URL;
app.locals.baseURL = "http://localhost:8082";

//on veut envoyer les requêtes en json
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
app.use(homepageRouter);
app.use(categoryRouter);
app.use(productRouter);
app.use(legacyRouter);
app.use(adminRouter);

app.listen(8082, () => {
    console.log("Server is listening at port 8082");
})
