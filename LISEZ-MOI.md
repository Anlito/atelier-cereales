# Distributeur de céréales — Guide professeur

## Ouvrir le projet

Élèves : `index.html`. Professeur : `prof.html`. Tutoriel : `tuto.html`.
Une connexion Internet est nécessaire, y compris avec le ZIP local : moteur, éditeur, simulateur et exercices viennent directement de Labo Blocs en ligne. Aucune copie n’est embarquée. Un bouton permet de réessayer si la connexion échoue.

Chrome ou Edge sont recommandés pour les dossiers, l’enregistrement et l’envoi vers Arduino.

## Travail des équipes

Nouvelle équipe : choisir les prénoms, la classe et le dossier du projet. Un dossier d’équipe est créé sans écraser les sauvegardes existantes. « Ouvrir notre équipe » donne accès au JSON et aux photos. « Reprendre » retrouve la session et demande à nouveau l’autorisation du dossier si nécessaire.

Le carnet contient la problématique, les idées, la définition d’un objet technique, le classement, les dessins, les algorigrammes, la programmation et le câblage. Les idées et la définition sont deux réponses distinctes, présentées dans cet ordre dans le suivi professeur.

Le travail et les programmes restent dans le JSON de l’équipe. Les anciennes sauvegardes sont reprises. Les photos restent séparées. Aucune sauvegarde élève n’est envoyée à Labo Blocs : seules ses ressources publiques sont chargées.

## Croquis et dessin technique

Travail sur papier : croquis à main levée en perspective ; dessin technique avec règle et équerre, à l’échelle 1:3 et dimensions réelles cotées en millimètres. Les 16 critères cochés sont une auto-vérification, pas une note.

Dans la fiche professeur → Croquis et dessins : choisir le type, photographier ou importer, puis enregistrer dans le dossier d’équipe. Les élèves retrouvent les photos dans la rubrique correspondante, relues toutes les 15 secondes. Avec un JSON seul, donner accès au dossier dans la galerie. Firefox permet une sélection manuelle.

## Suivi et notation

Ouvrir le dossier de classe pour le suivi en direct (30 secondes par défaut). L’import de JSON seuls est ponctuel : réimporter pour voir les nouvelles réponses. Vérifier l’enregistrement élève et utiliser Actualiser côté professeur.

Barème : choisir les parties à noter, coefficients et bonus 13B (0 = désactivé). Les parties automatiques utilisent les réussites, indices et tentatives avant la première réussite. Le tableau explique les points conservés selon les réglages ; les vérifications après réussite ne retirent rien.

Les parties manuelles se notent dans Équipe → Carnet de projet : Non atteint (1/4), Partiellement atteint (2/4), Atteint (3/4), Dépassé (4/4). Sans niveau choisi, la partie reste hors du total.

Les évaluations sont séparées des JSON élèves, conservées sur le navigateur professeur et utilisées dans les résultats et exports. Exporter mes évaluations sauvegarde le barème et les niveaux ; l’import fusionne les niveaux et reprend le barème importé. Conserver cette sauvegarde pour changer de poste.

## Source unique de Labo Blocs

Publier les modifications dans Labo Blocs, puis recharger les pages du distributeur. Exercices indique les versions du moteur et du parcours. Il n’y a plus d’installation locale des exercices. Une session ouverte garde sa version jusqu’au rechargement.

## Contenus du projet

`donnees/carnet.js` : consignes et réponses ; `donnees/notation.js` : barème initial ; `donnees/classes.js` : niveaux et dossier. Les réglages du collège sont partagés avec Labo Blocs. Ne pas renommer les identifiants des réponses pendant l’année.

## Vérification au collège

Vérifier l’accès Internet à Labo Blocs, l’ouverture d’une ancienne sauvegarde, son enregistrement réseau et le suivi professeur. Tester l’envoi sur une vraie carte Arduino, les boutons et le servo : les tests logiciels ne remplacent pas cet essai matériel.
