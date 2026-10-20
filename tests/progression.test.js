// Progression d'une équipe : le travail des exercices est rangé par Labo Blocs dans la rubrique « programmation »
// (identifiants stables « dist-01 »…) ; le carnet, l'outil du professeur et la notation le lisent par numéro.
const test = require('node:test');
const assert = require('node:assert/strict');
const LB = require(require('../tools/dependances-tests.js').noyau);
const P = require('../site/js/moteur/progression.js');
const { catalogue } = require('../site/js/moteur/catalogue.js');

const paquet = catalogue.paquet();
const ex = (numero) => paquet.exercices.find((e) => e.numero === numero);
const nouvelle = () => P.creerProgression({ eleves: ['  léa ', 'Hugo', ''], classe: '5A' });
// Une vérification, comme l'écran d'exercice de Labo Blocs la note.
const verifier = (d, numero, reussi, message) => LB.noterVerification(d, ex(numero), { reussi, message: message || '', programme: null });

test('nom de l’équipe : prénoms joints par « _ », première lettre en majuscule', () => {
  assert.equal(P.nomEquipe(['léa', ' hugo ', '']), 'Léa_Hugo');
  assert.equal(P.nomEquipe(['Anne Marie', 'Inès/']), 'Anne-Marie_Inès');
  assert.equal(P.simplifierNom('LEA_hugo'), P.simplifierNom('Léa_Hugo'));
});

