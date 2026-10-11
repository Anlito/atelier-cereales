// Carnet de projet : état dans le fichier de l'équipe, corrections et avancement.
// Les réponses de l'équipe sont gardées par TEXTE (et non par position dans une liste), pour qu'une
// correction du fichier donnees/carnet.js par le professeur ne mélange pas les réponses.

(function (global) {
  'use strict';

  const PARTIES = ['idees', 'definition', 'classement', 'mouvement', 'trappe', 'final', 'cablage'];
  const NOMS_PARTIES = {
    idees: 'Idées de solutions',
    definition: 'Objet technique',
    classement: 'Classement',
    mouvement: 'Algorigramme 1',
    trappe: 'Algorigramme 2',
    final: 'Algorigramme du distributeur',
    cablage: 'Câblage',
  };

  function vide() {
    return { idees: [], definition: '', classement: {}, algos: {}, couleurs: {}, verifications: {} };
  }

  function completer(c) {
    const v = vide();
    const r = Object.assign(v, c || {});
    for (const k of ['classement', 'algos', 'couleurs', 'verifications']) r[k] = r[k] || {};
    r.idees = Array.isArray(r.idees) ? r.idees : [];
    return r;
  }

  // Un élément renommé dans donnees/carnet.js (« ancienNom ») : la réponse déjà placée suit le nouveau nom.
  function harmoniserClassement(carnet, elements) {
    for (const e of elements || []) {
      if (e.ancienNom && carnet.classement[e.ancienNom] && !carnet.classement[e.nom]) {
        carnet.classement[e.nom] = carnet.classement[e.ancienNom];
        delete carnet.classement[e.ancienNom];
      }
    }
    return carnet;
  }

  // ---------- Corrections ----------

  // placements : { nomElement: 'capteur' | 'carte' | 'actionneur' }
  function corrigerClassement(placements, elements) {
    const mal = [];
    const nonPlaces = [];
    let bien = 0;
    for (const e of elements) {
      const p = placements[e.nom];
      if (!p) nonPlaces.push(e.nom);
      else if (p === e.place) bien++;
      else mal.push(e.nom);
    }
    return { total: elements.length, bien, mal, nonPlaces, reussi: bien === elements.length };
  }

  // Algorigramme : placement { case: texte }, attendu { case: texte }, groupes de cases à l'ordre libre.
  function corrigerAlgo(placement, attendu, groupes) {
    const cases = Object.keys(attendu);
    const groupeDe = {};
    (groupes || []).forEach((g, i) => g.forEach((c) => (groupeDe[c] = i)));
    const mal = [];
    const vides = [];
    // Dans un groupe, on compare des ensembles de textes (avec répétitions).
    const restants = {};
    (groupes || []).forEach((g, i) => (restants[i] = g.map((c) => attendu[c])));
    for (const c of cases) {
      const t = placement[c];
      if (!t) {
        vides.push(c);
        continue;
      }
      if (groupeDe[c] === undefined) {
        if (t !== attendu[c]) mal.push(c);
        continue;
      }
      const r = restants[groupeDe[c]];
      const i = r.indexOf(t);
      if (i < 0) mal.push(c);
      else r.splice(i, 1);
    }
    const bien = cases.length - mal.length - vides.length;
    return { total: cases.length, bien, mal, vides, reussi: bien === cases.length };
  }

  // Les petits algorigrammes : les étapes dans l'ordre donné par le fichier de données.
  function attenduLineaire(algo) {
    const r = {};
    algo.etapes.forEach((e, i) => (r['c' + (i + 1)] = e.texte));
    return r;
  }

  // Câblage : chaque composant de l'exercice 13A (le servo a une couleur imposée).
  function lignesCablage(composants) {
    return (composants || []).map((c) => ({
      broche: c.broche,
      type: c.type,
      nom: { led: 'LED', bouton: 'Bouton', servo: 'Servo-moteur' }[c.type] + (c.nom ? ' ' + c.nom.replace(/Dose$/, ' dose') : ''),
      role: c.type === 'bouton' ? 'capteur' : 'actionneur',
      couleurImposee: c.type === 'servo',
    }));
  }

  // ---------- Avancement ----------

  function dernier(c, partie) {
    const v = (c.verifications || {})[partie] || [];
    return v[v.length - 1];
  }
  const reussie = (c, partie) => ((c.verifications || {})[partie] || []).some((v) => v.reussi);

  // État de chaque partie : 'fait' | 'en_cours' | 'a_faire'
  function etats(carnet, contenu, composants13) {
    const c = completer(carnet);
    const e = {};
    const idees = c.idees.filter((x) => x && x.trim()).length;
    e.idees = idees >= 2 ? 'fait' : idees ? 'en_cours' : 'a_faire';
    e.definition = c.definition.trim().length >= 15 ? 'fait' : c.definition.trim() ? 'en_cours' : 'a_faire';
    for (const p of ['classement', 'mouvement', 'trappe', 'final']) {
      const commence = p === 'classement' ? Object.keys(c.classement).length : Object.keys(c.algos[p] || {}).length;
      e[p] = reussie(c, p) ? 'fait' : commence || dernier(c, p) ? 'en_cours' : 'a_faire';
    }
    const lignes = lignesCablage(composants13).filter((l) => !l.couleurImposee);
    const choisies = lignes.filter((l) => c.couleurs[l.broche]).length;
    e.cablage = lignes.length && choisies === lignes.length ? 'fait' : choisies ? 'en_cours' : 'a_faire';
    void contenu;
    return e;
  }

  function avancementCarnet(carnet, contenu, composants13) {
    const e = etats(carnet, contenu, composants13);
    return PARTIES.filter((p) => e[p] === 'fait').length;
  }

  const maintenant = () => {
    const d = new Date();
    const z = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`;
  };

  // Chaque clic sur « Vérifier » d'une partie du carnet est gardé (pour le professeur).
  function noterVerificationCarnet(donnees, partie, resultat) {
    donnees.carnet = completer(donnees.carnet);
    const v = (donnees.carnet.verifications[partie] = donnees.carnet.verifications[partie] || []);
    v.push({ date: maintenant(), reussi: !!resultat.reussi, bien: resultat.bien, total: resultat.total });
    donnees.modifieLe = maintenant();
  }

  const api = {
    PARTIES_CARNET: PARTIES,
    NOMS_PARTIES_CARNET: NOMS_PARTIES,
    carnetVide: vide,
    completerCarnet: completer,
    corrigerClassement,
    harmoniserClassement,
    corrigerAlgo,
    attenduLineaire,
    lignesCablage,
    etatsCarnet: etats,
    avancementCarnet,
    noterVerificationCarnet,
    horodatage: maintenant,
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.Atelier = global.Atelier || {}), api);
})(this);
