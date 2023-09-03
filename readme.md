# Projet chef d'oeuvre pour passage du titre Professionnel Concepteur Développeur d'Application

- Sujet : Créer un annuaire des élèves de Simplon
- date : de février à septembre 2023
- Référentiels : Concepteur⋅rice développeur⋅se d'applications

## table des matières

- [Projet chef d'oeuvre pour passage du titre Professionnel Concepteur Développeur d'Application](#projet-chef-doeuvre-pour-passage-du-titre-professionnel-concepteur-développeur-dapplication)
  - [table des matières](#table-des-matières)
  - [Sujet du projet : *Créer un annuaire des élèves de Simplon*](#sujet-du-projet--créer-un-annuaire-des-élèves-de-simplon)
  - [Choix techniques](#choix-techniques)
  - [Étapes d'implémentation](#étapes-dimplémentation)
    - [réalisé `v1.0.0`](#réalisé-v100)
    - [réalisé `v1.0.1`](#réalisé-v101)
    - [à venir `unrelease`](#à-venir-unrelease)
  - [Installation du projet](#installation-du-projet)

## Sujet du projet : *Créer un annuaire des élèves de Simplon*

- Créer une application web permettant de recenser les centres de formation Simplon, les promotions ayant lieu dans chacun d'eux et permettre d'enregistrer les étudiants dans chaque session.
- En tant qu'utilisateur on pourra consulter les centres de formation et les promos, puis visualiser les étudiants ayant suivi les sessions.
- On pourra également faire des recherches sur les trois éléments.

## Choix techniques

l'application utilise les technologies suivantes :

- Langage de programmation : *NodeJs* v18.12.1
- Frameworks : *Express* v4.18.2
- Base de données NoSql : *MongoDB Atlas*, *MongoDB Compass*
- ORM : *Mongoose* v7.0.3 
- Moteur de template pour les vues : *EJS* v3.1.9
- CSS : *Bootstrap* v5.2.3
- Versioning : *git* en lien avec gitHub, [repo publique](https://github.com/vdiez-devweb/CDA-annuaire.git)
- Authentification avec *token JWT* et cookie

## Étapes d'implémentation

### réalisé `v1.0.0`

1. Créer les éléments dans le modèle de l'application (dans un premier temps les centres et les promos)
2. Créer les routes pour les accès aux différents modules de l'application (afficher, ajouter, modifier et supprimer)
   1. Créer une partie API pour gérer les éléments sans interface
      1. Mettre en place la structure de l'application, tester les modules et les routes, puis inactiver les routes vers l'API qui ne sera pas utilisée
   2. Créer les controllers et les vues pour l'accès en consultation des éléments via une interface web.
   3. Créer le modèle d'utilisateur pour gérer l’authentification à l'application web (token JWT et cookie de session)
   4. Créer la partie gestion administrateur sur l'interface web, pour pouvoir en plus créer, modifier et supprimer les éléments.
   5. Gérer la validation des données issues des formulaires et routes paramétriques par la partie backend, via les controllers
   6. Gérer la validation des données issues des formulaires directement dans le front avant envoi du formulaire, avec des scripts JavaScript

### réalisé `v1.0.1`

1. gérer l’authentification à l'application web (token JWT et session stocké dans mongoDB) pour ne pas utiliser MemoryStore en production
2. améliorer les messages flash quand la base est vide,
3. amélioré les pages legacy, homepage, dashboard admin
4. ajouté un meta noindex, nofollow au <head> de la page pour ne pas indexer le site
5. changé les noms des collections dans les schemas pour les préfixer avec `annuaire_` (cluster MongoDB Atlas partagé avec d'autres applications pour la formation)

### à venir `unrelease`

1. Ajouter l'authentification sur les routes de l'API et ré activer les routes
2. Ajouter dans l'application les étudiants liés aux promotions
3. Ajouter une fonctionnalité de recherche sur les différents éléments de l'application
4. Ajouter dans l'application des domaines de formations pour fournir un élément supplémentaire qualification des formation, et enrichir la recherche

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
- Créer le premier utilisateur standard via le bouton signup
  - modifier directement en BDD le role vers 'admin' pour avoir votre premier utilisateur Admin de l'appli

<!-- //TODO vérifier que la procédure est complète -->
