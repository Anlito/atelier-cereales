// Progression d'une équipe : tout l'état tient dans un seul objet, enregistré dans un fichier .json.
// Pour chaque exercice : statut, tentatives, indices, temps passé, programme, et un historique
// de chaque vérification (avec tous les écarts trouvés) et de chaque indice ouvert, pour le professeur.

(function (global) {
  'use strict';

  const C = typeof module === 'object' && module.exports ? require('./carnet.js') : global.Atelier;

  const APPLICATION = 'atelier-cereales';
  const FORMAT = 1;
  const ORDRE = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13A', '13B'];

  // Date et heure locales, au format du brief : 2026-10-12T09:03:00
  function maintenant() {
    const d = new Date();
    const deux = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}T${deux(d.getHours())}:${deux(d.getMinutes())}:${deux(d.getSeconds())}`;
  }

  const prenom = (p) => {
    const t = String(p).trim();
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  // « Léa », « hugo » → « Léa_Hugo » (nom du dossier et du fichier de l'équipe).
  function nomEquipe(eleves) {
    return eleves
      .map((p) =>
        String(p)
          .trim()
          .replace(/[\\/:*?"<>|.]+/g, '')
          .replace(/\s+/g, '-'),
      )
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('_');
  }

  // Pour comparer des noms de dossier sans tenir compte des accents, majuscules et séparateurs.
  function simplifier(nom) {
    return String(nom)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  function creer(equipe) {
    const date = maintenant();
    return {
      application: APPLICATION,
      formatVersion: FORMAT,
      equipe: { eleves: equipe.eleves.map(prenom).filter(Boolean), classe: equipe.classe || '' },
      creeLe: date,
      modifieLe: date,
      exerciceCourant: ORDRE[0],
      exercices: {},
      exercice13: { versionReussie: null },
      carnet: C.carnetVide(),
    };
  }

  // Vérifie un fichier ouvert par l'équipe. Rien n'est modifié si le fichier est refusé.
  function lire(texte) {
    let d;
    try {
      d = JSON.parse(String(texte).replace(/^﻿/, ''));
    } catch {
      return { ok: false, raison: 'Ce fichier n’est pas une sauvegarde de l’atelier : il est illisible.' };
    }
    if (!d || d.application !== APPLICATION) {
      return { ok: false, raison: 'Ce fichier vient d’une autre application : ce n’est pas une sauvegarde de l’atelier.' };
    }
    if (typeof d.formatVersion !== 'number' || d.formatVersion > FORMAT) {
      return { ok: false, raison: 'Cette sauvegarde vient d’une version plus récente de l’atelier : demande à ton professeur.' };
    }
    if (!d.equipe || !Array.isArray(d.equipe.eleves)) return { ok: false, raison: 'Cette sauvegarde est incomplète : il manque l’équipe.' };
    d.exercices = d.exercices || {};
    d.exercice13 = d.exercice13 || { versionReussie: null };
    // Sauvegardes d'avant le carnet de projet : on ajoute un carnet vide.
    d.carnet = C.completerCarnet(d.carnet);
    for (const e of Object.values(d.exercices)) e.historique = e.historique || [];
    return { ok: true, donnees: d };
  }

  function exercice(d, id) {
    if (!d.exercices[id]) {
      d.exercices[id] = {
        statut: 'non_commence',
        tentatives: 0,
        indicesOuverts: 0,
        tempsPasseSecondes: 0,
        premiereReussite: null,
        programme: null,
        historique: [],
      };
    }
    return d.exercices[id];
  }

  const modifie = (d) => (d.modifieLe = maintenant());

  function noterOuverture(d, id) {
    const e = exercice(d, id);
    if (e.statut === 'non_commence') e.statut = 'en_cours';
    d.exerciceCourant = id;
    modifie(d);
  }

  function noterProgramme(d, id, programme) {
    exercice(d, id).programme = programme;
    modifie(d);
  }

  // Programme simplifié sans les identifiants des blocs (plus court, lisible par le professeur).
  function sansIds(programme) {
    return programme ? JSON.parse(JSON.stringify(programme, (k, v) => (k === 'id' ? undefined : v))) : null;
  }

  // Chaque clic sur « Vérifier mon programme » est une tentative, gardée dans l'historique.
  //   resultat : { reussi, message, ecarts: [messages de tous les scénarios ratés], notes: [...], programme }
  function noterVerification(d, id, resultat) {
    const e = exercice(d, id);
    const date = maintenant();
    e.tentatives += 1;
    const trace = { date, type: 'verification', reussi: !!resultat.reussi };
    if (!resultat.reussi) {
      trace.message = resultat.message || '';
      trace.ecarts = resultat.ecarts || (resultat.message ? [resultat.message] : []);
      if (resultat.notes && resultat.notes.length) trace.notes = resultat.notes;
    }
    trace.programme = sansIds(resultat.programme);
    e.historique.push(trace);
    if (resultat.reussi) {
      e.statut = 'reussi';
      if (!e.premiereReussite) e.premiereReussite = date;
      if (id === '13B') d.exercice13.versionReussie = 'B';
      else if (id === '13A' && d.exercice13.versionReussie !== 'B') d.exercice13.versionReussie = 'A';
    } else if (e.statut === 'non_commence') e.statut = 'en_cours';
    modifie(d);
  }

  // Indices révélés un par un : on garde le plus haut niveau ouvert et chaque ouverture.
  function noterIndice(d, id, niveau) {
    const e = exercice(d, id);
    if (niveau <= e.indicesOuverts) return;
    e.indicesOuverts = niveau;
    e.historique.push({ date: maintenant(), type: 'indice', niveau });
    modifie(d);
  }

  function ajouterTemps(d, id, secondes) {
    exercice(d, id).tempsPasseSecondes += secondes;
  }

  const reussi = (d, id) => !!(d.exercices[id] && d.exercices[id].statut === 'reussi');

  // Déblocage linéaire : l'exercice N+1 s'ouvre quand le N est réussi (13B après 13A).
  function estDebloque(d, id, options) {
    if (options && options.toutDebloquer) return true;
    const i = ORDRE.indexOf(String(id));
    if (i <= 0) return i === 0;
    return reussi(d, ORDRE[i - 1]);
  }

  // Exercice à ouvrir en reprenant : celui de la dernière fois s'il est ouvert et pas encore réussi,
  // sinon le premier exercice ouvert non réussi.
  function aReprendre(d) {
    if (d.exerciceCourant && estDebloque(d, d.exerciceCourant) && !reussi(d, d.exerciceCourant)) return d.exerciceCourant;
    return ORDRE.find((id) => estDebloque(d, id) && !reussi(d, id)) || ORDRE[ORDRE.length - 1];
  }

  // Avancement affiché : 13 exercices (13A suffit pour le dernier).
  function avancement(d) {
    let n = 0;
    for (const id of ORDRE.slice(0, 12)) if (reussi(d, id)) n++;
    if (reussi(d, '13A') || reussi(d, '13B')) n++;
    return n;
  }

  const api = {
    APPLICATION,
    FORMAT,
    ORDRE_PARCOURS: ORDRE,
    nomEquipe,
    simplifierNom: simplifier,
    creerProgression: creer,
    lireSauvegarde: lire,
    progressionExercice: exercice,
    noterOuverture,
    noterProgramme,
    noterVerification,
    noterIndice,
    ajouterTemps,
    estDebloque,
    exerciceAReprendre: aReprendre,
    avancement,
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.Atelier = global.Atelier || {}), api);
})(this);
