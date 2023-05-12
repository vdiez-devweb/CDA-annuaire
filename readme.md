# ECF pour préparation du titre Concepteur Développeur d'application

- Sujet de l'évaluation : Créer une application web type site catalogue pour un salon de beauté, avec 4 catégories de produits
- date : d'avril à mai 2023
- Référentiels  Concepteur⋅rice développeur⋅se d'applications

## table des matières

- [ECF pour préparation du titre Concepteur Développeur d'application](#ecf-pour-préparation-du-titre-concepteur-développeur-dapplication)
  - [table des matières](#table-des-matières)
  - [Sujet du projet](#sujet-du-projet)
    - [Etape 1](#etape-1)
    - [Etape 2 facultative](#etape-2-facultative)
  - [Choix techniques](#choix-techniques)
  - [Tâches restant à accomplir](#tâches-restant-à-accomplir)
  - [Installation du projet](#installation-du-projet)

## Sujet du projet

Votre nouvelle vie en tant que développeur(se) web freelance a débuté. Votre cousine esthéticienne qui a son institut de beauté Bio et est spécialisée dans la vente de produits cosmétiques bio et naturels de petits artisans (français). Elle vous sollicite pour lui développer son site catalogue, plus tard elle souhaite le transformer en site e-commerce elle vous fait entièrement confiance car elle n'y connaît rien.

### Etape 1

Dans un premier temps, elle souhaite que le visiteur du site puisse avoir accès à tous les produits et de pouvoir voir un produit en détail. Si le visiteur souhaite acheter le produit, il doit se rendre à l'institut directement à l'adresse 9 rue du centre 75000 paris. Le visiteur peut également contacté l'institut au 01 02 03 04 05.

Elle souhaite que chaque produit ait :

- un nom,
- une catégorie,
- un tarif et
- une description.

Elle vend principalement les produits des 4 catégories suivantes :

- soins du corps,
- soins du visage,
- maquillage et
- beauté des mains

### Etape 2 facultative

Par la suite, elle souhaite le transformer en site e-commerce et rajouter les fonctionnalités suivantes :

- Rajouter des sous-catégories
- Ajouter des marques
- Référencer tous ses fournisseurs avec leur nom, leur présentation, leur marque et la liste de leurs produits
- La possibilité pour les visiteurs de créer leur compte avec leur nom, prénom, adresse mail, mot de passe, numéro de téléphone, adresse, ville, code postal
- Le visiteur pourra donc se connecter avec son email et son mot de passe, elle souhaite le maximum de sécurité avec les données de ses clients
- Mettre en place un lien de payment (Paypal ou carte bleue) elle n' a pas de préférence
- Mettre en place un listing email

## Choix techniques

l'application web utilise les technologies suivantes :

- langage de programmation : NodeJs v18.12.1
- Frameworks : Express v4.18.2
- Base de données NoSql : MongoDB
- ORM : Mongoose v7.0.3 pour l'ORM
- moteur de template pour les vues : EJS v3.1.9
- CSS : Bootstrap v5.2.3
- l'authentification dans l'application est simplement gérée par les sessions, avec 1 seul utilisateur administrateur dont les identifiants sont stockés dans les variables globales d'environnement dans le fichier `.env`
- versioning : git en lien avec gitHub (il existe une autre version du repo sur GitLab pour intégrer l'aspect DevOps CI/CD, ce repo GitLab n'est pas maintenu pour le moment)
- ~~CI/CD, conteneurs : Docker et GitLab pour le pipeline~~

## Tâches restant à accomplir

- Update PRODUITS et CATEGORIES dans le Dashboard admin
- Vérification des champs dans le front (validation) et le back (unicité, doublons, champs requis etc. ) 

## Installation du projet

- télécharger et installer npm si besoin pour nodeJs
- cloner le projet en local dans le dossier de votre choix `git clone https://gitlab.com/cda-simplon/Brief2-devops.git`
- Créer votre BDD sur MongoDB :
  - Créer un compte mongoDB si besoin
  - créer un base de données à connecter à l'application
  - créer un utilisateur ayant accès à cette BDD
  - récupérer le lien de connection commençant par `mongodb+srv://USERNAME:PASS@...`
- créer un fichier .env à la racine de votre projet, contenant les valeurs vous concernant dans les variables d'environnement suivantes :
  
```text
BASE_URL = http://localhost:8082
MONGODB_URI = 
SESSION_SECRET = 
SESSION_NAME =
ADMIN_USERNAME =
ADMIN_PASSWORD = (le mot de passe de l'administrateur non crypté)
```

- taper la commande `npm install`
- configurer le serveur dev `npm i nodemon --save-dev`
- lancer le serveur dev `npm run dev`
- accéder via un navigateur à l'url `localhost:8082`

<!-- TODO vérifier que la procédure est complète -->
