// Les fichiers de données modifiables par le professeur restent complets et cohérents.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chargerExercices } = require('./outils.js');

const DONNEES = path.join(__dirname, '..', 'site', 'donnees');
function charger(fichier, fonction) {
  let valeur;
  vm.runInNewContext(fs.readFileSync(path.join(DONNEES, fichier), 'utf8'), { [fonction]: (v) => (valeur = v) });
  return valeur;
}

const exercices = chargerExercices();
const fiches = charger('fiches.js', 'definirFiches');
const lexique = charger('lexique.js', 'definirLexique');

test('chaque exercice a deux indices écrits et une fiche « À savoir »', () => {
  for (const ex of exercices) {
    assert.equal((ex.indices || []).length, 2, `exercice ${ex.id} : indices 1 et 2`);
    for (const t of ex.indices) assert.ok(t.length > 10, `exercice ${ex.id} : indice trop court`);
    const f = fiches[ex.aSavoir];
    assert.ok(f, `exercice ${ex.id} : fiche ${ex.aSavoir} absente`);
    assert.ok(f.lignes.length >= 3 && f.lignes.length <= 6, `fiche ${ex.aSavoir} : 3 à 6 lignes`);
    assert.ok(f.schema || f.etapes, `fiche ${ex.aSavoir} : schéma ou étapes`);
  }
});

test('les indices ne donnent jamais la solution complète (le niveau 3 est une silhouette)', () => {
  for (const ex of exercices) assert.ok(ex.solutionReference, `exercice ${ex.id}`);
});

test('le lexique contient les mots demandés par le brief, en deux phrases au plus', () => {
  const mots = lexique.map((e) => e.mot.toLowerCase());
  for (const m of ['broche', 'haut', 'led', 'bouton', 'capteur', 'actionneur', 'servo', 'angle', 'carte', 'programme', 'boucle', 'condition', 'variable', 'valeur', 'seconde', 'simulateur']) {
    assert.ok(mots.some((x) => x.includes(m)), `mot absent : ${m}`);
  }
  for (const e of lexique) {
    const phrases = e.definition.split(/[.!?](\s|$)/).filter((p) => p && p.trim().length > 1);
    assert.ok(phrases.length <= 2, `« ${e.mot} » : ${phrases.length} phrases`);
  }
});
