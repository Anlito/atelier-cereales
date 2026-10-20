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
    // Exercice réussi au-delà des exercices attendus : part de ses points ajoutée en bonus.
    // 0 par défaut, pour que l'avance ne masque pas les erreurs faites sur le travail attendu.
    avance: 0,
    coefficients: { 1: 1, 2: 1, 3: 1, 4: 1.5, 5: 1.5, 6: 1.5, 7: 1.5, 8: 2, 9: 1, 10: 1, 11: 1.5, 12: 1.5, '13A': 3 },
    bonus13B: 1,
    participation: 0.2,
    penaliteIndice: 0.1,
    penaliteIndiceMax: 0.3,
    essaisGratuits: 0,
    penaliteEchec: 0.05,
    penaliteEchecMax: 0.25,
    arrondi: 0.5,
    // Exercices du carnet de projet notés (coefficient) ; la problématique et l'algorigramme du
    // distributeur ne sont pas notés (le professeur voit quand même leur travail).
    carnet: { classement: 1, mouvement: 1, trappe: 1 },
  };
  const NOMS_CARNET = { classement: 'Carnet · classement', mouvement: 'Carnet · algorigramme 1', trappe: 'Carnet · algorigramme 2' };

  function completer(bareme) {
    const b = Object.assign({}, BAREME, bareme || {});
    b.coefficients = Object.assign({}, BAREME.coefficients, (bareme && bareme.coefficients) || {});
    b.carnet = Object.assign({}, BAREME.carnet, (bareme && bareme.carnet) || {});
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
      if (rEchecs > 0) raisons.push(`${echecs} essai${echecs > 1 ? 's' : ''} raté${echecs > 1 ? 's' : ''} avant la réussite (−${pourcent(rEchecs)})`);
      const parfait = indices === 0 && echecs === 0;
      if (!raisons.length) raisons.push(parfait ? '★ du premier coup, sans indice' : 'réussi en autonomie');
      return { fraction: Math.max(0, 1 - rIndices - rEchecs), raisons, parfait };
    }
    if (e && e.tentatives > 0) return { fraction: b.participation, raisons: [`commencé, pas encore réussi (${pourcent(b.participation)})`] };
    return { fraction: 0, raisons: [statut === 'en_cours' ? 'ouvert, jamais vérifié' : 'non commencé'] };
  }

  // Partie du carnet : d'après les vérifications gardées dans le fichier ({ date, reussi, bien, total }).
  function noterPartieCarnet(donnees, partie, b) {
    const automatiques = ['classement','mouvement','trappe','final'];
    if (!automatiques.includes(partie)) {
      const niveau = (donnees.evaluationsProf || {})[partie];
      if (![1,2,3,4].includes(niveau)) return {fraction:0,raisons:['À évaluer : hors du total'],nonEvalue:true};
      return {fraction:niveau / 4, raisons:[['Non atteint','Partiellement atteint','Atteint','Dépassé'][niveau-1] + ' (' + niveau + '/4)'],parfait:false};
    }
    const v = ((donnees.carnet && donnees.carnet.verifications) || {})[partie] || [];
    const premiere = v.findIndex((x) => x.reussi);
    if (premiere >= 0) {
      const echecs = premiere;
      const rEchecs = Math.min(b.penaliteEchecMax, Math.max(0, echecs - b.essaisGratuits) * b.penaliteEchec);
      const raisons = rEchecs > 0
        ? [`${echecs} vérification${echecs > 1 ? 's' : ''} ratée${echecs > 1 ? 's' : ''} avant la réussite (−${pourcent(rEchecs)})`]
        : [echecs === 0 ? '★ réussi du premier coup' : 'réussi'];
      return { fraction: 1 - rEchecs, raisons, parfait: echecs === 0 };
    }
    if (v.length) return { fraction: b.participation, raisons: [`commencé, pas encore réussi (${pourcent(b.participation)})`] };
    return { fraction: 0, raisons: ['non commencé'] };
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
      // Au-delà de l'objectif : un exercice réussi rapporte seulement la part « avance » de ses points (0 par défaut).
      const enAvance = !attendu && donnees.exercices[id] && donnees.exercices[id].statut === 'reussi';
      const fraction = attendu ? r.fraction : enAvance ? r.fraction * b.avance : 0;
      const raisons = attendu
        ? r.raisons
        : enAvance
          ? [b.avance > 0 ? `réussi en avance : bonus (${pourcent(b.avance)})` : 'réussi en avance (ne compte pas dans la note)']
          : ['pas encore attendu'];
      detail.push({ id, coef, attendu, fraction, parfait: !!r.parfait, points: fraction * coef, raisons });
      obtenu += fraction * coef;
      if (attendu) possible += coef;
    }
    // Exercices du carnet : même principe (réussi = tous les points moins les vérifications ratées avant).
    for (const [partie, coef] of Object.entries(b.carnet)) {
      if (!(coef > 0)) continue;
      const r = noterPartieCarnet(donnees, partie, b);
      if (r.nonEvalue) continue;
      detail.push({ id: 'carnet:' + partie, carnet: true, partie, nom: NOMS_CARNET[partie] || partie, coef, attendu: true, ...r, points: r.fraction * coef });
      obtenu += r.fraction * coef;
      possible += coef;
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

  // Exercices réussis du premier coup et sans indice (pour les valoriser dans l'outil professeur).
  function premierCoup(donnees) {
    return Object.keys(donnees.exercices).filter((id) => {
      const e = donnees.exercices[id];
      if (!e || e.statut !== 'reussi') return false;
      const r = avantReussite(e);
      return r.indices === 0 && r.echecs === 0;
    });
  }

  const api = { BAREME_DEFAUT: BAREME, completerBareme: completer, noterEquipe: noter, nombreFr, premierCoup };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.Atelier = global.Atelier || {}), api);
})(this);
