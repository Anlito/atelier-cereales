// Les données du projet restent complètes et cohérentes : le parcours venu de Labo Blocs (exercices, fiches,
// lexique) et les fichiers modifiables par le professeur (site/donnees/).
const test = require('node:test');
const assert = require('node:assert/strict');
const { chargerExercices } = require('./outils.js');

const exercices = chargerExercices();
// Fiches « À savoir » et lexique de l'écran d'exercice : ils font partie du parcours de Labo Blocs.
const { catalogue } = require('../site/js/moteur/catalogue.js');
const { fiches, lexique } = catalogue.paquet();

test('le parcours de Labo Blocs est complet : 14 exercices, identifiants stables, aucun problème', () => {
  const LB = require('../site/vendor/labo-blocs/labo-blocs-noyau.js');
  const { catalogue } = require('../site/js/moteur/catalogue.js');
  const paquet = catalogue.paquet();
  assert.deepEqual(LB.controler(paquet.brut), []);
  assert.equal(paquet.id, 'distributeur');
  assert.deepEqual(
    exercices.map((e) => e.idParcours),
    ['dist-01', 'dist-02', 'dist-03', 'dist-04', 'dist-05', 'dist-06', 'dist-07', 'dist-08', 'dist-09', 'dist-10', 'dist-11', 'dist-12', 'dist-13a', 'dist-13b'],
  );
});

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
