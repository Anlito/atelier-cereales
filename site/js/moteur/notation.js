// Note de l'équipe sur l'ensemble des exercices, d'après son travail (fichier de sauvegarde).
// Le barème est réglable (donnees/notation.js et panneau « Barème » de prof.html).
//
// Pour chaque exercice (coefficient selon sa difficulté) :
//   - réussi : 100 % des points, moins des retenues d'autonomie, calculées AVANT la première réussite :
//       indices ouverts (penaliteIndice chacun, au plus penaliteIndiceMax),
//       vérifications ratées au-delà des essais gratuits (penaliteEchec chacune, au plus penaliteEchecMax) ;
//   - commencé (au moins une vérification) mais pas réussi : « participation » % des points ;
//   - non commencé : 0.
// Note = sur × points obtenus / points possibles, + bonus si 13B est réussi, sans dépasser « sur ».

(function (global) {
  'use strict';

  const BAREME = {
    sur: 20,
    // Exercices attendus à ce moment du projet (les N premiers) : la note est calculée sur eux ;
    // ceux réussis au-delà rapportent leurs points en bonus. 13 = tout le parcours.
    objectif: 13,
    coefficients: { 1: 1, 2: 1, 3: 1, 4: 1.5, 5: 1.5, 6: 1.5, 7: 1.5, 8: 2, 9: 1, 10: 1, 11: 1.5, 12: 1.5, '13A': 3 },
    bonus13B: 1,
    participation: 0.2,
    penaliteIndice: 0.1,
    penaliteIndiceMax: 0.3,
    essaisGratuits: 2,
    penaliteEchec: 0.05,
    penaliteEchecMax: 0.25,
    arrondi: 0.5,
  };

  function completer(bareme) {
    const b = Object.assign({}, BAREME, bareme || {});
    b.coefficients = Object.assign({}, BAREME.coefficients, (bareme && bareme.coefficients) || {});
    return b;
  }

  const pourcent = (x) => Math.round(x * 100) + ' %';

  // Indices et vérifications ratées avant la première réussite (ce qui s'est passé après ne compte pas).
  function avantReussite(e) {
    const histo = (e && e.historique) || [];
    let indices = 0;
    let echecs = 0;
    for (const h of histo) {
      if (h.type === 'verification' && h.reussi) break;
      if (h.type === 'indice') indices = Math.max(indices, h.niveau || indices + 1);
      if (h.type === 'verification') echecs++;
    }
    return { indices, echecs };
  }

  function noterExercice(e, b) {
    const statut = e ? e.statut : 'non_commence';
    if (statut === 'reussi') {
      const { indices, echecs } = avantReussite(e);
      const rIndices = Math.min(b.penaliteIndiceMax, indices * b.penaliteIndice);
      const rEchecs = Math.min(b.penaliteEchecMax, Math.max(0, echecs - b.essaisGratuits) * b.penaliteEchec);
      const raisons = [];
      if (rIndices > 0) raisons.push(`${indices} indice${indices > 1 ? 's' : ''} (−${pourcent(rIndices)})`);
      if (rEchecs > 0) raisons.push(`${echecs} essais ratés avant la réussite (−${pourcent(rEchecs)})`);
      return { fraction: Math.max(0, 1 - rIndices - rEchecs), raisons: raisons.length ? raisons : ['réussi en autonomie'] };
    }
    if (e && e.tentatives > 0) return { fraction: b.participation, raisons: [`commencé, pas encore réussi (${pourcent(b.participation)})`] };
    return { fraction: 0, raisons: [statut === 'en_cours' ? 'ouvert, jamais vérifié' : 'non commencé'] };
  }

  function arrondir(x, pas) {
    return pas > 0 ? Math.round(x / pas) * pas : Math.round(x * 100) / 100;
  }

  // donnees : la sauvegarde d'une équipe → { note, sur, detail, bonus }
  function noter(donnees, bareme) {
    const b = completer(bareme);
    const detail = [];
    let obtenu = 0;
    let possible = 0;
    const ordre = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13A'];
    const attendus = new Set(ordre.slice(0, Math.max(1, Math.min(13, Math.round(b.objectif) || 13))));
    for (const [id, coef] of Object.entries(b.coefficients)) {
      if (!(coef > 0)) continue;
      const r = noterExercice(donnees.exercices[id], b);
      const attendu = attendus.has(id);
      // Au-delà de l'objectif : seul un exercice réussi rapporte des points (en bonus).
      const fraction = attendu || donnees.exercices[id]?.statut === 'reussi' ? r.fraction : 0;
      detail.push({ id, coef, attendu, fraction, points: fraction * coef, raisons: attendu ? r.raisons : [fraction ? 'en avance : bonus' : 'pas encore attendu'] });
      obtenu += fraction * coef;
      if (attendu) possible += coef;
    }
    const e13B = donnees.exercices['13B'];
    const bonus = e13B && e13B.statut === 'reussi' ? b.bonus13B : 0;
    const brute = possible ? (b.sur * obtenu) / possible : 0;
    const note = Math.min(b.sur, arrondir(brute + bonus, b.arrondi));
    // Points de chaque exercice ramenés sur la note (ex. 1,4 / 1,5 point).
    for (const d of detail) {
      d.pointsNote = possible ? (b.sur * d.points) / possible : 0;
      d.pointsNoteMax = possible && d.attendu ? (b.sur * d.coef) / possible : 0;
    }
    return { note, sur: b.sur, detail, bonus, brute };
  }

  const nombreFr = (x, decimales) => String(Math.round(x * 10 ** (decimales || 1)) / 10 ** (decimales || 1)).replace('.', ',');

  const api = { BAREME_DEFAUT: BAREME, completerBareme: completer, noterEquipe: noter, nombreFr };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.Atelier = global.Atelier || {}), api);
})(this);
