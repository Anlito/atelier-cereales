// Programme envoyé dans la vraie carte : traduction des blocs en C++ et programmes compilés.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { versArduino } = require('../site/js/moteur/arduino.js');
const { chargerExercices } = require('./outils.js');

const exercices = chargerExercices();

test('13A traduit en Arduino : broches du câblage, CHOIX, trappe fermée au démarrage', () => {
  const c = versArduino(exercices.find((e) => e.id === '13A').solutionReference);
  for (const n of [9, 10, 11]) assert.match(c, new RegExp(`pinMode\\(${n}, OUTPUT\\)`));
  for (const n of [3, 4, 5]) assert.match(c, new RegExp(`pinMode\\(${n}, INPUT\\)`));
  assert.match(c, /#include <Servo\.h>/);
  // L'angle de départ (90°, trappe fermée) est réglé avant d'activer le servo : pas d'à-coup à 0°.
  assert.ok(c.indexOf('servo6.write(90);') < c.indexOf('servo6.attach(6);'));
  assert.match(c, /if \(\(digitalRead\(5\) == HIGH\)\)/);
  assert.match(c, /attendre\(CHOIX\);/);
  assert.match(c, /CHOIX = 7;/);
  assert.match(c, /delay\(1\);\n\}\n$/);
});

test('13B : le test CHOIX ≠ 0 et la remise à zéro', () => {
  const c = versArduino(exercices.find((e) => e.id === '13B').solutionReference);
  assert.match(c, /if \(\(CHOIX != 0\)\)/);
  assert.match(c, /CHOIX = 0;\n\s*\}/);
});

test('programmes compilés présents et lisibles par le module d’envoi (Intel HEX)', () => {
  const contexte = { navigator: {} };
  contexte.globalThis = contexte;
  vm.createContext(contexte);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'site', 'js', 'flasher.js'), 'utf8'), contexte);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'site', 'firmware', 'programmes.js'), 'utf8'), contexte);
  const { flasher, programmesCarte } = contexte.Atelier;
  for (const v of ['13A', '13B']) {
    const image = flasher.parseHex(programmesCarte[v]);
    assert.ok(image.length > 1000 && image.length < 32256, `${v} : ${image.length} octets`);
  }
  // Le programme compilé correspond au programme actuel (sinon : npm run firmware).
  for (const v of ['13A', '13B']) {
    const ino = fs.readFileSync(path.join(__dirname, '..', 'site', 'firmware', `distributeur_${v}.ino`), 'utf8');
    const ex = exercices.find((e) => e.id === v);
    assert.equal(ino, versArduino(ex.solutionReference, { titre: `Distributeur de céréales — exercice ${v} (${ex.titre})` }), `${v} à recompiler`);
  }
});
