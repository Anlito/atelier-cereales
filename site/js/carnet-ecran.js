// Carnet de projet : la page d'accueil de l'équipe après l'ouverture du projet.
// Problématique, objet automatisé, algorigrammes, algorigramme du distributeur, programmation, câblage.
// Tout est rangé dans le même fichier que les exercices (session commune).
(function (global) {
  'use strict';

  const A = global.Atelier;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (s) => String(s === null || s === undefined ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const ONGLETS = [
    { cle: 'problematique', titre: 'Problématique', icone: 'crayon', parties: ['idees', 'definition'] },
    { cle: 'objet', titre: 'Objet automatisé', icone: 'variables', parties: ['classement'] },
    { cle: 'algorigrammes', titre: 'Algorigrammes', icone: 'decisions', parties: ['mouvement', 'trappe'] },
    { cle: 'algo-final', titre: 'Algorigramme du distributeur', icone: 'decisions', parties: ['final'] },
    { cle: 'programmation', titre: 'Programmation', icone: 'lumiere', parties: [] },
    { cle: 'cablage', titre: 'Câblage', icone: 'bouton', parties: ['cablage'] },
  ];
  // Couleurs des colonnes ; titres et explications du « ? » dans donnees/carnet.js.
  const COULEURS_COLONNES = { capteur: '#1E88E5', carte: '#7B1FA2', actionneur: '#E65100' };
  const COLONNES_DEFAUT = [
    { cle: 'capteur', titre: 'Capteurs', aide: 'Reçoivent une information', explication: '' },
    { cle: 'carte', titre: 'Carte programmable', aide: 'Traite et décide', explication: '' },
    { cle: 'actionneur', titre: 'Actionneurs', aide: 'Agissent sur le monde', explication: '' },
  ];

  // Mélange stable (le même ordre pendant toute la séance), à partir d'une graine.
  function melanger(liste, graine) {
    let x = 0;
    for (const c of graine) x = (x * 31 + c.charCodeAt(0)) >>> 0;
    const r = liste.slice();
    for (let i = r.length - 1; i > 0; i--) {
      x = (x * 1103515245 + 12345) >>> 0;
      const j = x % (i + 1);
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }

  function creerCarnet(session) {
    const D = session.donnees;
    const C = A.carnet || {};
    const racine = $('.ecran-carnet');
    const ex13 = A.catalogue.exercices().find((e) => e.id === '13A');
    const exercices = A.catalogue.exercices();
    D.carnet = A.harmoniserClassement(A.completerCarnet(D.carnet), C.classement);
    const K = D.carnet;
    const ui = { onglet: 'problematique', choisi: null, revoir: {}, retour: {} };
    const graine = A.nomEquipe(D.equipe.eleves);

    A.poserIcones(racine);
    $('.carnet-equipe', racine).textContent = D.equipe.eleves.join(', ') + (D.equipe.classe ? ' · ' + D.equipe.classe : '');

    // Une modification du carnet : copie de secours tout de suite, fichier de l'équipe peu après.
    let minuteur = null;
    function modifie(geste) {
      D.modifieLe = A.horodatage();
      majEntete();
      if (geste) return session.aEnregistrer(true, true);
      clearTimeout(minuteur);
      minuteur = setTimeout(() => session.aEnregistrer(false), 600);
    }

    // ---------- En-tête : avancement et onglets ----------

    const SYMBOLE = { fait: '✓', en_cours: '●', a_faire: '○' };
    function etatOnglet(o, etats) {
      if (o.cle === 'programmation') {
        const n = A.avancement(D);
        return n >= 13 ? 'fait' : Object.keys(D.exercices).length ? 'en_cours' : 'a_faire';
      }
      const e = o.parties.map((p) => etats[p]);
      if (e.every((x) => x === 'fait')) return 'fait';
      return e.some((x) => x !== 'a_faire') ? 'en_cours' : 'a_faire';
    }
    function majEntete() {
      const etats = A.etatsCarnet(K, C, ex13.composants);
      const fait = A.PARTIES_CARNET.filter((p) => etats[p] === 'fait').length;
      $('.carnet-avancement', racine).innerHTML =
        `<span><strong>Carnet</strong> ${fait}/${A.PARTIES_CARNET.length}</span>` +
        `<span class="barre"><span style="width:${Math.round((fait / A.PARTIES_CARNET.length) * 100)}%"></span></span>` +
        `<span><strong>Programmation</strong> ${A.avancement(D)}/13</span>` +
        `<span class="barre"><span style="width:${Math.round((A.avancement(D) / 13) * 100)}%"></span></span>`;
      $('.carnet-onglets', racine).innerHTML = ONGLETS.map((o) => {
        const e = etatOnglet(o, etats);
        return (
          `<button type="button" role="tab" class="onglet etat-${e}" data-onglet="${o.cle}" aria-selected="${ui.onglet === o.cle}">` +
          `${A.icone(o.icone, { epaisseur: 2.4 })}<span>${o.titre}</span><span class="onglet-etat" aria-label="${{ fait: 'fait', en_cours: 'en cours', a_faire: 'à faire' }[e]}">${SYMBOLE[e]}</span></button>`
        );
      }).join('');
    }
    racine.addEventListener('click', (e) => {
      const o = e.target.closest('[data-onglet]');
      if (!o) return;
      montrer(o.dataset.onglet);
    });

    function montrer(cle) {
      // Changer d'onglet abandonne l'élément choisi ; un simple réaffichage le garde.
      const nouvelOnglet = !!cle && cle !== ui.onglet;
      if (nouvelOnglet) ui.choisi = null;
      ui.onglet = cle || ui.onglet;
      majEntete();
      const zone = $('.carnet-contenu', racine);
      zone.innerHTML = { problematique, objet, algorigrammes, 'algo-final': algoFinal, programmation, cablage }[ui.onglet]();
      if (nouvelOnglet) racine.scrollTop = 0;
    }

    // ---------- 1. Problématique ----------

    function problematique() {
      const n = C.nombreIdees || 4;
      let h = '<section class="carte-carnet"><h2>La problématique</h2>' +
        `<blockquote class="problematique">${echapper(C.problematique)}</blockquote>` +
        '<h3>Vos idées de solutions</h3><div class="idees">';
      for (let i = 0; i < n; i++) {
        h += `<label>Idée ${i + 1}<textarea rows="3" data-idee="${i}" placeholder="Notre idée de solution…">${echapper(K.idees[i] || '')}</textarea></label>`;
      }
      h += '</div>' +
        `<h3>${echapper(C.questionObjet)}</h3>` +
        `<textarea rows="3" class="champ-definition" placeholder="Un objet technique, c'est…">${echapper(K.definition)}</textarea></section>`;
      return h;
    }
    racine.addEventListener('input', (e) => {
      const t = e.target;
      if (t.dataset.idee !== undefined) K.idees[Number(t.dataset.idee)] = t.value;
      else if (t.classList.contains('champ-definition')) K.definition = t.value;
      else return;
      modifie(false);
    });

    // ---------- 2. Objet automatisé : classement ----------

    function objet() {
      const colonnes = C.colonnes || COLONNES_DEFAUT;
      const restants = melanger(C.classement || [], graine + 'c').filter((e) => !K.classement[e.nom]);
      const revoir = ui.revoir.classement || [];
      // Carte d'un élément : image et nom (petite version une fois placée dans une colonne).
      const carteObjet = (e, place) =>
        `<button type="button" class="carte-objet${place ? ' placee' : ''}${ui.choisi === e.nom ? ' choisie' : ''}${revoir.includes(e.nom) ? ' a-revoir' : ''}" ` +
        `data-element="${echapper(e.nom)}"${place ? ` data-place="${place}"` : ''} draggable="true" ` +
        `aria-label="${echapper(e.nom)}${place ? ' : remettre dans la liste' : ''}">` +
        (e.image ? `<img src="${echapper(e.image)}" alt="" draggable="false">` : '') +
        `<span class="carte-objet-nom">${echapper(e.nom)}</span>` +
        `${place ? '<span class="retirer" aria-hidden="true">×</span>' : ''}${revoir.includes(e.nom) ? '<span class="marque">à revoir</span>' : ''}</button>`;
      let h = '<section class="carte-carnet"><h2>Classement : capteur, carte programmable ou actionneur ?</h2>' +
        // La chaîne d'un objet automatisé, comme dans la présentation.
        '<div class="chaine" aria-label="Capteurs, puis carte programmable, puis actionneurs">' +
        colonnes.map((c, i) =>
          `<span class="chaine-maillon" style="--col:${COULEURS_COLONNES[c.cle]}">${echapper(c.titre)}</span>` +
          (i < colonnes.length - 1 ? `<span class="chaine-fleche">${i === 0 ? 'l’information' : 'les ordres'} →</span>` : ''),
        ).join('') +
        '</div>' +
        '<p class="mode-emploi"><strong>1.</strong> Clique sur un élément (ou fais-le glisser), <strong>2.</strong> clique sur sa colonne. ' +
        'Clique sur un élément déjà placé pour le remettre dans la liste. Le <strong>?</strong> explique chaque colonne.</p>' +
        `<div class="reserve reserve-objets" data-zone="reserve"><span class="reserve-titre">À classer : ${restants.length}</span>` +
        (restants.length ? restants.map((e) => carteObjet(e)).join('') : '<span class="tout-place">Tous les éléments sont placés.</span>') +
        '</div><div class="colonnes">';
      for (const col of colonnes) {
        const dedans = (C.classement || []).filter((e) => K.classement[e.nom] === col.cle);
        const ouverte = ui.aideColonne === col.cle;
        h += `<div class="colonne" data-colonne="${col.cle}" style="--col:${COULEURS_COLONNES[col.cle]}">` +
          `<div class="colonne-titre"><span class="colonne-nom">${echapper(col.titre)}` +
          (col.explication ? `<button type="button" class="aide-colonne" data-aide-colonne="${col.cle}" aria-expanded="${ouverte}" aria-label="Qu’est-ce que c’est : ${echapper(col.titre)} ?">?</button>` : '') +
          `</span><small>${echapper(col.aide)}</small></div>` +
          (ouverte ? `<p class="explication-colonne">${echapper(col.explication)}</p>` : '') +
          `<div class="colonne-corps">${dedans.map((e) => carteObjet(e, col.cle)).join('') || '<span class="vide">Clique ici pour placer</span>'}</div></div>`;
      }
      h += '</div>' + boutonVerifier('classement', 'Vérifier mon classement') + '</section>';
      return h;
    }

    function placerElement(nom, place) {
      if (place) K.classement[nom] = place;
      else delete K.classement[nom];
      ui.choisi = null;
      ui.revoir.classement = [];
      ui.retour.classement = null;
      modifie(false);
      montrer();
    }

    // ---------- 3 et 4. Algorigrammes ----------

    // Les étapes encore à placer : toutes les étapes attendues, moins celles déjà posées (textes en double comptés).
    function reserveAlgo(id, attendu) {
      const poses = Object.values(K.algos[id] || {});
      const reste = melanger(Object.values(attendu), graine + id);
      for (const t of poses) {
        const i = reste.indexOf(t);
        if (i >= 0) reste.splice(i, 1);
      }
      return reste;
    }
    function formeDe(id, texte) {
      if (id === 'final') return /\?$/.test(texte) ? 'question' : 'action';
      const a = (C.algorigrammes || []).find((x) => x.id === id);
      const e = a && a.etapes.find((x) => x.texte === texte);
      return e ? e.forme : /\?$/.test(texte) ? 'question' : 'action';
    }

    function reserveHtml(id, attendu) {
      const reste = reserveAlgo(id, attendu);
      return (
        `<div class="reserve" data-zone="reserve" data-algo="${id}"><span class="reserve-titre">Étapes à placer : ${reste.length}</span>` +
        (reste.length
          ? reste.map((t, i) => `<button type="button" class="piece forme-${formeDe(id, t)}${ui.choisi && ui.choisi.algo === id && ui.choisi.texte === t && ui.choisi.i === i ? ' choisie' : ''}" data-algo="${id}" data-texte="${echapper(t)}" data-i="${i}" draggable="true">${echapper(t)}</button>`).join('')
          : '<span class="tout-place">Toutes les étapes sont placées.</span>') +
        '</div>'
      );
    }

    // Une case de l'algorigramme, à la position (x, y) du dessin.
    function caseHtml(id, sid, forme, x, y, l, h) {
      const t = (K.algos[id] || {})[sid];
      const revoir = (ui.revoir[id] || []).includes(sid);
      const ok = ui.retour[id] && ui.retour[id].reussi;
      const classe = `case-algo forme-${forme}${t ? ' remplie' : ''}${revoir ? ' a-revoir' : ''}${ok ? ' juste' : ''}${ui.choisi && ui.choisi.algo === id ? ' prete' : ''}`;
      return (
        `<button type="button" class="${classe}" data-algo="${id}" data-case="${sid}" style="left:${x - l / 2}px;top:${y}px;width:${l}px;height:${h}px">` +
        (forme === 'question' ? '<svg class="losange" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><polygon points="50,1 99,20 50,39 1,20"/></svg>' : '') +
        `<span>${t ? echapper(t) : forme === 'question' ? '?' : 'déposer ici'}</span>${revoir ? '<span class="marque">à revoir</span>' : ''}</button>`
      );
    }

    // Petit algorigramme vertical : Début, étapes, Fin ; une question renvoie vers elle-même par NON.
    function petitAlgo(a) {
      const L = 230;
      const HA = 42;
      const HQ = 58;
      const X = 150;
      const W = 300;
      let y = 46;
      let cases = '';
      let traits = '';
      a.etapes.forEach((e, i) => {
        const h = e.forme === 'question' ? HQ : HA;
        traits += `<line x1="${X}" y1="${y - 18}" x2="${X}" y2="${y}" class="trait" marker-end="url(#fl-${a.id})"/>`;
        if (e.forme === 'question') {
          traits += `<text x="${X + 8}" y="${y + h + 13}" class="oui">OUI</text>`;
          traits += `<path d="M${X - L / 2} ${y + h / 2} H${X - L / 2 - 16} V${y - 9} H${X}" class="trait non" marker-end="url(#fl-${a.id})"/>`;
          traits += `<text x="${X - L / 2 - 14}" y="${y + h / 2 - 5}" class="non-texte">NON</text>`;
        }
        cases += caseHtml(a.id, 'c' + (i + 1), e.forme, X, y, e.forme === 'question' ? L - 20 : L - 40, h);
        y += h + 18;
      });
      traits += `<line x1="${X}" y1="${y - 18}" x2="${X}" y2="${y}" class="trait" marker-end="url(#fl-${a.id})"/>`;
      const H = y + 34;
      return (
        `<div class="algo" style="width:${W}px;height:${H}px">` +
        `<svg class="algo-traits" width="${W}" height="${H}" aria-hidden="true"><defs><marker id="fl-${a.id}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><polygon points="0,0 8,4 0,8"/></marker></defs>${traits}</svg>` +
        `<div class="borne" style="left:${X - 55}px;top:0">Début</div>${cases}<div class="borne" style="left:${X - 55}px;top:${y}px">Fin</div></div>`
      );
    }

    function algorigrammes() {
      let h = '<section class="carte-carnet"><h2>Algorigrammes</h2>' +
        '<p class="mode-emploi">Un algorigramme se lit de haut en bas. ▭ = une action, ◇ = une question (OUI : on descend, NON : on recommence la question). ' +
        'Clique sur une étape (ou fais-la glisser), puis sur une case. Clique sur une case remplie pour la vider.</p><div class="deux-algos">';
      for (const a of C.algorigrammes || []) {
        const attendu = A.attenduLineaire(a);
        h += `<div class="un-algo"><h3>${echapper(a.titre)}</h3><p class="consigne-algo">${echapper(a.consigne)}</p>` +
          reserveHtml(a.id, attendu) + `<div class="algo-defile">${petitAlgo(a)}</div>` +
          boutonVerifier(a.id, 'Vérifier cet algorigramme') + '</div>';
      }
      return h + '</div></section>';
    }

    // Algorigramme du distributeur : début commun, puis deux branches (petite dose, grande dose).
    function algoFinal() {
      const F = C.algoFinal;
      const W = 860;
      const CX = W / 2;
      const LX = W * 0.27;
      const RX = W * 0.73;
      const LA = 210;
      const HA = 40;
      const HQ = 62;
      let traits = '';
      let cases = '';
      const ligne = (x1, y1, x2, y2, fleche) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="trait"${fleche ? ' marker-end="url(#fl-final)"' : ''}/>`;
      // Tronc commun
      let y = 50;
      for (const sid of ['s1', 's2', 's3', 's4']) {
        traits += ligne(CX, y - 16, CX, y, true);
        cases += caseHtml('final', sid, 'action', CX, y, LA, HA);
        y += HA + 16;
      }
      const yFourche = y + 4;
      traits += ligne(CX, y - 16, CX, yFourche) + ligne(LX, yFourche, RX, yFourche);
      traits += `<text x="${LX - 70}" y="${yFourche - 6}" class="branche">Petite dose</text><text x="${RX + 10}" y="${yFourche - 6}" class="branche">Grande dose</text>`;
      let yFin = 0;
      for (const [cote, X, sens] of [['L', LX, -1], ['R', RX, 1]]) {
        let yb = yFourche + 22;
        traits += ligne(X, yFourche, X, yb, true);
        ['s5', 's6', 's7', 's8', 's9', 's10', 's11'].forEach((base, i) => {
          const sid = base + cote;
          const question = [0, 3, 6].includes(i);
          const h = question ? HQ : HA;
          if (i) traits += ligne(X, yb - 16, X, yb, true);
          cases += caseHtml('final', sid, question ? 'question' : 'action', X, yb, question ? LA : LA - 30, h);
          if (question) {
            const xBord = X + (sens * LA) / 2;
            const xBoucle = xBord + sens * (18 + i * 5);
            traits += `<path d="M${xBord} ${yb + h / 2} H${xBoucle} V${yb - 8} H${X}" class="trait non" marker-end="url(#fl-final)"/>`;
            traits += `<text x="${xBoucle + (sens > 0 ? 4 : -30)}" y="${yb + h / 2 - 4}" class="non-texte">NON</text>`;
            traits += `<text x="${X + 8}" y="${yb + h + 13}" class="oui">OUI</text>`;
          }
          yb += h + 16;
        });
        yFin = Math.max(yFin, yb);
      }
      // Retour au début
      const yRetour = yFin + 4;
      traits += ligne(LX, yFin - 16, LX, yRetour) + ligne(RX, yFin - 16, RX, yRetour) + ligne(LX, yRetour, RX, yRetour);
      traits += `<path d="M${CX} ${yRetour} V${yRetour + 22} H14 V66 H${CX - LA / 2}" class="trait" marker-end="url(#fl-final)"/>`;
      traits += `<text x="${CX - 50}" y="${yRetour + 38}" class="retour">retour au début</text>`;
      const H = yRetour + 50;
      return (
        `<section class="carte-carnet"><h2>${echapper(F.titre)}</h2><p class="mode-emploi">${echapper(F.consigne)} ` +
        'Clique sur une étape (ou fais-la glisser), puis sur une case. Clique sur une case remplie pour la vider.</p>' +
        reserveHtml('final', F.cases) +
        `<div class="algo-defile"><div class="algo" style="width:${W}px;height:${H}px">` +
        `<svg class="algo-traits" width="${W}" height="${H}" aria-hidden="true"><defs><marker id="fl-final" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><polygon points="0,0 8,4 0,8"/></marker></defs>${traits}</svg>` +
        `<div class="borne" style="left:${CX - 55}px;top:0">Début</div>${cases}</div></div>` +
        boutonVerifier('final', 'Vérifier l’algorigramme') + '</section>'
      );
    }

    function placerPiece(id, sid, texte) {
      K.algos[id] = K.algos[id] || {};
      if (texte) K.algos[id][sid] = texte;
      else delete K.algos[id][sid];
      ui.choisi = null;
      ui.revoir[id] = [];
      ui.retour[id] = null;
      modifie(false);
      montrer();
    }

    // ---------- Vérification d'une partie ----------

    function boutonVerifier(partie, texte) {
      const r = ui.retour[partie];
      const essais = (K.verifications[partie] || []).length;
      let retour = '';
      if (r) {
        retour = r.reussi
          ? `<p class="retour-verif juste">${A.icone('coche', { couleur: '#2E7D32', epaisseur: 2.8 })}Bravo, tout est juste !</p>`
          : `<p class="retour-verif">${r.message}</p>`;
      }
      return (
        `<div class="verifier-partie"><button type="button" class="btn-verifier-partie" data-verifier="${partie}">${A.icone('coche')}${texte}</button>` +
        `${essais ? `<span class="essais">${essais} vérification${essais > 1 ? 's' : ''}</span>` : ''}${retour}</div>`
      );
    }

    function verifier(partie) {
      let r;
      if (partie === 'classement') {
        r = A.corrigerClassement(K.classement, C.classement || []);
        ui.revoir.classement = r.mal;
        const morceaux = [];
        if (r.mal.length) morceaux.push(`${r.mal.length} élément${r.mal.length > 1 ? 's sont' : ' est'} dans la mauvaise colonne (marqué${r.mal.length > 1 ? 's' : ''} « à revoir »)`);
        if (r.nonPlaces.length) morceaux.push(`${r.nonPlaces.length} élément${r.nonPlaces.length > 1 ? 's ne sont' : ' n’est'} pas encore placé${r.nonPlaces.length > 1 ? 's' : ''}`);
        r.message = `${r.bien} sur ${r.total} ${r.bien > 1 ? 'sont bien placés' : 'est bien placé'}. ${morceaux.join(' et ')}.`;
      } else {
        const attendu = partie === 'final' ? C.algoFinal.cases : A.attenduLineaire((C.algorigrammes || []).find((a) => a.id === partie));
        const groupes = partie === 'final' ? C.algoFinal.groupes : [];
        r = A.corrigerAlgo(K.algos[partie] || {}, attendu, groupes);
        ui.revoir[partie] = r.mal;
        const morceaux = [];
        if (r.mal.length) morceaux.push(`${r.mal.length} case${r.mal.length > 1 ? 's sont' : ' est'} à revoir`);
        if (r.vides.length) morceaux.push(`${r.vides.length} case${r.vides.length > 1 ? 's sont' : ' est'} encore vide${r.vides.length > 1 ? 's' : ''}`);
        r.message = `${r.bien} case${r.bien > 1 ? 's' : ''} sur ${r.total} ${r.bien > 1 ? 'sont justes' : 'est juste'}. ${morceaux.join(' et ')}.`;
      }
      ui.retour[partie] = r;
      A.noterVerificationCarnet(D, partie, r);
      modifie(true);
      montrer();
    }

    // ---------- 5. Programmation ----------

    function programmation() {
      const suivant = A.exerciceAReprendre(D);
      let h = '<section class="carte-carnet"><h2>Programmation</h2>' +
        '<p class="mode-emploi">Programme le distributeur en blocs, exercice par exercice. Réussis un exercice pour ouvrir le suivant. ' +
        'Les broches sont celles du câblage (onglet Câblage).</p>' +
        `<button type="button" class="btn-principal btn-continuer" data-exercice="${suivant}">${A.LECTURE}Continuer : exercice ${suivant}</button>` +
        '<div class="liste-programmation">';
      for (const ex of exercices) {
        const p = D.exercices[ex.id];
        const ouvert = A.estDebloque(D, ex.id);
        // « à revérifier » : réussi, mais le professeur a modifié l'exercice depuis (mise à jour des exercices).
        const statut = !ouvert ? 'verrouille' : p ? (p.statut === 'reussi' && p.aReverifier ? 'a_reverifier' : p.statut) : 'non_commence';
        const symbole = { verrouille: '🔒', reussi: '✓', a_reverifier: '↻', en_cours: '●', non_commence: '○' }[statut];
        const mot = { verrouille: 'verrouillé', reussi: 'réussi', a_reverifier: 'modifié, à revérifier', en_cours: 'en cours', non_commence: 'à faire' }[statut];
        h += `<button type="button" class="ligne-exercice statut-${statut}" data-exercice="${ex.id}"${ouvert ? '' : ' disabled'}>` +
          `<span class="liste-numero">${ex.id}</span><span class="liste-titre">${echapper(ex.titre)}</span>` +
          `<span class="liste-statut"><span aria-hidden="true">${symbole}</span> ${mot}${p && p.tentatives ? ` · ${p.tentatives} vérification${p.tentatives > 1 ? 's' : ''}` : ''}</span></button>`;
      }
      // Maquette : l'élève envoie SON programme de l'exercice 13 (mode « Dans la carte » de l'écran d'exercice).
      const version = versionMaquette();
      h += '</div><div class="tester-maquette">' +
        `<h3>${A.icone('lumiere', { epaisseur: 2.4 })}Tester sur la maquette</h3>` +
        (!version
          ? '<p>Quand l’exercice 13 sera ouvert, tu pourras envoyer ton programme du distributeur dans la carte Arduino de ta maquette.</p>' +
            '<button type="button" class="btn-principal btn-envoi-carte" disabled>Envoyer mon programme dans la carte Arduino</button>'
          : (D.exercices[version] && D.exercices[version].statut === 'reussi'
              ? `<p>Ton programme du distributeur est validé${version === '13B' ? ' (défi compris)' : ''} : envoie-le dans la carte Arduino de ta maquette.</p>`
              : `<p>Ton programme de l’exercice ${version} n’est pas encore validé : tu peux quand même l’essayer sur ta maquette.</p>`) +
            `<button type="button" class="btn-principal btn-envoi-carte" data-version="${version}">Envoyer mon programme dans la carte Arduino</button> ` +
            `<button type="button" class="btn-secondaire btn-direct-carte" data-version="${version}" title="Le programme tourne dans l’ordinateur et la maquette obéit tout de suite (câble branché)">Essayer en direct sur la maquette</button>`) +
        '<p class="demontage">Fin de séance (démontage) : <button type="button" class="btn-secondaire btn-vider-carte">Vider la carte</button> ' +
        '<a class="lien-tuto" href="tuto.html" target="_blank" rel="noopener">Tutoriel de câblage</a></p>' +
        '</div>';
      return h + '</section>';
    }

    // ---------- 6. Câblage ----------

    function cablage() {
      const lignes = A.lignesCablage(ex13.composants);
      // Couleurs en stock pour chaque type de composant (ou une seule liste pour tous).
      const stock = C.couleursCables || [];
      let h = '<section class="carte-carnet"><h2>Câblage du distributeur</h2>' +
        '<a class="encart-tuto" href="tuto.html" target="_blank" rel="noopener">' +
        `<span class="encart-tuto-icone">${A.icone('livre', { epaisseur: 2.4 })}</span>` +
        '<span class="encart-tuto-texte"><strong>Tutoriel de câblage</strong>À lire avant de câbler : la carte Arduino, la platine de test, les protocoles, puis le branchement de la LED, du bouton poussoir et du servo-moteur.</span>' +
        '<span class="encart-tuto-ouvrir">Ouvrir le tutoriel →</span></a>' +
        '<p class="regle"><strong>Règle :</strong> le câble GND (la masse) est toujours <strong>marron ou noir</strong>. ' +
        'Pour le câble de signal, choisis une couleur parmi celles en stock. Les broches sont les mêmes que dans les exercices de programmation.</p>' +
        '<table class="table-cablage"><thead><tr><th>Composant</th><th>Rôle</th><th>Couleur du câble de signal</th><th>Broche</th></tr></thead><tbody>';
      for (const l of lignes) {
        const couleurs = (Array.isArray(stock) ? stock : stock[l.type]) || [];
        const choisie = l.couleurImposee ? C.couleurServo : couleurs.find((c) => c.nom === K.couleurs[l.broche]);
        const choix = l.couleurImposee
          ? `<span class="couleur-fixe"><span class="point" style="background:${C.couleurServo.code}"></span>${C.couleurServo.nom} (imposé)</span>`
          : '<div class="choix-couleurs">' +
            couleurs.map((c) => `<button type="button" class="point-couleur${K.couleurs[l.broche] === c.nom ? ' choisie' : ''}" data-broche="${l.broche}" data-couleur="${c.nom}" style="background:${c.code}" aria-label="${c.nom}" aria-pressed="${K.couleurs[l.broche] === c.nom}"></button>`).join('') +
            `<span class="nom-couleur">${choisie ? choisie.nom : 'à choisir'}</span></div>`;
        h += `<tr><td><strong>${echapper(l.nom)}</strong></td><td><span class="role role-${l.role}">${l.role === 'capteur' ? 'Capteur' : 'Actionneur'}</span></td>` +
          `<td>${choix}</td><td><span class="broche-cablage">${l.broche}</span></td></tr>`;
      }
      return h + '</tbody></table></section>';
    }

    // ---------- Clics et glisser-déposer ----------

    racine.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b || !racine.contains(b)) return;
      if (b.dataset.verifier) return verifier(b.dataset.verifier);
      if (b.dataset.exercice) return A.ouvrirExercice(b.dataset.exercice);
      if (b.classList.contains('btn-envoi-carte')) return A.ouvrirExercice(b.dataset.version, { mode: 'carte' });
      if (b.classList.contains('btn-direct-carte')) return A.ouvrirExercice(b.dataset.version, { mode: 'direct' });
      if (b.classList.contains('btn-vider-carte')) return viderLaCarte();
      if (b.dataset.couleur) {
        K.couleurs[b.dataset.broche] = K.couleurs[b.dataset.broche] === b.dataset.couleur ? undefined : b.dataset.couleur;
        if (!K.couleurs[b.dataset.broche]) delete K.couleurs[b.dataset.broche];
        modifie(false);
        return montrer();
      }
      // « ? » d'une colonne : ouvre ou ferme son explication.
      if (b.dataset.aideColonne) {
        ui.aideColonne = ui.aideColonne === b.dataset.aideColonne ? null : b.dataset.aideColonne;
        return montrer();
      }
      // Classement
      if (b.dataset.element) {
        if (b.dataset.place) return placerElement(b.dataset.element, null);
        ui.choisi = ui.choisi === b.dataset.element ? null : b.dataset.element;
        return montrer();
      }
      // Pièces d'algorigramme
      if (b.classList.contains('piece')) {
        const c = { algo: b.dataset.algo, texte: b.dataset.texte, i: Number(b.dataset.i) };
        ui.choisi = ui.choisi && ui.choisi.algo === c.algo && ui.choisi.i === c.i ? null : c;
        return montrer();
      }
      if (b.dataset.case) {
        const id = b.dataset.algo;
        const deja = (K.algos[id] || {})[b.dataset.case];
        if (ui.choisi && ui.choisi.algo === id) return placerPiece(id, b.dataset.case, ui.choisi.texte);
        if (deja) return placerPiece(id, b.dataset.case, null);
      }
    });
    // Clic sur une colonne du classement
    racine.addEventListener('click', (e) => {
      const col = e.target.closest('[data-colonne]');
      if (!col || e.target.closest('button[data-place], .aide-colonne') || typeof ui.choisi !== 'string') return;
      placerElement(ui.choisi, col.dataset.colonne);
    });
    racine.addEventListener('dragstart', (e) => {
      const b = e.target.closest('[draggable="true"]');
      if (!b) return;
      if (b.dataset.element) ui.glisse = { element: b.dataset.element };
      else if (b.classList.contains('piece')) ui.glisse = { algo: b.dataset.algo, texte: b.dataset.texte };
      e.dataTransfer.setData('text/plain', 'atelier');
      e.dataTransfer.effectAllowed = 'move';
    });
    racine.addEventListener('dragover', (e) => {
      if (ui.glisse && e.target.closest('[data-colonne], [data-case], [data-zone="reserve"]')) e.preventDefault();
    });
    racine.addEventListener('drop', (e) => {
      const g = ui.glisse;
      ui.glisse = null;
      if (!g) return;
      e.preventDefault();
      const col = e.target.closest('[data-colonne]');
      const cas = e.target.closest('[data-case]');
      const reserve = e.target.closest('[data-zone="reserve"]');
      if (g.element) {
        if (col) placerElement(g.element, col.dataset.colonne);
        else if (reserve) placerElement(g.element, null);
      } else if (g.algo && cas && cas.dataset.algo === g.algo) placerPiece(g.algo, cas.dataset.case, g.texte);
    });

    return { montrer, rafraichir: () => montrer() };
  }

  // ---------- Navigation entre le carnet et les exercices ----------

  let session = null;
  let carnet = null;
  function demarrerProjet(s) {
    session = s;
    A.sessionCourante = s;
    carnet = creerCarnet(s);
    montrerCarnet('problematique');
  }
  function montrerCarnet(onglet) {
    if (A.programmation) A.programmation.quitter();
    $('.ecran-programmation').hidden = true;
    $('.ecran-carnet').hidden = false;
    document.title = 'Carnet de projet — Distributeur de céréales';
    carnet.montrer(onglet);
  }
  // Exercices : écran de Labo Blocs, posé à la première ouverture ; « Carnet » ramène à l'onglet Programmation.
  //   options : { mode: 'carte' | 'direct' } (« Tester sur la maquette » : envoyer son programme dans la carte, ou
  //   le faire tourner en direct, câble branché)
  function ouvrirExercice(numero, options) {
    if (!A.idExercice(numero) || !A.estDebloque(session.donnees, numero)) return;
    $('.ecran-carnet').hidden = true;
    $('.ecran-programmation').hidden = false;
    if (!A.programmation) A.programmation = A.monterProgrammation(session, { retour: { texte: 'Carnet', action: () => montrerCarnet('programmation') } });
    A.programmation.ouvrir(A.idExercice(numero));
    A.programmation.choisirModeTest(options && ['carte', 'direct'].includes(options.mode) ? options.mode : 'simulateur');
  }

  // Exercice 13 à envoyer dans la maquette : 13B s'il est réussi, sinon 13A (s'il est ouvert).
  function versionMaquette() {
    const D = session.donnees;
    if (D.exercices['13B'] && D.exercices['13B'].statut === 'reussi') return '13B';
    return A.estDebloque(D, '13A') ? '13A' : null;
  }

  // Fin de séance (démontage) : la carte de la maquette est vidée, son programme effacé.
  function viderLaCarte() {
    const D = session.donnees;
    global.LaboBlocs.ouvrirDialogueCarte({
      carte: 'uno',
      titre: 'Vider la carte Arduino',
      intro: 'Protocole de démontage : on efface le programme de la carte. Elle ne commandera plus rien : tu pourras ensuite débrancher délicatement les câbles et les composants.',
      seulementVider: true,
      surVidage(r) {
        if (session.lecture) return;
        global.LaboBlocs.noterVidage(D, A.idExercice('13A'), { carte: 'uno', reussi: !!(r && r.ok) });
        session.aEnregistrer(true, true);
      },
    });
  }

  Object.assign(A, { demarrerProjet, montrerCarnet, ouvrirExercice });
})(this);
