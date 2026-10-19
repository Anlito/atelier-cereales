# Brief — nouveau projet sur le modèle du distributeur de céréales

À donner à Claude Code au début d'un **nouveau projet de technologie** qui doit fonctionner comme l'atelier du
distributeur de céréales : **un document unique de travail pour les élèves** (le carnet de projet), **la programmation
par Labo Blocs**, et **un outil professeur** pour le suivi en direct et la notation.

Deux documents se complètent :

| Document | Ce qu'il couvre |
|---|---|
| `Anlito/labo-blocs` › `docs/BRIEF-LABO-BLOCS-POUR-UN-PROJET.md` | **la programmation** : module Labo Blocs, parcours d'exercices, écran d'exercice, envoi dans la carte, réglages du collège (classes, chemins). **À lire en premier.** |
| ce document (`Anlito/atelier-cereales` › `docs/BRIEF-NOUVEAU-PROJET.md`) | **tout le reste** : accueil et dossier de l'équipe, carnet de projet, sauvegarde commune, outil professeur (suivi, alertes, note, croquis par webcam), tutoriel, tests, recette, publication. |

Le **modèle complet** est le dépôt public `Anlito/atelier-cereales` (https://github.com/Anlito/atelier-cereales,
en ligne : https://anlito.github.io/atelier-cereales/). Le lire avant d'écrire du code : il montre chaque point ci-dessous.

---

## 1. Ce que l'élève et le professeur voient

**Élèves (`index.html`)**
1. **Accueil** : « Nouvelle équipe » (1 à 3 prénoms + classe) ou « Ouvrir notre sauvegarde ». « Reprendre le travail
   de … » si l'onglet a été fermé.
2. **Dossier de l'équipe** : le chemin s'affiche (`Bureau › Classe › 5A › COMMUN › TECHNOLOGIE › NOM DU PROJET`), le
   dossier à sélectionner est surligné ; l'élève sélectionne le **dossier du projet**, l'outil y **crée** le dossier
   de l'équipe (`Prénom_Prénom`). Jamais d'écrasement : une sauvegarde déjà là est proposée à l'ouverture.
3. **Carnet de projet** = le document unique, en onglets (problématique, analyse, algorigrammes, programmation,
   câblage…). Bouton **« Vérifier »** sur les parties corrigeables : il dit combien de réponses sont justes et marque
   « à revoir », **sans donner la réponse**.
4. **Programmation** : onglet du carnet qui liste les exercices du parcours Labo Blocs ; l'écran d'exercice de
   Labo Blocs s'ouvre par-dessus, son bouton « Carnet » ramène au carnet.
5. **Un seul fichier** `Prénom_Prénom.json` : carnet + exercices, réenregistré tout seul (Chrome, Edge).

**Professeur (`prof.html`)** — même organisation que Théâtre d'ombre et Concept Store :
- **Accueil** : ouvrir le dossier de la classe (suivi en direct), reprendre le dernier dossier, importer des .json.
- **Classe** : chiffres clés, **alertes « bloqué »** (son, notification), tableau (✓ ● ○ + tentatives, avancement,
  carnet x/N, ★ réussi du premier coup, note, dernière activité), sans défilement horizontal.
- **Équipe** (‹ › entre équipes, Échap pour revenir), onglets : **Bilan** (note et sa composition), **Programmation**,
  **Carnet de projet** (réponses case par case ✓ / ✗, points), **Historique** (vérifications, erreurs, blocs),
  **Croquis et dessins** (photo de la feuille par webcam, enregistrée dans le dossier de l'équipe).
- Bandeau : état du suivi (« En direct · lu à 10:42 »), **Barème**, Excel, CSV, **Carnet de classe** (niveaux par
  compétence de Labo Blocs), Imprimer, Autre classe, **Exercices** (mise à jour du parcours).

---

## 2. Démarrer le dépôt

1. Créer le projet Labo Blocs (dans le dépôt `labo-blocs`) : `npm run nouveau-projet`, puis créer le **parcours**
   d'exercices dans l'éditeur de Labo Blocs. Le module arrive dans `site/vendor/labo-blocs/`, le parcours dans
   `site/parcours/<id>.js` — **ne jamais les modifier à la main**.
2. Recopier depuis `atelier-cereales` la partie « projet », selon la carte du §3 : les fichiers **communs** tels quels,
   les fichiers **à adapter** en changeant l'identité du projet, les fichiers **propres au distributeur** remplacés
   par le contenu du nouveau projet.
3. Remplacer partout l'identité du projet (voir §3.4), puis `npm test` et `npm run recette` doivent passer avant
   d'aller plus loin.

### Contraintes (les mêmes que Labo Blocs, rappel)
- Tout en **français** (interface, code, noms de fichiers et de fonctions, messages de commit).
- Marche en **`file://`** depuis le réseau du collège : scripts classiques, données en `definirXxx({...})`, aucune
  ressource en ligne (sauf la lecture des réglages du collège, avec copie de secours).
- Aucun compte, rien d'envoyé ailleurs. Dépôt public : **aucune vraie donnée d'élève** (exemples fictifs).
- Messages aux élèves : décrire, jamais « tu as faux » ; écart en **ambre**, jamais rouge ; jamais la couleur seule.
- **Ne rien supposer sur le matériel** (broches, câblage, carte, couleurs de câbles en stock) : demander à Thomas.

---

## 3. Carte des fichiers de `atelier-cereales`

### 3.1 Communs — à reprendre tels quels (seule l'identité change, §3.4)

| Fichier | Rôle |
|---|---|
| `site/js/session.js` | session de l'équipe : un fichier, réécrit tout seul, copie de secours dans le navigateur, droit d'écriture demandé au premier vrai geste (jamais à l'ouverture) |
| `site/js/fichiers.js` | choix du dossier, création du dossier de l'équipe, ouverture d'une sauvegarde, jamais d'écrasement |
| `site/js/accueil.js` | accueil (nouvelle équipe / ouvrir / reprendre), panneau du dossier avec le chemin |
| `site/js/exercices.js` | pose l'écran d'exercice de Labo Blocs dans le site (`LB.monterExercice`), mode enseignant |
| `site/js/mise-a-jour.js` | « Mettre à jour les exercices » (parcours en ligne ou fichier, différences, version précédente) |
| `site/js/prof.js`, `site/prof.html`, `site/css/prof.css` | outil professeur (accueil, classe, équipe, suivi en direct, alertes, barème, exports) |
| `site/js/prof-dessins.js` | onglet « Croquis et dessins » : webcam → .jpg dans le dossier de l'équipe |
| `site/js/moteur/progression.js` | sauvegarde : création, lecture, rubriques ; vue par numéro d'exercice |
| `site/js/moteur/notation.js` | note évolutive (voir §5) |
| `site/js/moteur/classe.js` | fusion des fichiers, résumé d'équipe, alertes, tableau, CSV |
| `site/js/moteur/xlsx.js` | export Excel sans bibliothèque |
| `site/js/moteur/catalogue.js` | parcours + `definirXxx` des données ; réglages du collège |
| `site/js/icones.js`, `site/css/atelier.css` | icônes et charte commune (changer l'accent de couleur si besoin) |
| `.github/workflows/pages.yml` | tests puis publication de `site/` ; copie de secours des réglages du collège |
| `tools/serve.js`, `tools/archive.js`, `tools/recette.js`, `tools/carte-virtuelle.js` | serveur local, archive ZIP, recette dans Chrome/Edge, carte Arduino simulée |
| `tests/outils.js`, `tests/classe.test.js`, `tests/notation.test.js`, `tests/progression.test.js` | tests du moteur commun |

### 3.2 À adapter au projet

| Fichier | Ce qui change |
|---|---|
| `site/index.html` | titre, sous-titre de l'accueil, liste des scripts (parcours du projet, données du carnet) |
| `site/donnees/classes.js` | `definirReglagesAtelier({ niveaux: ['4'], cheminProjet: ['NOM DU PROJET'] })` |
| `site/donnees/college.js` | copie de secours des réglages du collège (rafraîchie par la publication) |
| `site/donnees/notation.js` | barème : coefficients des exercices du nouveau parcours, parties notées du carnet |
| `site/js/moteur/carnet.js` | liste des parties du carnet, corrections, avancement (voir §4) |
| `site/js/carnet-ecran.js`, `site/css/carnet.css` | onglets du carnet et leur affichage (voir §4) |
| `site/js/prof.js` › `carnetHtml`, `reponsesHtml` | affichage du carnet de l'équipe côté professeur |
| `tools/exemples-equipes.js` | équipes fictives pour essayer `prof.html` (`npm run exemples`) |
| `LISEZ-MOI.md`, `README.md` | mode d'emploi du professeur, organisation du dépôt |

### 3.3 Propres au distributeur — à remplacer

`site/parcours/distributeur.js` (le parcours vient de Labo Blocs), `site/donnees/carnet.js` (problématique,
classement, algorigrammes, couleurs de câbles), `site/img/objets/`, le tutoriel de câblage (`site/tuto.html`,
`site/js/tuto.js`, `site/css/tuto.css`, `site/donnees/tuto-composants.js`, `site/img/tuto/`) — à garder seulement si
le projet a du câblage, en reprenant le principe : le tableau de câblage est **construit depuis l'exercice final du
parcours** (mêmes broches que les programmes).

### 3.4 Identité du projet — à remplacer partout

`git grep -n -i "atelier-cereales\|distributeur\|céréales\|cereales"` liste tous les endroits. Ce sont :
- le nom de l'application dans les sauvegardes (`APPLICATION = 'atelier-cereales'`, `projet: 'distributeur'`) ;
- les **clés de stockage** du navigateur (`atelier-cereales-…` : copie de secours, dossier mémorisé, caméra) — un
  projet par clé, sinon deux outils ouverts sur le même poste se mélangent ;
- l'identifiant du parcours (`distributeur`) et son fichier ;
- les titres (« Projet distributeur de céréales »), le dossier du projet (`DISTRIBUTEUR DE CEREALES`), les noms
  d'export (`atelier-cereales-5A-….xlsx`), le nom de l'archive.

Conseil : rassembler cette identité dans un seul fichier (`site/donnees/projet.js`, `definirProjetAtelier({ id,
titre, dossier, accent })`) dès le départ, et le lire partout : le projet suivant n'aura qu'un fichier à changer.

---

## 4. Le carnet de projet (document unique)

### 4.1 Principe
- Le carnet **remplace le document élève papier/HTML** : partir du document que Thomas fournit, une partie du
  document = une partie du carnet ; garder ses textes et ses images.
- L'état du carnet est la rubrique **`carnet`** du fichier de l'équipe. Labo Blocs écrit seulement `programmation`.
- Les réponses sont gardées **par texte** (et non par position) : si Thomas corrige un élément dans les données, les
  réponses ne se mélangent pas (`ancienNom` pour suivre un renommage).
- Chaque vérification est **horodatée** dans `carnet.verifications[partie]` : `{ date, bien, total, reussi }` — c'est
  ce que lisent la note et l'outil professeur.
- Une partie a un **état** : `fait` / `en_cours` / `a_faire` (pastilles des onglets, « Carnet 5/7 » côté professeur).

### 4.2 Types de parties (ceux du distributeur, à réutiliser)

| Type | Exemple dans le distributeur | Corrigé par « Vérifier » ? | Noté ? |
|---|---|---|---|
| **liste libre** | idées de solutions (N lignes) | non | non (travail visible par le professeur) |
| **texte libre** | définition d'un objet technique | non | non |
| **classement** | ranger des éléments (image + nom) dans des colonnes avec « ? » d'aide | oui | oui |
| **algorigramme** | remettre des étapes dans des cases (ordre, groupes sans ordre imposé) | oui | oui (entraînement) / non (final) |
| **choix par élément** | couleur du câble de chaque broche, parmi le stock | non | non |
| **programmation** | liste des exercices Labo Blocs + envoi dans la carte | par Labo Blocs | oui (§5) |
| **photo par le professeur** | croquis, dessin technique (onglet professeur) | non | à noter à la main |

Recommandation pour le nouveau projet : décrire le carnet **par des données** plutôt que par du code propre à chaque
partie — un `definirCarnet({ onglets: [...], parties: [...] })` où chaque partie a un `type` du tableau ci-dessus,
ses textes et sa correction. Exemple :

```js
definirCarnet({
  "problematique": "Comment … ?",
  "onglets": [
    { "cle": "probleme", "titre": "Problématique", "parties": ["idees", "definition"] },
    { "cle": "analyse", "titre": "Analyse", "parties": ["classement"] },
    { "cle": "algo", "titre": "Algorigramme", "parties": ["sequence"] },
    { "cle": "programmation", "titre": "Programmation", "parties": [] }
  ],
  "parties": [
    { "id": "idees", "type": "liste", "titre": "Idées de solutions", "nombre": 4, "note": false },
    { "id": "definition", "type": "texte", "titre": "Objet technique", "question": "…", "note": false },
    { "id": "classement", "type": "classement", "titre": "Classement", "note": true,
      "colonnes": [{ "cle": "capteur", "titre": "Capteurs", "explication": "…" }, …],
      "elements": [{ "nom": "Bouton poussoir", "image": "img/objets/bouton.png", "place": "capteur" }, …] },
    { "id": "sequence", "type": "algorigramme", "titre": "Algorigramme", "note": true,
      "cases": { "s1": "…", "s2": "…" }, "groupes": [] }
  ]
});
```

Le moteur (`carnet.js`) fait alors : `vide()`, `completer()`, `corriger(partie, reponses)`, `etats()`,
`avancement()` à partir de ces données, et `notation.js` lit `"note": true` au lieu d'une liste en dur.

---

## 5. La note (outil professeur)

Principe validé par Thomas, à garder :
- **Note évolutive sur 20**, juste même si une équipe ne finit pas : calculée sur les **N premiers exercices
  attendus** à ce moment du projet (réglage `objectif`, augmenté au fil des séances).
- **Coefficient par exercice** selon la difficulté ; l'exercice final et un **défi** (bonus) éventuel.
- **Réussi** = tous les points **du premier coup et sans indice** ; sinon −10 % par indice (max −30 %) et −5 % par
  vérification ratée (max −25 %), comptés **avant** la réussite. **Commencé sans réussir** = 20 %. Non commencé = 0.
- **L'avance ne compense pas les erreurs** (`avance: 0`).
- **Carnet** : les parties corrigeables et notées suivent la même règle (−5 % par vérification ratée avant la
  réussite) ; les autres ne sont pas notées mais leur travail est visible.
- Les élèves sont prévenus dans le panneau des indices qu'un indice enlève un peu de points.
- Réglable dans le « Barème » de `prof.html` (le temps de la page) ou dans `donnees/notation.js` (gardé).
- En plus : les **niveaux par compétence** calculés par Labo Blocs, exportés pour le **Carnet de classe**.

---

## 6. Tests, recette, publication

- `npm test` (`node:test`) : moteur de la progression, du carnet, de la note, du tableau de classe, données.
- `npm run recette` : dans Chrome et Edge, en `file://` et par serveur : accueil, exercices du parcours réussis par
  leur solution, pas de défilement à 1366×768 et 1920×1080, aucune requête hors du site, aucune erreur console,
  enregistrer / fermer / rouvrir / reprendre, fichier lu par `prof.html`, envoi dans la carte virtuelle, mise à jour
  du parcours sans perte. Résultat dans `RECETTE-AUTO.md`.
- `npm run exemples` : équipes fictives dans `exemples/` (ignoré par git) pour essayer `prof.html`.
- `npm run archive` : `dist/<projet>.zip` pour le dossier réseau (site + LISEZ-MOI).
- Publication : dépôt public `Anlito/<projet>`, GitHub Pages par le workflow (tests d'abord). Puis ajouter la fiche
  du projet sur https://anlito.github.io/ (dépôt `Anlito/anlito.github.io`, voir son README) : élèves et professeur.

---

## 7. Questions à poser à Thomas avant de coder

1. Le **document élève** actuel (fichier) et la **présentation** du projet : quelles parties deviennent des onglets ?
2. Le **niveau** (4e, 3e…) et le **nom du dossier** du projet sur le réseau (`… › TECHNOLOGIE › NOM DU PROJET`).
3. Le **parcours Labo Blocs** : identifiant, exercices (créés dans l'éditeur de Labo Blocs), exercice final, défi.
4. Le **matériel** : carte, composants, **broches**, câblage, couleurs de câbles en stock, boutons 2 ou 3 fils.
5. Ce qui est **noté** dans le carnet et ce qui est seulement **visible** ; les coefficients.
6. Faut-il un **tutoriel de câblage** et l'onglet **Croquis et dessins** ?
