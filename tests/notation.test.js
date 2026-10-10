const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const P = require('../site/js/moteur/progression.js');
const N = require('../site/js/moteur/notation.js');

const ORDRE13 = P.ORDRE_PARCOURS.slice(0, 13);
const equipe = () => P.creerProgression({ eleves: ['Léa', 'Hugo'], classe: '5A' });

test('tout réussi sans aide : 20/20, et le bonus 13B ne dépasse pas 20', () => {
  const d = equipe();
  for (const id of ORDRE13) P.noterVerification(d, id, { reussi: true });
  assert.equal(N.noterEquipe(d).note, 20);
  P.noterVerification(d, '13B', { reussi: true });
  assert.equal(N.noterEquipe(d).note, 20);
});

test('rien fait : 0 ; commencé sans réussir : participation', () => {
  const d = equipe();
  assert.equal(N.noterEquipe(d).note, 0);
  P.noterVerification(d, '1', { reussi: false, message: 'm' });
  const r = N.noterEquipe(d, { arrondi: 0 });
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
  const e4 = N.noterEquipe(d).detail.find((x) => x.id === '4');
  // 2 indices (−20 %) + 4 échecs dont 2 gratuits (−10 %)
  assert.ok(Math.abs(e4.fraction - 0.7) < 1e-9);
  assert.equal(e4.raisons.length, 2);
  // Les retenues sont plafonnées : il reste au moins 45 %.
  const d2 = equipe();
  for (let n = 1; n <= 3; n++) P.noterIndice(d2, '4', n);
  for (let i = 0; i < 20; i++) P.noterVerification(d2, '4', { reussi: false, message: 'm' });
  P.noterVerification(d2, '4', { reussi: true });
  assert.ok(Math.abs(N.noterEquipe(d2).detail.find((x) => x.id === '4').fraction - 0.45) < 1e-9);
});

test('barème réglable : coefficients, arrondi, note sur 10', () => {
  const d = equipe();
  P.noterVerification(d, '1', { reussi: true });
  const seul1 = { coefficients: Object.fromEntries(ORDRE13.map((id) => [id, id === '1' ? 1 : 0])) };
  assert.equal(N.noterEquipe(d, seul1).note, 20);
  assert.equal(N.noterEquipe(d, { ...seul1, sur: 10 }).note, 5 * 2);
  assert.equal(N.noterEquipe(d, { arrondi: 0.5 }).note % 0.5, 0);
});

test('le fichier donnees/notation.js est complet et égal au barème par défaut', () => {
  let bareme;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'site', 'donnees', 'notation.js'), 'utf8'), {
    definirBareme: (b) => (bareme = b),
  });
  assert.deepEqual(JSON.parse(JSON.stringify(bareme)), JSON.parse(JSON.stringify(N.BAREME_DEFAUT)));
});