test('une nouvelle équipe : format 2, rubrique « programmation » reliée au parcours', () => {
  const d = nouvelle();
  assert.equal(d.application, 'atelier-cereales');
  assert.equal(d.formatVersion, 2);
  assert.deepEqual(d.equipe, { eleves: ['Léa', 'Hugo'], classe: '5A' });
  assert.match(d.creeLe, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
  assert.equal(d.programmation.format, 'labo-blocs/sauvegarde');
  assert.deepEqual(d.programmation.parcours, { id: 'distributeur', version: paquet.versionParcours });
  assert.deepEqual(d.exercices, {});
  assert.ok(d.carnet);
  // La vue par numéro n'est jamais écrite dans le fichier.
  const fichier = JSON.parse(JSON.stringify(d));
  assert.equal('exercices' in fichier, false);
  assert.equal('exercice13' in fichier, false);
});

test('le travail noté par Labo Blocs se lit par numéro (mêmes objets)', () => {
  const d = nouvelle();
  LB.noterOuverture(d, ex('4').id);
  assert.equal(d.exercices['4'].statut, 'en_cours');
  assert.equal(d.exerciceCourant, '4');
  verifier(d, '4', false, 'Quand le bouton D3 est appuyé, la LED D9 devrait être allumée.');
  verifier(d, '4', true);
  const e = d.exercices['4'];
  assert.equal(e, d.programmation.exercices['dist-04']);
  assert.equal(e.tentatives, 2);
  assert.equal(e.statut, 'reussi');
  assert.deepEqual(e.historique.map((h) => [h.type, h.reussi]), [['verification', false], ['verification', true]]);
});

test('déblocage linéaire, 13B après 13A, avancement sur 13, version de l’exercice 13', () => {
  const d = nouvelle();
  assert.equal(P.estDebloque(d, '1'), true);
  assert.equal(P.estDebloque(d, '2'), false);
  for (const n of P.ORDRE_PARCOURS.slice(0, 12)) verifier(d, n, true);
  assert.equal(P.estDebloque(d, '13A'), true);
  assert.equal(P.estDebloque(d, '13B'), false);
  assert.equal(P.avancement(d), 12);
  assert.equal(d.exercice13.versionReussie, null);
  verifier(d, '13A', true);
  assert.equal(d.exercice13.versionReussie, 'A');
  assert.equal(P.estDebloque(d, '13B'), true);
  assert.equal(P.avancement(d), 13);
  verifier(d, '13B', true);
  assert.equal(d.exercice13.versionReussie, 'B');
  assert.equal(P.estDebloque(nouvelle(), '9', { toutDebloquer: true }), true);
});

test('reprise : exercice de la dernière fois, sinon le premier non réussi', () => {
  const d = nouvelle();
  verifier(d, '1', true);
  LB.noterOuverture(d, ex('2').id);
  assert.equal(P.exerciceAReprendre(d), '2');
  d.programmation.exerciceCourant = ex('9').id;
  assert.equal(P.exerciceAReprendre(d), '2');
});

// Sauvegarde de l'atelier d'avant Labo Blocs (format 1) : exercices rangés par numéro.
function ancienne() {
  const e = (statut, tentatives) => ({ statut, tentatives, indicesOuverts: 1, tempsPasseSecondes: 120, premiereReussite: statut === 'reussi' ? '2026-10-12T10:00:00' : null, programme: { blocks: { languageVersion: 0, blocks: [] } }, historique: [{ date: '2026-10-12T10:00:00', type: 'verification', reussi: statut === 'reussi', programme: { demarrage: [], boucle: [] } }] });
  return {
    application: 'atelier-cereales',
    formatVersion: 1,
    equipe: { eleves: ['Léa', 'Hugo'], classe: '5A' },
    creeLe: '2026-10-12T09:00:00',
    modifieLe: '2026-10-12T10:00:00',
    exerciceCourant: '3',
    exercices: { 1: e('reussi', 1), 2: e('reussi', 2), 3: e('en_cours', 4) },
    exercice13: { versionReussie: null },
  };
}

test('ancienne sauvegarde (format 1) : tout le travail est repris, rien n’est perdu', () => {
  const r = P.lireSauvegarde(JSON.stringify(ancienne()));
  assert.equal(r.ok, true);
  const d = r.donnees;
  assert.deepEqual(r.changes, []);
  assert.deepEqual(Object.keys(d.programmation.exercices), ['dist-01', 'dist-02', 'dist-03']);
  assert.equal(d.exercices['2'].tentatives, 2);
  assert.equal(d.exercices['3'].statut, 'en_cours');
  assert.equal(d.exercices['1'].indicesOuverts, 1);
  assert.deepEqual(d.exercices['1'].programme, { blocks: { languageVersion: 0, blocks: [] } });
  assert.equal(d.exercices['1'].historique.at(-1).type, 'migration');
  assert.equal(d.exerciceCourant, '3');
  assert.equal(P.avancement(d), 2);
  assert.equal(P.exerciceAReprendre(d), '3');
  assert.ok(d.carnet, 'carnet vide ajouté');
  // Écrit au format 2, sans l'ancienne rubrique.
  const fichier = JSON.parse(JSON.stringify(d));
  assert.equal(fichier.formatVersion, 2);
  assert.equal('exercices' in fichier, false);
  // Relu : identique.
  const relu = P.lireSauvegarde(JSON.stringify(d));
  assert.equal(relu.ok, true);
  assert.deepEqual(JSON.parse(JSON.stringify(relu.donnees)), fichier);
});

test('exercice modifié par une mise à jour : « à revérifier », blocs et réussite gardés', () => {
  const d = nouvelle();
  verifier(d, '1', true);
  d.programmation.exercices['dist-01'].programme = { blocks: { languageVersion: 0, blocks: [{ type: 'demarrage' }] } };
  d.programmation.exercices['dist-01'].empreinte = 'version-precedente';
  const r = P.lireSauvegarde(JSON.stringify(d));
  assert.deepEqual(r.changes, ['1']);
  assert.deepEqual(r.donnees.exercicesModifies, ['1']);
  const e = r.donnees.exercices['1'];
  assert.equal(e.statut, 'reussi');
  assert.equal(e.aReverifier, true);
  assert.deepEqual(e.programme.blocks.blocks, [{ type: 'demarrage' }]);
  assert.equal(P.estDebloque(r.donnees, '2'), true, 'l’exercice suivant reste ouvert');
  assert.equal('exercicesModifies' in JSON.parse(JSON.stringify(r.donnees)), false);
});

test('données recopiées (programme ouvert depuis l’outil du professeur) : la vue est reposée', () => {
  const d = nouvelle();
  verifier(d, '1', true);
  const copie = P.relierDonnees(JSON.parse(JSON.stringify(d)));
  assert.equal(copie.exercices['1'].statut, 'reussi');
});

test('fichiers refusés sans rien écraser : autre application, version plus récente, illisible', () => {
  assert.equal(P.lireSauvegarde('pas du json').ok, false);
  assert.match(P.lireSauvegarde('{"application":"autre"}').raison, /autre application/);
  assert.match(P.lireSauvegarde('{"application":"atelier-cereales","formatVersion":3,"equipe":{"eleves":[]}}').raison, /plus récente/);
  const d = nouvelle();
  verifier(d, '1', true);
  const r = P.lireSauvegarde('﻿' + JSON.stringify(d));
  assert.equal(r.ok, true);
  assert.equal(r.donnees.exercices['1'].statut, 'reussi');
});
