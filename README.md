# Projet distributeur de céréales

Site statique où des élèves de 5e programment en blocs (Blockly, en français) les 13 exercices du projet
« distributeur de céréales » et voient le résultat dans un simulateur en direct. Sans compte ni serveur :
le travail de chaque équipe tient dans un fichier `.json` enregistré dans son dossier réseau.

- `site/index.html` : atelier des élèves (`?enseignant=1` : mode enseignant)
- `site/prof.html` : outil professeur (import, suivi en direct, tableau, note, exports)
- **Pour le professeur** : voir [LISEZ-MOI.md](LISEZ-MOI.md) (utilisation et modification des contenus).

## Organisation

| Dossier | Contenu |
|---|---|
| `site/vendor/labo-blocs/` | **module de Labo Blocs** (copié depuis le dépôt [labo-blocs](https://github.com/Anlito/labo-blocs), ne pas modifier ici) : Blockly, moteur (simulation, vérification, code Arduino, sauvegarde), écran d'exercice |
| `site/parcours/` | `distributeur.js` : les exercices 01 à 13B, leurs fiches et le lexique, venus de Labo Blocs (« Mettre à jour les exercices » dans `prof.html`) |
| `site/js/moteur/` | moteur du projet, aussi exécuté sous Node : catalogue (parcours), progression (vue par numéro), carnet de projet, notation, tableau de classe, export Excel |
| `site/js/` | interface : accueil, fichiers, carnet, exercices (écran de Labo Blocs), envoi dans la carte, outil professeur, mise à jour des exercices |
| `site/donnees/` | carnet, classes, barème, composants du tutoriel |
| `tests/` | tests Node (`node:test`) |
| `tools/` | serveur local, recette dans de vrais navigateurs, archive ZIP, sauvegardes d'exemple, programmes de la carte |

Les fichiers de `site/parcours/` et `site/donnees/` sont des scripts (`definirParcours({...})`…) et non du JSON
pur, pour que le site fonctionne aussi ouvert directement depuis un dossier (`file://`). Pour la même raison,
tout le code est en scripts classiques, sans modules ES.

## Commandes

```bash
npm install          # puppeteer-core (recette)
npm run labo-blocs   # recopie le module de Labo Blocs (dépôt labo-blocs à côté de celui-ci) dans site/vendor
npm test             # tests du moteur, de la progression, de la notation, des données
npm start            # http://localhost:8080
npm run recette      # critères du brief dans Chrome/Edge (file:// et serveur) → RECETTE-AUTO.md
npm run exemples     # sauvegardes d'équipes d'exemple dans exemples/
npm run archive      # dist/atelier-cereales.zip (site + LISEZ-MOI)
```

## Publication

Chaque envoi sur `main` lance les tests puis publie `site/` sur GitHub Pages
(`.github/workflows/pages.yml`). Dans les réglages du dépôt : *Settings › Pages › Source : GitHub Actions*.
