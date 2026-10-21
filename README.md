# Distributeur de céréales

<!-- suivi-maintenance:debut -->
## État du projet et améliorations documentées — 21 octobre 2026

- Le moteur, Blockly, le simulateur, les programmes des cartes et les exercices sont chargés depuis Labo Blocs en ligne. Le ZIP léger nécessite donc Internet pour la programmation.
- Le carnet inclut croquis et dessin technique, dessin à l’échelle 1:3 et seize critères d’auto-vérification. Le professeur retrouve les critères et les photos dans la partie correspondante.
- Ouvrir notre équipe donne accès au JSON et aux photos du dossier ; les images sont classées par type et relues lorsque la page est visible. Une ouverture du JSON seul peut nécessiter un choix supplémentaire du dossier.
- La définition d’un objet technique est correctement conservée après vérification. Les idées et la définition sont distinctes dans le suivi professeur.
- Chaque partie peut être notée ou exclue, avec coefficient ; les parties manuelles utilisent quatre niveaux. Les évaluations et le barème se sauvegardent séparément des JSON élèves.
- Les consignes du carnet sont dans site/donnees/carnet.js ; le parcours distributeur se modifie dans Labo Blocs. LISEZ-MOI.md décrit l’utilisation et les vérifications au collège.
- Validations antérieures : 140 tests logiciels et vérifications navigateur du chargement central, du carnet, des évaluations et du cas sans réseau. L’essai réel Arduino reste à faire en classe.

### Référence locale et maintenance

Dossier de travail de référence : **Documents/Distributeur céréales programmation**. Dépôt : [Anlito/atelier-cereales](https://github.com/Anlito/atelier-cereales). La branche principale est **main**. Les copies temporaires d’un chat ou les worktrees servent au travail intermédiaire ; elles ne remplacent pas ce dossier.

À chaque intervention :

1. Vérifier les modifications locales et la version publiée avant de commencer ; sauvegarder le travail non enregistré.
2. Décrire dans ce README les améliorations, les vérifications, les limites et les opérations restantes.
3. Publier les changements autorisés, puis synchroniser le dossier local de référence avec le même commit.
4. Contrôler le commit local, le commit distant et les fichiers restants avant d’annoncer que le projet est à jour. Signaler explicitement tout décalage ou travail conservé hors publication.

Cette règle permet de reprendre le projet dans un autre outil local sans perdre les dernières améliorations. Une publication du site ne met pas automatiquement à jour les dossiers du PC.

<!-- suivi-maintenance:fin -->

Carnet de projet, programmation et suivi des équipes de 5e.

Le moteur, Blockly, le simulateur, les programmes des cartes et le parcours sont chargés directement depuis **Labo Blocs en ligne** :

- module partagé : `https://anlito.github.io/labo-blocs/module/`
- parcours publié : `https://anlito.github.io/labo-blocs/parcours/distributeur/parcours.js`

Le projet ne contient aucune copie de Labo Blocs ni du parcours. Une connexion Internet est nécessaire, y compris avec le ZIP local. Après publication dans Labo Blocs, recharger les pages du projet.

Les sauvegardes des équipes restent des fichiers JSON locaux. Le carnet, les photos et les évaluations du professeur restent propres au distributeur.

`npm test` télécharge les deux dépendances publiques nécessaires dans `.cache/`, puis lance les tests. Ce cache de développement est ignoré par Git et exclu du site et de l’archive.

`npm run archive` génère le ZIP léger du site. `npm start` lance le serveur local. La publication GitHub Pages lance les tests avant de publier `site/`.

Voir `LISEZ-MOI.md` pour l’utilisation.
