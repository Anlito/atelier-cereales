const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const C = require('../site/js/moteur/carnet.js');
const P = require('../site/js/moteur/progression.js');
const { chargerExercices } = require('./outils.js');

let contenu;
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'site', 'donnees', 'carnet.js'), 'utf8'), {
  definirCarnet: (c) => (contenu = c),
});
const ex13 = chargerExercices().find((e) => e.id === '13A');

test('le fichier du carnet est complet', () => {
  assert.ok(contenu.problematique.length > 20);
  assert.equal(contenu.classement.length, 14);
  for (const e of contenu.classement) assert.ok(['capteur', 'carte', 'actionneur'].includes(e.place), e.nom);
  assert.equal(contenu.algorigrammes.length, 2);
  assert.equal(Object.keys(contenu.algoFinal.cases).length, 18);
  for (const g of contenu.algoFinal.groupes) for (const c of g) assert.ok(contenu.algoFinal.cases[c], c);
});

test('classement : bien placés, mal placés, non placés', () => {
  const tout = Object.fromEntries(contenu.classement.map((e) => [e.nom, e.place]));
  assert.equal(C.corrigerClassement(tout, contenu.classement).reussi, true);
  const r = C.corrigerClassement({ ...tout, Souris: 'actionneur', Moteur: undefined }, contenu.classement);
  assert.equal(r.reussi, false);
  assert.deepEqual(r.mal, ['Souris']);
  assert.deepEqual(r.nonPlaces, ['Moteur']);
  assert.equal(r.bien, 12);
});

test('algorigramme : ordre libre dans un groupe, textes en double acceptés', () => {
  const { cases, groupes } = contenu.algoFinal;
  assert.equal(C.corrigerAlgo({ ...cases }, cases, groupes).reussi, true);
  // Les 4 actions du début dans un autre ordre, et « allumée / éteinte » inversées dans une branche.
  const permute = { ...cases, s1: cases.s4, s4: cases.s1, s6L: cases.s7L, s7L: cases.s6L };
  assert.equal(C.corrigerAlgo(permute, cases, groupes).reussi, true);
  // Une question à la place d'une action : signalée, sans donner la réponse.
  const faux = { ...cases, s8L: cases.s11L, s11L: cases.s8L };
  const r = C.corrigerAlgo(faux, cases, groupes);
  assert.equal(r.reussi, false);
  assert.deepEqual(r.mal.sort(), ['s11L', 's8L']);
  const incomplet = { ...cases };
  delete incomplet.s5R;
  assert.deepEqual(C.corrigerAlgo(incomplet, cases, groupes).vides, ['s5R']);
  // Petit algorigramme : l'ordre du fichier.
  const a = contenu.algorigrammes[0];
  const attendu = C.attenduLineaire(a);
  assert.equal(C.corrigerAlgo(attendu, attendu, []).reussi, true);
  assert.equal(C.corrigerAlgo({ ...attendu, c2: attendu.c4, c4: attendu.c2 }, attendu, []).bien, 3);
});

test('câblage construit depuis l’exercice 13A : mêmes broches que les programmes', () => {
  const l = C.lignesCablage(ex13.composants);
  assert.deepEqual([...l.map((x) => x.broche)].sort(), ['D10', 'D11', 'D3', 'D4', 'D5', 'D6', 'D9']);
  assert.equal(l.find((x) => x.broche === 'D3').role, 'capteur');
  assert.equal(l.find((x) => x.broche === 'D9').nom, 'LED Petite dose');
  assert.equal(l.find((x) => x.broche === 'D6').couleurImposee, true);
});

test('avancement du carnet et vérifications gardées dans le fichier', () => {
  const d = P.creerProgression({ eleves: ['Léa', 'Hugo'], classe: '5A' });
  assert.equal(C.avancementCarnet(d.carnet, contenu, ex13.composants), 0);
  d.carnet.idees = ['Une trémie avec une trappe', 'Un tapis roulant'];
  d.carnet.definition = 'Un objet fabriqué par l’homme pour répondre à un besoin.';
  for (const l of C.lignesCablage(ex13.composants)) d.carnet.couleurs[l.broche] = 'rouge';
  C.noterVerificationCarnet(d, 'classement', { reussi: false, bien: 12, total: 14 });
  C.noterVerificationCarnet(d, 'classement', { reussi: true, bien: 14, total: 14 });
  const e = C.etatsCarnet(d.carnet, contenu, ex13.composants);
  assert.equal(e.idees, 'fait');
  assert.equal(e.definition, 'fait');
  assert.equal(e.classement, 'fait');
  assert.equal(e.cablage, 'fait');
  assert.equal(e.final, 'a_faire');
  assert.equal(C.avancementCarnet(d.carnet, contenu, ex13.composants), 4);
  assert.equal(d.carnet.verifications.classement.length, 2);
});

test('une ancienne sauvegarde (sans carnet) reçoit un carnet vide', () => {
  const d = P.creerProgression({ eleves: ['Tom'], classe: '5B' });
  delete d.carnet;
  const r = P.lireSauvegarde(JSON.stringify(d));
  assert.equal(r.ok, true);
  assert.deepEqual(r.donnees.carnet.idees, []);
});
