const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const P = require('../site/js/moteur/progression.js');
const N = require('../site/js/moteur/notation.js');

const ORDRE13 = P.ORDRE_PARCOURS.slice(0, 13);
// Tests de la programmation seule : le carnet ne compte pas.
const SC = { carnet: { classement: 0, mouvement: 0, trappe: 0 } };
const equipe = () => P.creerProgression({ eleves: ['Léa', 'Hugo'], classe: '5A' });

test('tout réussi sans aide : 20/20, et le bonus 13B ne dépasse pas 20', () => {
  const d = equipe();
  for (const id of ORDRE13) P.noterVerification(d, id, { reussi: true });
  assert.equal(N.noterEquipe(d, SC).note, 20);
  P.noterVerification(d, '13B', { reussi: true });
  assert.equal(N.noterEquipe(d, SC).note, 20);
});

test('rien fait : 0 ; commencé sans réussir : participation', () => {
  const d = equipe();
  assert.equal(N.noterEquipe(d, SC).note, 0);
  P.noterVerification(d, '1', { reussi: false, message: 'm' });
  const r = N.noterEquipe(d, { ...SC, arrondi: 0 });
  const total = Object.values(N.BAREME_DEFAUT.coefficients).reduce((a, b) => a + b, 0);
  assert.equal(r.note, Math.round(((20 * 0.2 * 1) / total) * 100) / 100);
  assert.match(r.detail[0].raisons[0], /commencé/);
});

test('retenues d’autonomie : indices et essais ratés avant la réussite seulement', () => {
  const d = equipe();
  P.noterIndice(d, '4', 1);
  P.noterIndice(d, '4', 2);
  for (let i = 0; i < 4; i++) P.noterVerification(d, '4', { reussi: false, message: 'm' });
  P.noterVerification(d, '4', { reussi: true });
  // Après la réussite : ni l'indice 3 ni un nouvel échec ne comptent.
  P.noterIndice(d, '4', 3);
  P.noterVerification(d, '4', { reussi: false, message: 'm' });
  const e4 = N.noterEquipe(d, SC).detail.find((x) => x.id === '4');
  // 2 indices (−20 %) + 4 essais ratés (−20 %)
  assert.ok(Math.abs(e4.fraction - 0.6) < 1e-9);
  assert.equal(e4.raisons.length, 2);
  // Les retenues sont plafonnées : il reste au moins 45 %.
  const d2 = equipe();
  for (let n = 1; n <= 3; n++) P.noterIndice(d2, '4', n);
  for (let i = 0; i < 20; i++) P.noterVerification(d2, '4', { reussi: false, message: 'm' });
  P.noterVerification(d2, '4', { reussi: true });
  assert.ok(Math.abs(N.noterEquipe(d2, SC).detail.find((x) => x.id === '4').fraction - 0.45) < 1e-9);
});

test('du premier coup et sans indice : tous les points, et compté à part', () => {
  const d = equipe();
  P.noterVerification(d, '1', { reussi: true });
  P.noterVerification(d, '2', { reussi: false, message: 'm' });
  P.noterVerification(d, '2', { reussi: true });
  P.noterIndice(d, '3', 1);
  P.noterVerification(d, '3', { reussi: true });
  const r = N.noterEquipe(d, SC);
  const ex = (id) => r.detail.find((x) => x.id === id);
  assert.equal(ex('1').fraction, 1);
  assert.equal(ex('1').parfait, true);
  assert.match(ex('1').raisons[0], /premier coup/);
  assert.ok(Math.abs(ex('2').fraction - 0.95) < 1e-9, 'un essai raté : −5 %');
  assert.ok(Math.abs(ex('3').fraction - 0.9) < 1e-9, 'un indice : −10 %');
  assert.deepEqual(N.premierCoup(d), ['1']);
  // Avec des essais gratuits, l'ancien comportement reste possible.
  assert.equal(N.noterEquipe(d, { ...SC, essaisGratuits: 2 }).detail.find((x) => x.id === '2').fraction, 1);
});

test('barème réglable : coefficients, arrondi, note sur 10', () => {
  const d = equipe();
  P.noterVerification(d, '1', { reussi: true });
  const seul1 = { coefficients: Object.fromEntries(ORDRE13.map((id) => [id, id === '1' ? 1 : 0])) };
  assert.equal(N.noterEquipe(d, { ...SC, ...seul1 }).note, 20);
  assert.equal(N.noterEquipe(d, { ...SC, ...seul1, sur: 10 }).note, 5 * 2);
  assert.equal(N.noterEquipe(d, { ...SC, arrondi: 0.5 }).note % 0.5, 0);
});

