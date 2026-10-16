// Outils communs aux tests : chargement des exercices et petits constructeurs de programmes.
const { catalogue } = require('../site/js/moteur/catalogue.js');

// Exercices du parcours de Labo Blocs (site/parcours/distributeur.js), au format de l'atelier (id = numéro).
function chargerExercices() {
  return catalogue.exercices();
}

// Constructeurs d'instructions et d'expressions.
const led = (broche, etat) => ({ bloc: 'led_etat', broche, etat });
const att = (duree) => ({ bloc: 'attendre', duree });
const servo = (broche, angle) => ({ bloc: 'servo_angle', broche, angle });
const choix = (valeur) => ({ bloc: 'affecter', variable: 'CHOIX', valeur });
const CHOIX = { bloc: 'variable', variable: 'CHOIX' };
const egal = (a, b) => ({ bloc: 'comparaison', op: '=', a, b });
const different = (a, b) => ({ bloc: 'comparaison', op: '≠', a, b });
const bouton = (broche) => ({ bloc: 'bouton_etat', broche });
const HAUT = { bloc: 'valeur_haut_bas', valeur: 1 };
const BAS = { bloc: 'valeur_haut_bas', valeur: 0 };
const appuye = (broche) => egal(bouton(broche), HAUT);
const si = (condition, alors) => ({ bloc: 'si_alors', condition, alors });
const siSinon = (condition, alors, sinon) => ({ bloc: 'si_sinon', condition, alors, sinon });
const prog = (demarrage, boucle) => ({ demarrage: demarrage || [], boucle: boucle || [] });

// Réglages du parcours (durées des doses, boutons vers la masse).
function chargerParametres() {
  const paquet = catalogue.paquet();
  return Object.assign({ boutonsVersMasse: paquet.boutonsVersMasse !== false }, paquet.parametres);
}

module.exports = {
  chargerExercices,
  chargerParametres,
  led,
  att,
  servo,
  choix,
  CHOIX,
  egal,
  different,
  bouton,
  HAUT,
  BAS,
  appuye,
  si,
  siSinon,
  prog,
};
