const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../site/js/moteur/progression.js');
const C = require('../site/js/moteur/carnet.js');
const Classe = require('../site/js/moteur/classe.js');

test('la définition saisie après Vérifier reste liée au fichier et remonte côté professeur', () => {
  const d = P.creerProgression({eleves:['Test'],classe:'5A'});
  const carnetEcran = d.carnet;
  C.noterVerificationCarnet(d, 'classement', {reussi:false,bien:1,total:15});
  assert.strictEqual(d.carnet, carnetEcran);
  carnetEcran.definition = 'Un objet technique est fabriqué pour répondre à un besoin.';
  carnetEcran.idees[0] = 'Un distributeur automatique';
  C.noterVerificationCarnet(d, 'mouvement', {reussi:true,bien:5,total:5});
  carnetEcran.definition += ' Il est conçu par les humains.';
  const lu = Classe.fusionnerEquipes([{nom:'Test.json',texte:JSON.stringify(d)}]).equipes[0].donnees;
  assert.equal(lu.carnet.definition, carnetEcran.definition);
  assert.equal(lu.carnet.idees[0], carnetEcran.idees[0]);
  assert.equal(lu.carnet.verifications.classement.length,1);
  assert.equal(lu.carnet.verifications.mouvement.length,1);
});