test('le fichier donnees/notation.js est complet et égal au barème par défaut', () => {
  let bareme;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'site', 'donnees', 'notation.js'), 'utf8'), {
    definirBareme: (b) => (bareme = b),
  });
  assert.deepEqual(JSON.parse(JSON.stringify(bareme)), JSON.parse(JSON.stringify(N.BAREME_DEFAUT)));
});

test('note évolutive : calculée sur les N exercices attendus', () => {
  const d = equipe();
  for (const id of ['1', '2', '3']) P.noterVerification(d, id, { reussi: true });
  assert.equal(N.noterEquipe(d, { ...SC, objectif: 3 }).note, 20);
  assert.ok(N.noterEquipe(d, { ...SC, objectif: 6 }).note < 20);
  P.noterVerification(d, '5', { reussi: false, message: 'm' });
  const r = N.noterEquipe(d, { ...SC, objectif: 4, arrondi: 0 });
  assert.ok(r.note < 20, 'exercice 4 attendu mais pas fait');
  assert.equal(r.detail.find((x) => x.id === '5').points, 0, 'commencé au-delà de l’objectif : rien');
  P.noterVerification(d, '4', { reussi: true });
  P.noterVerification(d, '5', { reussi: true });
  assert.equal(N.noterEquipe(d, { ...SC, objectif: 4 }).note, 20);
  assert.equal(N.noterEquipe(d, { ...SC, objectif: 4 }).detail.find((x) => x.id === '5').points, 0, 'en avance : ne compte pas par défaut');
  assert.ok(N.noterEquipe(d, { ...SC, objectif: 4, avance: 0.5 }).detail.find((x) => x.id === '5').points > 0, 'bonus d’avance si réglé');
});

test('l’avance ne compense pas les erreurs sur le travail attendu (cas Lucas / Tom)', () => {
  // Lucas : 1 et 2 du premier coup. Tom : 1 du premier coup, 2 après 3 essais ratés, 3 réussi en avance.
  const lucas = equipe();
  P.noterVerification(lucas, '1', { reussi: true });
  P.noterVerification(lucas, '2', { reussi: true });
  const tom = equipe();
  P.noterVerification(tom, '1', { reussi: true });
  for (let i = 0; i < 3; i++) P.noterVerification(tom, '2', { reussi: false, message: 'm' });
  P.noterVerification(tom, '2', { reussi: true });
  for (let i = 0; i < 2; i++) P.noterVerification(tom, '3', { reussi: false, message: 'm' });
  P.noterVerification(tom, '3', { reussi: true });
  const b = { objectif: 2 };
  assert.equal(N.noterEquipe(lucas, { ...SC, ...b }).note, 20);
  assert.equal(N.noterEquipe(tom, { ...SC, ...b }).note, 18.5);
});

test('carnet : classement et algorigrammes 1 et 2 notés, problématique et algorigramme final non notés', () => {
  const C = require('../site/js/moteur/carnet.js');
  const d = equipe();
  const seulCarnet = { coefficients: Object.fromEntries(ORDRE13.map((id) => [id, 0])), arrondi: 0 };
  assert.equal(N.noterEquipe(d, seulCarnet).note, 0);
  // Classement réussi du premier coup, algorigramme 1 après 3 vérifications ratées, algorigramme 2 commencé.
  C.noterVerificationCarnet(d, 'classement', { reussi: true, bien: 15, total: 15 });
  for (let i = 0; i < 3; i++) C.noterVerificationCarnet(d, 'mouvement', { reussi: false, bien: 3, total: 5 });
  C.noterVerificationCarnet(d, 'mouvement', { reussi: true, bien: 5, total: 5 });
  C.noterVerificationCarnet(d, 'trappe', { reussi: false, bien: 2, total: 5 });
  C.noterVerificationCarnet(d, 'final', { reussi: true, bien: 18, total: 18 });
  const r = N.noterEquipe(d, seulCarnet);
  const p = (x) => r.detail.find((y) => y.id === 'carnet:' + x);
  assert.equal(p('classement').fraction, 1);
  assert.match(p('classement').raisons[0], /premier coup/);
  assert.ok(Math.abs(p('mouvement').fraction - 0.85) < 1e-9, '3 vérifications ratées : −15 %');
  assert.equal(p('trappe').fraction, 0.2);
  assert.equal(p('final'), undefined, 'algorigramme du distributeur non noté');
  assert.ok(Math.abs(r.note - (20 * (1 + 0.85 + 0.2)) / 3) < 0.01);
  // Coefficient 0 : la partie ne compte plus.
  assert.equal(N.noterEquipe(d, { ...seulCarnet, carnet: { trappe: 0 } }).detail.some((x) => x.id === 'carnet:trappe'), false);
});
