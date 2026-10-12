# Projet distributeur de céréales — LISEZ-MOI (professeur)

Un atelier de programmation en blocs, avec simulateur en direct, pour les 13 exercices du projet
« distributeur de céréales » (5e). Pas de compte, pas de serveur : tout se passe dans le navigateur,
et le travail de chaque équipe est enregistré dans **un fichier** dans le dossier de l'équipe.

- **Élèves** : `index.html`
- **Professeur** : `prof.html` (aucun lien depuis l'écran des élèves)
- **Mode enseignant** (tout ouvert, bouton « Solution », rien n'est enregistré) : `index.html?enseignant=1`,
  ou le lien en haut de `prof.html`.

---

## 1. Ouvrir l'atelier

**En ligne** : l'adresse GitHub Pages du projet.

**Depuis le dossier réseau** : décompresser `atelier-cereales.zip`, puis ouvrir
`atelier-cereales/index.html` (double-clic). Le site marche sans connexion internet.

**Navigateurs** : Chrome ou Edge recommandés. Firefox fonctionne, mais sans choix de dossier :
« Enregistrer » y télécharge le fichier, que l'élève doit ranger lui-même dans le dossier de l'équipe.

## 2. Ce que font les élèves

1. **Accueil** : « Nouvelle équipe » (1 à 3 prénoms et la classe) ou « Ouvrir notre sauvegarde ».
2. **Dossier de l'équipe** : le chemin attendu s'affiche
   (`5A › COMMUN › TECHNOLOGIE › DISTRIBUTEUR DE CEREALES › Prénom_Prénom`).
   L'élève choisit ce dossier ; s'il n'existe pas, il choisit `DISTRIBUTEUR DE CEREALES` et l'atelier le crée.
   Une sauvegarde déjà présente n'est jamais écrasée : l'atelier propose de l'ouvrir.
3. **Carnet de projet** (il remplace le document élève) : six onglets — Problématique (idées, définition),
   Objet automatisé (classement capteur / carte / actionneur), Algorigrammes (deux exercices),
   Algorigramme du distributeur, Programmation, Câblage. Un bouton « Vérifier » corrige le classement et les
   algorigrammes : il dit combien de réponses sont justes et marque « à revoir » ce qui est faux, sans donner la réponse.
4. **Exercices de programmation** (onglet Programmation) : on réussit l'exercice N pour ouvrir le N+1
   (13B est un défi après 13A). Le bouton « Carnet » de l'écran d'exercice ramène au carnet.
5. **Un seul fichier** `Prénom_Prénom.json` garde le carnet et les exercices. Sur Chrome et Edge, il se réenregistre
   tout seul (à chaque vérification et peu après une modification).
6. Si l'onglet est fermé par erreur, l'accueil propose « Reprendre le travail de … ».
7. **Tester sur la maquette** : quand l'exercice 13A est réussi, « Envoyer le programme dans la carte Arduino »
   (onglet Programmation du carnet, ou message de réussite de l'exercice 13) envoie le programme du distributeur
   dans la carte branchée en USB (Chrome ou Edge, aussi depuis le dossier réseau). C'est le programme de la
   solution de référence (13B si le défi est réussi) : celui de l'équipe a réussi les mêmes tests, il fait la même
   chose. Boutons attendus : boutons à 2 fils (signal + GND), lus avec la résistance interne de la carte
   (réglage "boutonsVersMasse" de exercices/parametres.js). Chaque envoi est noté pour le professeur.
   Fin de séance : « Vider la carte » envoie un programme vierge (protocole de démontage).
   Si une broche ou une solution de l'exercice 13 change, recompiler avec « npm run firmware » (les fichiers
   site/firmware/distributeur_13A.ino et _13B.ino s'ouvrent aussi dans l'IDE Arduino).
8. **Tutoriel de câblage** (`tuto.html`, lien dans le carnet) : la carte Arduino, la platine de test, les
   protocoles d'installation / d'envoi du programme / de démontage, le câblage du distributeur (construit depuis
   exercices/13A.js) et la fiche de branchement de chaque composant.

## 3. Outil professeur (`prof.html`)

L'outil a trois écrans, comme ceux des autres projets (Théâtre d'ombre, Concept Store) :

- **Accueil — Suivre une classe** : « Ouvrir le dossier de la classe » (ex. `DISTRIBUTEUR DE CEREALES`, tous les
  dossiers d'équipes sont lus d'un coup), « Reprendre » le dernier dossier suivi en un clic, ou « Importer des
  fichiers .json » (on peut aussi les glisser n'importe où dans la page).
- **Classe** :
  - en haut, les **chiffres clés** : nombre d'équipes, note moyenne, exercices réussis et parties du carnet
    (moyennes), programmes du distributeur réussis, équipes bloquées ;
  - les **alertes** : une équipe est **bloquée** quand elle a fait au moins 6 tentatives ou passé 10 minutes sur
    un exercice non réussi (seuils réglables). Une alerte fait un son, et une notification si elle est autorisée ;
  - le **tableau** : ✓ réussi, ● en cours, ○ non commencé, avec le nombre de tentatives ; avancement, parties du
    carnet terminées (ex. 5/7), ★ réussites du premier coup sans indice, note, dernière activité.
    Les équipes qui viennent d'avancer sont signalées.
- **Équipe** (clic sur une ligne ou sur une alerte), avec ‹ › pour passer à l'équipe voisine et Échap pour revenir :
  - **Bilan** : la note et ce qui la compose (programmation, carnet, bonus 13B), l'avancement, la maquette
    (programme envoyé dans la carte) ;
  - **Programmation** : chaque exercice, ses tentatives, indices, temps et points ; « Lancer le programme » le
    rouvre dans l'atelier, en lecture ;
  - **Carnet de projet** : chaque partie, son état, le travail de l'équipe (« Voir leurs réponses » case par case,
    avec ✓ / ✗) et ses points ;
  - **Historique** : chaque vérification et ses erreurs, le programme de chaque tentative, chaque indice.
- **Bandeau** : la classe suivie et l'état du suivi en direct (« En direct · lu à 10:42 ») ; le dossier est relu
  toutes les 30 s (Chrome, Edge). « Barème » : la note, les seuils d'alerte, la fréquence du suivi.
  « Excel » (feuilles « Classe » et « Détail par exercice »), « CSV », « Imprimer » (A4 paysage, l'écran affiché),
  « Autre classe ».

### La note

Bouton « Barème » de `prof.html` (réglages valables le temps de la page), ou fichier `donnees/notation.js`
(réglages gardés). Par défaut, note sur 20 :

- chaque exercice a un **coefficient** selon sa difficulté ;
- **réussi** : tous ses points s'il est réussi **du premier coup et sans indice** ; sinon −10 % par indice
  (au plus −30 %) et −5 % par essai raté (au plus −25 %), comptés **avant** la réussite ;
- **commencé sans réussir** : 20 % des points ; **non commencé** : 0 ; **13B réussi** : +1 point ;
- **exercices attendus** : la note est calculée sur les N premiers exercices attendus à ce moment du projet
  (à augmenter au fil des séances). Un exercice réussi en avance ne compense pas les erreurs (réglage « avance »).
- **carnet de projet** : le **classement** et les **deux algorigrammes d'entraînement** sont notés de la même façon
  (coefficient 1 chacun) : tous les points s'ils sont réussis à la première vérification, −5 % par vérification
  ratée avant la réussite, 20 % s'ils sont commencés sans être réussis. La **problématique** et l'**algorigramme du
  distributeur** ne sont pas notés : le détail de chaque équipe montre quand même leur travail (idées, définition,
  et « Voir leurs réponses » case par case avec ✓ / ✗). Les coefficients du carnet se règlent dans le Barème.

Les élèves sont prévenus dans le panneau des indices qu'un indice enlève un peu de points.

---

## 4. Modifier les contenus (sans toucher au programme)

Tous les contenus sont dans des fichiers texte, à ouvrir avec le Bloc-notes (ou tout éditeur de texte).
Ils sont dans le dossier du site (`site/` dans le dépôt, `atelier-cereales/` dans l'archive).

> **Règles d'écriture** : garder les guillemets droits `"…"`, les virgules entre les éléments, les crochets
> `[ ]` et accolades `{ }`. Une apostrophe dans un texte s'écrit normalement (`l'angle`).
> Après une modification, recharger la page (F5). Si la page reste blanche ou un exercice disparaît,
> c'est en général une virgule ou un guillemet oublié : annuler la dernière modification.

| Je veux modifier… | Fichier | Champ |
|---|---|---|
| la **consigne** d'un exercice | `exercices/04.js` (etc., `13A.js`, `13B.js`) | `"consigne"` ; `\n` = retour à la ligne |
| le **titre** d'un exercice | même fichier | `"titre"` |
| une **broche** ou le **nom** d'un composant | même fichier | `"composants"` : `{ "type": "led", "nom": "Trappe", "broche": "D5" }` |
| les **blocs proposés** dans la palette | même fichier | `"blocsAutorises"` |
| les **indices 1 et 2** | même fichier | `"indices"` (l'indice 3, la silhouette, est tiré de la solution) |
| la **solution de référence** | même fichier | `"solutionReference"` |
| la **fiche « À savoir »** | `donnees/fiches.js` | la fiche dont le numéro est le `"aSavoir"` de l'exercice |
| l'explication des blocs **« Au démarrage » / « Répéter indéfiniment »** | `donnees/fiches.js` | fiche `"demarrage-boucle"` |
| le **lexique** (définitions, mots soulignés) | `donnees/lexique.js` | `"definition"`, `"formes"` |
| la **liste des classes** et le **chemin** affiché | `donnees/classes.js` | `definirClasses`, `definirCheminSauvegarde` |
| la **durée de la trappe** (CHOIX = 3 ou 7) | `exercices/parametres.js` | `"dureePetiteDose"`, `"dureeGrandeDose"` |
| jusqu'à quel exercice le bloc LED affiche « allumée / éteinte » | `exercices/parametres.js` | `"aideLedJusquAExercice"` (0 = jamais) |
| les **couleurs de câbles en stock** (choix du câblage) | `donnees/carnet.js` | `"couleursCables"` : une liste pour `"led"`, une pour `"bouton"` |
| les **composants du tutoriel** (photo, branchement) | `donnees/tuto-composants.js` | `"branchement"`, `"note"` |
| le **barème** de la note | `donnees/notation.js` | chaque réglage est expliqué dans le fichier |
| le **carnet de projet** (problématique, éléments à classer et leur bonne colonne, étapes des algorigrammes, couleurs de câbles) | `donnees/carnet.js` | chaque partie est expliquée dans le fichier ; le tableau de câblage est construit depuis `exercices/13A.js` |

**Attention aux broches** : si vous changez une broche dans `"composants"`, changez-la aussi dans
`"solutionReference"` et dans les `"scenarios"` (les tests de « Vérifier mon programme »), sinon la
vérification attendra l'ancienne broche. Les broches suivent le **tableau de câblage** : boutons PetiteDose D3,
GrandeDose D4, Trappe D5 ; LED PetiteDose D9, GrandeDose D10, Trappe D11 ; servo D6. Le tableau « Câblage » du
carnet est construit à partir de `exercices/13A.js` : il suit automatiquement une modification de ce fichier.
Les menus des blocs proposent toutes les broches D2 à D13 : c'est à l'élève de choisir la bonne.

**Les tests de vérification** (`"scenarios"`) décrivent ce qu'on observe : attendre, appuyer sur un bouton,
vérifier l'état d'une LED ou l'angle du servo. On peut les laisser tels quels si on ne change que des textes.

---

## 5. Points à confirmer (choix faits pour cette version)

- **Grande dose** : CHOIX vaut **7** (la consigne), alors que les captures du programme affectent 10
  (`exercices/parametres.js`).
- **Exercice 12** : le bouton est sur **D5** (bouton Trappe) et le moteur sur **D6**, comme au câblage.
- **Consignes** : les numéros de broches des consignes Vittascience ont été remplacés par ceux du câblage.
- **Exercice 11** : un programme qui reste 4 s à 0° (cinq positions écrites, puis la boucle) est accepté.
- **13A** suffit pour terminer le parcours ; **13B** est un défi.
- Libellés des blocs : ceux de Vittascience ; catégories Lumière, Temps, Bouton, Moteur, Décisions, Variables.

## 6. À vérifier en classe

- Sur un poste de 5e : Chrome/Edge et Firefox, ouverture depuis le dossier réseau, choix du dossier de l'équipe.
- Enregistrer, fermer, rouvrir le fichier et reprendre à l'exercice en cours.
- Le suivi en direct de `prof.html` sur le vrai dossier réseau de la classe.
- Avec 2 ou 3 élèves, sans explication : trouvent-ils comment lancer, enregistrer, ouvrir le lexique et demander un indice ?
