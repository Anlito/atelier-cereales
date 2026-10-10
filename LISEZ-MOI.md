# Atelier du distributeur de céréales — LISEZ-MOI (professeur)

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
3. **Exercices** : on réussit l'exercice N pour ouvrir le N+1 (13B est un défi après 13A).
   Sur Chrome et Edge, le fichier se réenregistre tout seul (à chaque vérification et 10 s après une modification).
4. Si l'onglet est fermé par erreur, l'accueil propose « Reprendre le travail de … ».

## 3. Outil professeur (`prof.html`)

- **Importer** : glisser les fichiers `.json`, ou « Choisir le dossier de la classe »
  (ex. `DISTRIBUTEUR DE CEREALES`) : tous les dossiers d'équipes sont lus d'un coup.
- **Suivi en direct** (Chrome, Edge) : après le choix du dossier, il est relu toutes les 30 s.
  Les équipes qui avancent sont signalées ; une **alerte** (son, et notification si autorisée) apparaît quand
  une équipe est **bloquée** : au moins 6 tentatives ou 10 minutes sur un exercice non réussi (seuils réglables).
- **Tableau** : ✓ réussi, ● en cours, ○ non commencé, avec le nombre de tentatives ; avancement, ★ réussites du
  premier coup sans indice, note, dernière activité, temps. Clic sur une équipe : tout son historique
  (chaque vérification et ses erreurs, le programme de chaque tentative, chaque indice).
  « Lancer ce programme » le rouvre dans l'atelier, en lecture.
- **Exports** : CSV, Excel (feuilles « Classe » et « Détail par exercice »), impression A4 paysage.

### La note

Panneau « Barème » de `prof.html` (réglages valables le temps de la page), ou fichier `donnees/notation.js`
(réglages gardés). Par défaut, note sur 20 :

- chaque exercice a un **coefficient** selon sa difficulté ;
- **réussi** : tous ses points s'il est réussi **du premier coup et sans indice** ; sinon −10 % par indice
  (au plus −30 %) et −5 % par essai raté (au plus −25 %), comptés **avant** la réussite ;
- **commencé sans réussir** : 20 % des points ; **non commencé** : 0 ; **13B réussi** : +1 point ;
- **exercices attendus** : la note est calculée sur les N premiers exercices attendus à ce moment du projet
  (à augmenter au fil des séances). Un exercice réussi en avance ne compense pas les erreurs (réglage « avance »).

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
| le **barème** de la note | `donnees/notation.js` | chaque réglage est expliqué dans le fichier |

**Attention aux broches** : si vous changez une broche dans `"composants"`, changez-la aussi dans
`"solutionReference"` et dans les `"scenarios"` (les tests de « Vérifier mon programme »), sinon la
vérification attendra l'ancienne broche. Les broches des exercices suivent les captures Vittascience ;
le tableau de câblage du document élève en utilise d'autres : à harmoniser.

**Les tests de vérification** (`"scenarios"`) décrivent ce qu'on observe : attendre, appuyer sur un bouton,
vérifier l'état d'une LED ou l'angle du servo. On peut les laisser tels quels si on ne change que des textes.

---

## 5. Points à confirmer (choix faits pour cette version)

- **Grande dose** : CHOIX vaut **7** (la consigne), alors que les captures du programme affectent 10
  (`exercices/parametres.js`).
- **Exercice 12** : le servo est sur **D5** (comme la capture), la broche de la LED Trappe à l'exercice 13.
- **Exercice 11** : un programme qui reste 4 s à 0° (cinq positions écrites, puis la boucle) est accepté.
- **13A** suffit pour terminer le parcours ; **13B** est un défi.
- Libellés des blocs : ceux de Vittascience ; catégories Lumière, Temps, Bouton, Moteur, Décisions, Variables.

## 6. À vérifier en classe

- Sur un poste de 5e : Chrome/Edge et Firefox, ouverture depuis le dossier réseau, choix du dossier de l'équipe.
- Enregistrer, fermer, rouvrir le fichier et reprendre à l'exercice en cours.
- Le suivi en direct de `prof.html` sur le vrai dossier réseau de la classe.
- Avec 2 ou 3 élèves, sans explication : trouvent-ils comment lancer, enregistrer, ouvrir le lexique et demander un indice ?
