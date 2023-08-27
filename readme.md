# Projet chef d'oeuvre pour passage du titre Concepteur Développeur d'application

- Sujet : Créer un annuaire des élèves de Simplon
- date : de février à septembre 2023
- Référentiels  Concepteur⋅rice développeur⋅se d'applications

## table des matières

- [Projet chef d'oeuvre pour passage du titre Concepteur Développeur d'application](#projet-chef-doeuvre-pour-passage-du-titre-concepteur-développeur-dapplication)
  - [table des matières](#table-des-matières)
  - [Sujet du projet](#sujet-du-projet)
  - [Choix techniques](#choix-techniques)
  - [Installation du projet](#installation-du-projet)

## Sujet du projet

## Choix techniques

l'application web utilise les technologies suivantes :

- langage de programmation : NodeJs v18.12.1
- Frameworks : Express v4.18.2
- Base de données NoSql : MongoDB
- ORM : Mongoose v7.0.3 pour l'ORM
- moteur de template pour les vues : EJS v3.1.9
- CSS : Bootstrap v5.2.3
- versioning : git en lien avec gitHub, [repo publique](https://github.com/vdiez-devweb/CDA-annuaire.git)
- l'authentification avec token JWT et cookie

## Installation du projet

- télécharger et installer npm si besoin pour nodeJs
- cloner le projet en local dans le dossier de votre choix `[git clone https://gitlab.com/cda-simplon/brief1-node.git](https://github.com/vdiez-devweb/CDA-annuaire.git)`
- Créer votre BDD sur MongoDB :
  - Créer un compte mongoDB si besoin
  - créer un base de données à connecter à l'application
  - créer un utilisateur ayant accès à cette BDD
  - récupérer le lien de connection commençant par `mongodb+srv://USERNAME:PASS@...`
  - créer un compte sur MongoDB Compass, créer une nouvelle connexion au cluster MongoDB créé auparavant
- créer un fichier .env à la racine de votre projet, compléter les variables d'environnement suivantes avec les valeurs vous concernant :
  
```text
BASE_URL = http://localhost:8082

### DataBase ####
MONGODB_URI = 

### COOKIES session ###
SESSION_SECRET = 
SESSION_NAME =

### COOKIE Auth ###
TOKEN_JWT_SECRET = 
COOKIE_AUTH_NAME =
```

- taper la commande `npm install`
- configurer le serveur dev `npm i nodemon --save-dev`
- lancer le serveur dev `npm run dev`
- accéder via un navigateur à l'url `localhost:8082`
- Créer le premier utilisateur standard via le bouton sinup
  - modifier directement en BDD le role vers 'admin' pour avoir votre premier utilisateur Admin de l'appli

<!-- TODO vérifier que la procédure est complète -->
