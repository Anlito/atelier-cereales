# Atelier du distributeur de céréales

Site statique où des élèves de 5e programment en blocs (Blockly, en français) les 13 exercices du projet
« distributeur de céréales » et voient le résultat dans un simulateur en direct. Sans compte ni serveur :
le travail de chaque équipe tient dans un fichier `.json` enregistré dans son dossier réseau.

- `site/index.html` : atelier des élèves (`?enseignant=1` : mode enseignant)
- `site/prof.html` : outil professeur (import, suivi en direct, tableau, note, exports)
- **Pour le professeur** : voir [LISEZ-MOI.md](LISEZ-MOI.md) (utilisation et modification des contenus).

## Organisation

| Dossier | Contenu |
|---|---|
| `site/js/moteur/` | moteur indépendant de l'affichage, aussi exécuté sous Node : simulation en temps virtuel, validation par scénarios, conversion Blockly, progression, notation, tableau de classe, export Excel |
| `site/js/` | interface : blocs, éditeur, simulateur, aides, accueil, fichiers, outil professeur |
| `site/exercices/` | les 13 exercices (+ 13A/13B) en données : consigne, composants, blocs, scénarios de test, indices, solution |
| `site/donnees/` | lexique, fiches « À savoir », classes, barème |
| `site/vendor/` | Blockly copié dans le dépôt (aucun CDN, aucun appel réseau) |
| `tests/` | tests Node (`node:test`) |
| `tools/` | serveur local, copie de Blockly, recette dans de vrais navigateurs, archive ZIP, sauvegardes d'exemple |

Les fichiers de `site/exercices/` et `site/donnees/` sont des scripts (`definirExercice({...})`) et non du JSON
pur, pour que le site fonctionne aussi ouvert directement depuis un dossier (`file://`). Pour la même raison,
tout le code est en scripts classiques, sans modules ES.

## Commandes

```bash
npm install          # Blockly et puppeteer-core (recette)
npm run vendor       # copie Blockly dans site/vendor
npm test             # tests du moteur, de la progression, de la notation, des données
npm start            # http://localhost:8080
npm run recette      # critères du brief dans Chrome/Edge (file:// et serveur) → RECETTE-AUTO.md
npm run exemples     # sauvegardes d'équipes d'exemple dans exemples/
npm run archive      # dist/atelier-cereales.zip (site + LISEZ-MOI)
```

## Publication

Chaque envoi sur `main` lance les tests puis publie `site/` sur GitHub Pages
(`.github/workflows/pages.yml`). Dans les réglages du dépôt : *Settings › Pages › Source : GitHub Actions*.
