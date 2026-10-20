// Code Arduino du niveau 3 (panneau « Code ») : traduction des blocs du distributeur en C++.
// (Le programme de l'élève part dans la carte en code octet : voir le module Labo Blocs, mode « Dans la carte ».)
const test = require('node:test');
const assert = require('node:assert/strict');
// Générateur C++ de Labo Blocs (le même que le panneau « Code » du niveau 3).
const LB = require(require('../tools/dependances-tests.js').noyau);
const versArduino = (programme, options) => LB.versArduino(programme, options).code;
const { chargerExercices } = require('./outils.js');

const exercices = chargerExercices();

test('13A traduit en Arduino : broches du câblage, CHOIX, trappe fermée au démarrage', () => {
  const c = versArduino(exercices.find((e) => e.id === '13A').solutionReference);
  for (const n of [9, 10, 11]) assert.match(c, new RegExp(`pinMode\\(${n}, OUTPUT\\)`));
  // Boutons poussoirs à 2 fils (signal + GND) : résistance interne, appuyé = masse, traduit en HAUT.
  for (const n of [3, 4, 5]) assert.match(c, new RegExp(`pinMode\\(${n}, INPUT_PULLUP\\)`));
  assert.match(c, /return digitalRead\(broche\) == LOW \? HIGH : LOW;/);
  const module = versArduino(exercices.find((e) => e.id === '13A').solutionReference, { boutonsVersMasse: false });
  assert.match(module, /pinMode\(3, INPUT\);/);
  assert.match(module, /return digitalRead\(broche\);/);
  assert.match(c, /#include <Servo\.h>/);
  // L'angle de départ (90°, trappe fermée) est réglé avant d'activer le servo : pas d'à-coup à 0°.
  assert.ok(c.indexOf('servo6.write(90);') < c.indexOf('servo6.attach(6);'));
  assert.match(c, /if \(\(bouton\(5\) == HIGH\)\)/);
  assert.match(c, /attendre\(CHOIX\);/);
  assert.match(c, /CHOIX = 7;/);
  assert.match(c, /delay\(1\);\n\}\n$/);
});

test('13B : le test CHOIX ≠ 0 et la remise à zéro', () => {
  const c = versArduino(exercices.find((e) => e.id === '13B').solutionReference);
  assert.match(c, /if \(\(CHOIX != 0\)\)/);
  assert.match(c, /CHOIX = 0;\n\s*\}/);
});
