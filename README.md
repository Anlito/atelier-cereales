# Distributeur de céréales

Carnet de projet, programmation et suivi des équipes de 5e.

Le moteur, Blockly, le simulateur, les programmes des cartes et le parcours sont chargés directement depuis **Labo Blocs en ligne** :

- module partagé : `https://anlito.github.io/labo-blocs/module/`
- parcours publié : `https://anlito.github.io/labo-blocs/parcours/distributeur/parcours.js`

Le projet ne contient aucune copie de Labo Blocs ni du parcours. Une connexion Internet est nécessaire, y compris avec le ZIP local. Après publication dans Labo Blocs, recharger les pages du projet.

Les sauvegardes des équipes restent des fichiers JSON locaux. Le carnet, les photos et les évaluations du professeur restent propres au distributeur.

`npm test` télécharge les deux dépendances publiques nécessaires dans `.cache/`, puis lance les tests. Ce cache de développement est ignoré par Git et exclu du site et de l’archive.

`npm run archive` génère le ZIP léger du site. `npm start` lance le serveur local. La publication GitHub Pages lance les tests avant de publier `site/`.

Voir `LISEZ-MOI.md` pour l’utilisation.
