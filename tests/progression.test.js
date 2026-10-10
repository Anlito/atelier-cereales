const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../site/js/moteur/progression.js');

const nouvelle = () => P.creerProgression({ eleves: ['  léa ', 'Hugo', ''], classe: '5A' });

test('nom de l’équipe : prénoms joints par « _ », première lettre en majuscule', () => {
  assert.equal(P.nomEquipe(['léa', ' hugo ', '']), 'Léa_Hugo');
  assert.equal(P.nomEquipe(['Anne Marie', 'Inès/']), 'Anne-Marie_Inès');
  assert.equal(P.simplifierNom('LEA_hugo'), P.simplifierNom('Léa_Hugo'));
});

test('une nouvelle équipe suit le format du brief', () => {
  const d = nouvelle();
  assert.equal(d.application, 'atelier-cereales');
  assert.equal(d.formatVersion, 1);
  assert.deepEqual(d.equipe, { eleves: ['Léa', 'Hugo'], classe: '5A' });
  assert.match(d.creeLe, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
  assert.deepEqual(d.exercices, {});
});

test('chaque vérification est une tentative gardée avec tous ses écarts et le programme', () => {
  const d = nouvelle();
  P.noterOuverture(d, '4');
  assert.equal(d.exercices['4'].statut, 'en_cours');
  P.noterVerification(d, '4', {
    reussi: false,
    message: 'Quand le bouton D8 est appuyé, la LED D3 devrait être allumée.',
    ecarts: ['écart 1', 'écart 2'],
    notes: ['Un bloc est resté seul.'],
    programme: { demarrage: [], boucle: [{ bloc: 'led_etat', id: 'abc', broche: 'D3', etat: 1 }] },
  });
  P.noterVerification(d, '4', { reussi: true, programme: { demarrage: [], boucle: [] } });
  const e = d.exercices['4'];
  assert.equal(e.tentatives, 2);
  assert.equal(e.statut, 'reussi');
  assert.ok(e.premiereReussite);
  assert.equal(e.historique.length, 2);
  assert.deepEqual(e.historique[0].ecarts, ['écart 1', 'écart 2']);
  assert.deepEqual(e.historique[0].notes, ['Un bloc est resté seul.']);
  assert.equal(e.historique[0].programme.boucle[0].id, undefined, 'les identifiants de blocs sont retirés');
  assert.equal(e.historique[1].reussi, true);
  // Un échec après une réussite ne fait pas perdre le statut « réussi ».
  P.noterVerification(d, '4', { reussi: false, message: 'x' });
  assert.equal(e.statut, 'reussi');
});

test('indices : niveau le plus haut gardé, chaque ouverture dans l’historique', () => {
  const d = nouvelle();
  P.noterIndice(d, '2', 1);
  P.noterIndice(d, '2', 2);
  P.noterIndice(d, '2', 1);
  assert.equal(d.exercices['2'].indicesOuverts, 2);
  assert.deepEqual(d.exercices['2'].historique.map((h) => h.niveau), [1, 2]);
});

test('déblocage linéaire, 13B après 13A, avancement sur 13', () => {
  const d = nouvelle();
  assert.equal(P.estDebloque(d, '1'), true);
  assert.equal(P.estDebloque(d, '2'), false);
  for (const id of P.ORDRE_PARCOURS.slice(0, 12)) P.noterVerification(d, id, { reussi: true });
  assert.equal(P.estDebloque(d, '13A'), true);
  assert.equal(P.estDebloque(d, '13B'), false);
  assert.equal(P.avancement(d), 12);
  P.noterVerification(d, '13A', { reussi: true });
  assert.equal(d.exercice13.versionReussie, 'A');
  assert.equal(P.estDebloque(d, '13B'), true);
  assert.equal(P.avancement(d), 13);
  P.noterVerification(d, '13B', { reussi: true });
  assert.equal(d.exercice13.versionReussie, 'B');
  assert.equal(P.estDebloque(nouvelle(), '9', { toutDebloquer: true }), true);
});

test('reprise : exercice de la dernière fois, sinon le premier non réussi', () => {
  const d = nouvelle();
  P.noterVerification(d, '1', { reussi: true });
  P.noterOuverture(d, '2');
  assert.equal(P.exerciceAReprendre(d), '2');
  d.exerciceCourant = '9';
  assert.equal(P.exerciceAReprendre(d), '2');
});

test('fichiers refusés sans rien écraser : autre application, version plus récente, illisible', () => {
  assert.equal(P.lireSauvegarde('pas du json').ok, false);
  assert.match(P.lireSauvegarde('{"application":"autre"}').raison, /autre application/);
  assert.match(P.lireSauvegarde('{"application":"atelier-cereales","formatVersion":2,"equipe":{"eleves":[]}}').raison, /plus récente/);
  const d = nouvelle();
  P.noterVerification(d, '1', { reussi: true });
  const r = P.lireSauvegarde('﻿' + JSON.stringify(d));
  assert.equal(r.ok, true);
  assert.equal(r.donnees.exercices['1'].statut, 'reussi');
});
