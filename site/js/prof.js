// Outil professeur : import des sauvegardes, tableau de la classe, détail d'une équipe, exports.
(function (global) {
  'use strict';

  const A = global.Atelier;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (s) => String(s === null || s === undefined ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const ORDRE = A.ORDRE_PARCOURS;
  const exercices = A.catalogue.exercices();
  const titre = (id) => (exercices.find((e) => e.id === id) || {}).titre || '';

  let manuels = []; // { nom, texte } : fichiers glissés ou choisis à la main
  let fichiersDossier = []; // fichiers lus dans le dossier de la classe (relus en direct)
  let fichiers = []; // les deux réunis
  let bareme = A.completerBareme(A.bareme);
  let fusion = { equipes: [], invalides: [] };

  // ---------- Import ----------

  async function ajouter(nouveaux) {
    // Un même fichier importé deux fois n'est compté qu'une fois.
    const cle = (f) => f.nom + '|' + f.texte.length + '|' + f.texte.slice(-60);
    const vus = new Set(manuels.map(cle));
    for (const f of nouveaux) if (!vus.has(cle(f))) manuels.push(f);
    recalculer();
  }

  function recalculer() {
    fichiers = [...manuels, ...fichiersDossier];
    // Signature du travail d'une équipe : change dès qu'elle vérifie, ouvre un indice ou réussit.
    const signature = (d) =>
      d.modifieLe + '|' + Object.values(d.exercices).map((e) => `${e.statut}:${e.tentatives}:${e.indicesOuverts}`).join(',');
    const avant = new Map(fusion.equipes.map((e) => [e.cle, signature(e.donnees)]));
    fusion = A.fusionnerEquipes(fichiers);
    // Équipes qui ont avancé depuis la dernière lecture (signalées dans le tableau).
    misesAJour = new Set(fusion.equipes.filter((e) => avant.has(e.cle) && avant.get(e.cle) !== signature(e.donnees)).map((e) => e.cle));
    messages();
    dessiner();
    verifierAlertes();
    rafraichirDetail();
  }
  let misesAJour = new Set();

  async function lireFichiers(liste) {
    const sortie = [];
    for (const f of liste) if (/\.json$/i.test(f.name)) sortie.push({ nom: f.name, texte: await f.text() });
    return sortie;
  }

  // Tous les .json du dossier choisi et de ses sous-dossiers (ex. DISTRIBUTEUR DE CEREALES › Léa_Hugo › Léa_Hugo.json).
  // Un fichier qui n'a pas changé depuis la dernière lecture n'est pas relu (dossier réseau : on reste léger).
  const cache = new Map(); // chemin → { date, taille, texte }
  async function lireDossier(dossier, chemin, profondeur) {
    const sortie = [];
    for await (const entree of dossier.values()) {
      if (entree.kind === 'file' && /\.json$/i.test(entree.name)) {
        const nom = chemin + entree.name;
        let f;
        try {
          f = await entree.getFile();
        } catch {
          continue; // fichier en cours d'écriture par un élève : on le relira au prochain passage
        }
        const connu = cache.get(nom);
        if (connu && connu.date === f.lastModified && connu.taille === f.size) sortie.push({ nom, texte: connu.texte });
        else {
          const texte = await f.text();
          cache.set(nom, { date: f.lastModified, taille: f.size, texte });
          sortie.push({ nom, texte });
        }
      } else if (entree.kind === 'directory' && profondeur < 3) {
        sortie.push(...(await lireDossier(entree, chemin + entree.name + ' › ', profondeur + 1)));
      }
    }
    return sortie;
  }

  const zone = $('.zone-depot');
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('survol');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('survol'));
  zone.addEventListener('drop', async (e) => {
    e.preventDefault();
    zone.classList.remove('survol');
    ajouter(await lireFichiers([...e.dataTransfer.files]));
  });
  $('.entree-fichiers').addEventListener('change', async (e) => {
    ajouter(await lireFichiers([...e.target.files]));
    e.target.value = '';
  });
  // ---------- Suivi en direct du dossier de la classe (Chrome, Edge) ----------

  const suivi = { dossier: null, minuteur: null, periode: 30, enPause: false, derniere: null, erreur: '' };

  async function actualiser() {
    if (!suivi.dossier) return;
    try {
      fichiersDossier = await lireDossier(suivi.dossier, suivi.dossier.name + ' › ', 0);
      suivi.erreur = '';
      suivi.derniere = new Date();
    } catch {
      suivi.erreur = 'Le dossier n’a pas pu être relu (réseau ?). Nouvel essai au prochain passage.';
    }
    recalculer();
    majSuivi();
  }

  function programmer() {
    clearInterval(suivi.minuteur);
    suivi.minuteur = suivi.dossier && !suivi.enPause ? setInterval(actualiser, suivi.periode * 1000) : null;
    majSuivi();
  }

  async function suivre(dossier) {
    suivi.dossier = dossier;
    suivi.enPause = false;
    cache.clear();
    memoriserDossier(dossier);
    $('.prof-reprendre').hidden = true;
    await actualiser();
    programmer();
  }

  function arreterSuivi() {
    suivi.dossier = null;
    fichiersDossier = [];
    clearInterval(suivi.minuteur);
    memoriserDossier(null);
    majSuivi();
  }

  function majSuivi() {
    const bandeau = $('.prof-suivi');
    bandeau.hidden = !suivi.dossier;
    if (!suivi.dossier) return;
    const heure = suivi.derniere ? suivi.derniere.toLocaleTimeString('fr-FR') : '…';
    $('.suivi-etat', bandeau).innerHTML = suivi.enPause
      ? `<span class="suivi-point pause" aria-hidden="true"></span><strong>Suivi en pause</strong> · « ${echapper(suivi.dossier.name)} » · dernière lecture à ${heure}`
      : `<span class="suivi-point" aria-hidden="true"></span><strong>En direct</strong> · « ${echapper(suivi.dossier.name)} » · mis à jour à ${heure}`;
    $('.suivi-erreur', bandeau).textContent = suivi.erreur;
    $('.btn-suivi-pause', bandeau).textContent = suivi.enPause ? 'Reprendre' : 'Mettre en pause';
  }

  if (typeof global.showDirectoryPicker === 'function') {
    const b = $('.btn-dossier-classe');
    b.hidden = false;
    b.addEventListener('click', async () => {
      let dossier;
      try {
        dossier = await global.showDirectoryPicker({ id: 'atelier-cereales-prof', mode: 'read' });
      } catch {
        return;
      }
      suivre(dossier);
    });
    $('.btn-suivi-maintenant').addEventListener('click', actualiser);
    $('.btn-suivi-pause').addEventListener('click', () => {
      suivi.enPause = !suivi.enPause;
      if (!suivi.enPause) actualiser();
      programmer();
    });
    $('.btn-suivi-arreter').addEventListener('click', arreterSuivi);
    $('.suivi-periode').addEventListener('change', (e) => {
      suivi.periode = Number(e.target.value) || 30;
      programmer();
    });
    // Le dossier suivi est mémorisé : à la réouverture de la page, un clic suffit pour reprendre.
    dossierMemorise().then((d) => {
      if (!d) return;
      const r = $('.prof-reprendre');
      $('.reprendre-dossier', r).textContent = d.name;
      r.hidden = false;
      $('.btn-reprendre-suivi', r).addEventListener('click', async () => {
        try {
          if ((await d.queryPermission({ mode: 'read' })) !== 'granted' && (await d.requestPermission({ mode: 'read' })) !== 'granted') return;
        } catch {
          return;
        }
        suivre(d);
      });
    });
  } else $('.zone-depot-aide').textContent = 'Sur ce navigateur, sélectionne tous les fichiers .json d’un coup (Ctrl+A dans la fenêtre). Le suivi en direct demande Chrome ou Edge.';

  function base() {
    return new Promise((ok, ko) => {
      const r = indexedDB.open('atelier-cereales-prof', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('dossiers');
      r.onsuccess = () => ok(r.result);
      r.onerror = () => ko(r.error);
    });
  }
  async function memoriserDossier(dossier) {
    try {
      const db = await base();
      const t = db.transaction('dossiers', 'readwrite');
      if (dossier) t.objectStore('dossiers').put(dossier, 'classe');
      else t.objectStore('dossiers').delete('classe');
    } catch {
      /* stockage indisponible : il faudra rechoisir le dossier */
    }
  }
  async function dossierMemorise() {
    try {
      const db = await base();
      return await new Promise((ok) => {
        const r = db.transaction('dossiers').objectStore('dossiers').get('classe');
        r.onsuccess = () => ok(r.result || null);
        r.onerror = () => ok(null);
      });
    } catch {
      return null;
    }
  }

  // ---------- Alertes : une équipe devient « bloquée » ----------

  let alertesConnues = null; // clés déjà signalées (null : première lecture, rien n'est « nouveau »)
  const nouvelles = new Map(); // clé → heure d'apparition
  function verifierAlertes() {
    const liste = A.alertesClasse(fusion.equipes, seuils());
    const cles = new Set(liste.map((a) => a.cle));
    const apparues = alertesConnues ? liste.filter((a) => !alertesConnues.has(a.cle)) : [];
    for (const a of apparues) nouvelles.set(a.cle, new Date());
    for (const c of [...nouvelles.keys()]) if (!cles.has(c)) nouvelles.delete(c);
    alertesConnues = cles;
    dessinerAlertes(liste);
    if (apparues.length) prevenir(apparues);
  }

  function dessinerAlertes(liste) {
    const zone = $('.prof-alertes');
    zone.hidden = !liste.length;
    if (!liste.length) return;
    liste.sort((a, b) => (nouvelles.has(b.cle) ? 1 : 0) - (nouvelles.has(a.cle) ? 1 : 0));
    $('.alertes-liste', zone).innerHTML = liste
      .map((a) => {
        const n = nouvelles.get(a.cle);
        return (
          `<li class="${n ? 'nouvelle' : ''}"><button type="button" class="btn-lien" data-alerte="${echapper(a.cle.split('|').slice(0, 2).join('|'))}">` +
          `<strong>⚠ ${echapper(a.equipe)}</strong>${a.classe ? ' (' + echapper(a.classe) + ')' : ''}</button> : exercice ${a.id} · ${echapper(titre(a.id))} — ${echapper(a.raison)}` +
          (n ? ` <span class="badge-nouveau">nouveau · ${n.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>` : '') +
          '</li>'
        );
      })
      .join('');
    $('.alertes-titre', zone).textContent = `${liste.length} alerte${liste.length > 1 ? 's' : ''} « bloqué »`;
  }
  $('.prof-alertes').addEventListener('click', (e) => {
    const b = e.target.closest('[data-alerte]');
    if (!b) return;
    const eq = fusion.equipes.find((x) => x.cle === b.dataset.alerte);
    if (eq) ouvrirDetail(eq);
  });

  // Son court (deux notes) et notification du système si elle a été autorisée.
  function prevenir(apparues) {
    if ($('.alerte-son').checked) {
      try {
        const ctx = new (global.AudioContext || global.webkitAudioContext)();
        [660, 880].forEach((f, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.frequency.value = f;
          g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.18);
          g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + i * 0.18 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 0.16);
          o.connect(g).connect(ctx.destination);
          o.start(ctx.currentTime + i * 0.18);
          o.stop(ctx.currentTime + i * 0.18 + 0.2);
        });
      } catch {
        /* pas de son */
      }
    }
    if (global.Notification && Notification.permission === 'granted') {
      const a = apparues[0];
      const plus = apparues.length > 1 ? ` (+${apparues.length - 1} autre${apparues.length > 2 ? 's' : ''})` : '';
      try {
        new Notification('Atelier : équipe bloquée', { body: `${a.equipe}, exercice ${a.id} : ${a.raison}${plus}`, tag: 'atelier-alerte' });
      } catch {
        /* notifications indisponibles (ex. fichier ouvert hors serveur) */
      }
    }
  }
  const bNotif = $('.btn-notifications');
  if (!global.Notification) bNotif.hidden = true;
  else {
    const majNotif = () => {
      bNotif.disabled = Notification.permission !== 'default';
      bNotif.textContent = Notification.permission === 'granted' ? 'Notifications activées' : Notification.permission === 'denied' ? 'Notifications refusées par le navigateur' : 'Activer les notifications';
    };
    majNotif();
    bNotif.addEventListener('click', async () => {
      await Notification.requestPermission();
      majNotif();
    });
  }

  function messages() {
    const m = [];
    m.push(`<p><strong>${fusion.equipes.length} équipe${fusion.equipes.length > 1 ? 's' : ''}</strong> à partir de ${fichiers.length} fichier${fichiers.length > 1 ? 's' : ''}.</p>`);
    const doublons = fusion.equipes.filter((e) => e.autres.length);
    if (doublons.length) {
      m.push(
        '<details><summary>' + `${doublons.length} équipe${doublons.length > 1 ? 's ont' : ' a'} plusieurs fichiers : le plus récent est gardé.` + '</summary><ul>' +
          doublons.map((e) => `<li>${echapper(e.donnees.equipe.eleves.join(', '))} : gardé ${echapper(e.fichier)} ; ignoré ${e.autres.map(echapper).join(', ')}</li>`).join('') +
          '</ul></details>',
      );
    }
    if (fusion.invalides.length) {
      m.push(
        '<details><summary>' + `${fusion.invalides.length} fichier${fusion.invalides.length > 1 ? 's ignorés' : ' ignoré'} (pas une sauvegarde de l’atelier).` + '</summary><ul>' +
          fusion.invalides.map((i) => `<li>${echapper(i.nom)} : ${echapper(i.raison)}</li>`).join('') +
          '</ul></details>',
      );
    }
    if (fichiers.length) m.push('<button type="button" class="btn-lien btn-vider">Tout retirer</button>');
    $('.prof-messages').innerHTML = m.join('');
    const v = $('.btn-vider');
    if (v) v.addEventListener('click', () => {
      manuels = [];
      arreterSuivi();
      alertesConnues = null;
      recalculer();
      $('.prof-messages').innerHTML = '';
    });
  }

  // ---------- Tableau ----------

  const seuils = () => ({
    tentatives: Math.max(1, Number($('.seuil-tentatives').value) || A.SEUILS.tentatives),
    minutes: Math.max(1, Number($('.seuil-minutes').value) || A.SEUILS.minutes),
  });

  function selection() {
    const s = seuils();
    const classe = $('.filtre-classe').value;
    let liste = fusion.equipes.map((eq) => {
      const r = A.resumerEquipe(eq.donnees, s);
      r.note = A.noterEquipe(eq.donnees, bareme);
      r.carnet = avancementCarnet(eq.donnees);
      r.carnetTotal = A.PARTIES_CARNET.length;
      return { eq, r };
    });
    if (classe) liste = liste.filter((x) => x.r.classe === classe);
    if ($('.filtre-bloquees').checked) liste = liste.filter((x) => x.r.bloque);
    const tri = $('.tri').value;
    const nom = (x) => x.r.classe + ' ' + x.r.eleves.join(' ').toLowerCase();
    liste.sort((a, b) => {
      if (tri === 'avancement') return b.r.avancement - a.r.avancement || nom(a).localeCompare(nom(b));
      if (tri === 'activite') return (b.r.derniereActivite || '').localeCompare(a.r.derniereActivite || '');
      if (tri === 'note') return b.r.note.note - a.r.note.note || nom(a).localeCompare(nom(b));
      return nom(a).localeCompare(nom(b), 'fr');
    });
    return liste;
  }

  function majClasses() {
    const select = $('.filtre-classe');
    const choisie = select.value;
    const classes = [...new Set(fusion.equipes.map((e) => e.donnees.equipe.classe || ''))].sort();
    select.innerHTML = '<option value="">toutes</option>' + classes.map((c) => `<option${c === choisie ? ' selected' : ''}>${echapper(c)}</option>`).join('');
  }

  function cellule(c, id) {
    const statut = c.statut;
    const infos = [A.MOTS_STATUT[statut], `${c.tentatives} tentative${c.tentatives > 1 ? 's' : ''}`, `${c.indices} indice${c.indices > 1 ? 's' : ''}`, A.dureeLisible(c.temps)];
    if (c.bloque) infos.push('bloqué');
    const texte = statut === 'non_commence' && !c.tentatives ? A.SYMBOLES.non_commence : `${A.SYMBOLES[statut]} ${c.tentatives}`;
    return (
      `<td class="cellule statut-${statut}${c.bloque ? ' bloque' : ''}" title="Exercice ${id} : ${echapper(infos.join(', '))}">` +
      `${texte}${c.bloque ? ' <span class="alerte" aria-label="bloqué">⚠</span>' : ''}</td>`
    );
  }

  function dessiner() {
    const avecDonnees = fusion.equipes.length > 0;
    $('.prof-outils').hidden = !avecDonnees;
    $('.prof-bareme').hidden = !avecDonnees;
    $('.prof-resultats').hidden = !avecDonnees;
    if (!avecDonnees) return;
    majClasses();
    const liste = selection();
    const s = seuils();
    $('.titre-classe').textContent = $('.filtre-classe').value ? 'classe ' + $('.filtre-classe').value : 'toutes les classes';
    let h = '<thead><tr><th scope="col" class="col-equipe">Équipe</th>';
    for (const id of ORDRE) h += `<th scope="col" title="${echapper(titre(id))}">${id}</th>`;
    h += `<th scope="col">Avancement</th><th scope="col" title="Parties du carnet de projet terminées">Carnet</th><th scope="col" title="Exercices réussis du premier coup et sans indice">★ 1er coup</th><th scope="col">Note /${bareme.sur}</th><th scope="col">Dernière activité</th><th scope="col">Temps total</th></tr></thead><tbody>`;
    if (!liste.length) h += `<tr><td colspan="${ORDRE.length + 7}" class="prof-vide">Aucune équipe ne correspond aux filtres.</td></tr>`;
    liste.forEach((x, i) => {
      const r = x.r;
      h +=
        `<tr class="ligne-equipe${r.bloque ? ' equipe-bloquee' : ''}" data-i="${fusion.equipes.indexOf(x.eq)}" tabindex="0">` +
        `<th scope="row" class="col-equipe"><span class="nom-equipe">${echapper(r.eleves.join(', '))}</span>` +
        `<span class="classe-equipe">${echapper(r.classe)}${r.bloque ? ' · <strong>⚠ bloquée</strong>' : ''}` +
        `${misesAJour.has(x.eq.cle) ? ' · <span class="badge-maj">● vient d’avancer</span>' : ''}</span></th>` +
        ORDRE.map((id) => cellule(r.cellules[id], id)).join('') +
        `<td class="nombre">${r.avancement}/13</td><td class="nombre">${r.carnet}/${r.carnetTotal}</td><td class="nombre">${r.premierCoup ? '★ ' + r.premierCoup : '0'}</td><td class="nombre note">${A.nombreFr(r.note.note, 2)}</td>` +
        `<td>${echapper(A.dateCourte(r.derniereActivite))}</td><td class="nombre">${A.dureeLisible(r.tempsTotal)}</td></tr>`;
      void i;
    });
    const taux = A.tauxReussite(liste.map((x) => x.r));
    h += '</tbody><tfoot><tr><th scope="row" class="col-equipe">Taux de réussite</th>';
    for (const id of ORDRE) h += `<td class="nombre">${liste.length ? Math.round(taux[id] * 100) + ' %' : ''}</td>`;
    const notes = liste.map((x) => x.r.note.note);
    const moyenne = notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : 0;
    h += `<td></td><td></td><td></td><td class="nombre note" title="Moyenne des équipes affichées">moy. ${A.nombreFr(moyenne)}</td><td colspan="2"></td></tr></tfoot>`;
    $('.prof-tableau').innerHTML = h;
    $('.prof-legende').textContent =
      `✓ réussi · ● en cours · ○ non commencé. Le nombre est celui des tentatives (clics sur « Vérifier »). ` +
      `★ 1er coup : exercices réussis du premier coup et sans indice. ` +
      `⚠ bloqué : au moins ${s.tentatives} tentatives ou plus de ${s.minutes} min sur un exercice non réussi. Clique sur une équipe pour voir son détail.`;
  }

  for (const sel of ['.filtre-classe', '.tri', '.filtre-bloquees', '.seuil-tentatives', '.seuil-minutes']) {
    $(sel).addEventListener(sel.startsWith('.seuil') ? 'input' : 'change', () => {
      dessiner();
      if (sel.startsWith('.seuil')) {
        alertesConnues = null; // nouveaux seuils : on repart de l'état actuel, sans « nouvelles » alertes
        nouvelles.clear();
        verifierAlertes();
      }
    });
  }
  $('.prof-tableau').addEventListener('click', (e) => {
    const l = e.target.closest('.ligne-equipe');
    if (l) ouvrirDetail(fusion.equipes[Number(l.dataset.i)]);
  });
  $('.prof-tableau').addEventListener('keydown', (e) => {
    const l = e.target.closest('.ligne-equipe');
    if (l && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      ouvrirDetail(fusion.equipes[Number(l.dataset.i)]);
    }
  });

  // ---------- Détail d'une équipe ----------

  function heure(iso) {
    return iso ? A.dateCourte(iso) : '';
  }

  // Ouvre l'atelier en lecture avec ce programme (rien n'y est enregistré).
  function ouvrirDansAtelier(donnees, exercice, programme) {
    try {
      localStorage.setItem('atelier-cereales-revue', JSON.stringify({ donnees, exercice, programme }));
    } catch {
      alert('Le navigateur refuse de garder ce programme le temps de l’ouvrir (stockage plein ou navigation privée).');
      return;
    }
    global.open('index.html?revue=1', '_blank', 'noopener');
  }

  // ---------- Carnet de projet de l'équipe ----------

  const ex13 = exercices.find((e) => e.id === '13A');
  function avancementCarnet(d) {
    return A.avancementCarnet(d.carnet, A.carnet, ex13 ? ex13.composants : []);
  }

  // Réponses de l'équipe, élément par élément ou case par case, avec ✓ / ✗.
  function reponsesHtml(K, C, p) {
    const ligne = (etiquette, valeur, juste) =>
      `<li class="${juste === true ? 'rep-juste' : juste === false ? 'rep-faux' : 'rep-vide'}">` +
      `<span class="rep-marque" aria-hidden="true">${juste === true ? '✓' : juste === false ? '✗' : '○'}</span>` +
      `<strong>${echapper(etiquette)}</strong> : ${valeur ? echapper(valeur) : '<em>vide</em>'}</li>`;
    if (p === 'classement') {
      const titres = Object.fromEntries((C.colonnes || []).map((c) => [c.cle, c.titre]));
      return '<ul class="reponses">' + (C.classement || []).map((e) => {
        const place = K.classement[e.nom];
        return ligne(e.nom, place ? titres[place] || place : '', place ? place === e.place : null);
      }).join('') + '</ul>';
    }
    const algo = p === 'final' ? null : (C.algorigrammes || []).find((a) => a.id === p);
    const attendu = p === 'final' ? C.algoFinal.cases : A.attenduLineaire(algo);
    const r = A.corrigerAlgo(K.algos[p] || {}, attendu, p === 'final' ? C.algoFinal.groupes : []);
    const etiquette = (sid) => {
      if (p !== 'final') return 'Étape ' + sid.slice(1);
      const m = sid.match(/^s(\d+)([LR]?)$/);
      return (m[2] === 'L' ? 'Petite dose, case ' : m[2] === 'R' ? 'Grande dose, case ' : 'Début, case ') + m[1];
    };
    return '<ul class="reponses">' + Object.keys(attendu).map((sid) => {
      const t = (K.algos[p] || {})[sid];
      return ligne(etiquette(sid), t, t ? !r.mal.includes(sid) : null);
    }).join('') + '</ul>';
  }

  function carnetHtml(d, note) {
    const K = A.harmoniserClassement(A.completerCarnet(d.carnet), (A.carnet || {}).classement);
    const C = A.carnet || {};
    const etats = A.etatsCarnet(K, C, ex13 ? ex13.composants : []);
    const mot = { fait: '✓ fait', en_cours: '● en cours', a_faire: '○ à faire' };
    const verifs = (p) => {
      const v = K.verifications[p] || [];
      if (!v.length) return '';
      const reussie = v.findIndex((x) => x.reussi);
      const der = v[v.length - 1];
      return `${v.length} vérification${v.length > 1 ? 's' : ''}` +
        (reussie >= 0 ? ` · réussi à la ${reussie + 1}${reussie ? 'e' : 're'}` : ` · dernière : ${der.bien}/${der.total}`);
    };
    // Points : les parties notées (barème), « non noté » pour les autres.
    const points = (p) => (note.detail.some((x) => x.id === 'carnet:' + p) ? pointsHtml(note, 'carnet:' + p) : '<span class="points-raison">non noté</span>');
    const ligne = (p, contenu) =>
      `<tr><th scope="row">${A.NOMS_PARTIES_CARNET[p]}</th><td class="statut-${etats[p] === 'fait' ? 'reussi' : etats[p] === 'en_cours' ? 'en_cours' : 'non_commence'}">${mot[etats[p]]}</td>` +
      `<td>${contenu || ''}</td><td>${points(p)}</td></tr>`;
    const avecReponses = (p) => {
      const commence = p === 'classement' ? Object.keys(K.classement).length : Object.keys(K.algos[p] || {}).length;
      return (verifs(p) || '') + (commence ? `<details class="voir-reponses"><summary>Voir leurs réponses</summary>${reponsesHtml(K, C, p)}</details>` : '');
    };
    const idees = K.idees.filter((x) => x && x.trim());
    const couleurs = A.lignesCablage(ex13 ? ex13.composants : [])
      .filter((l) => !l.couleurImposee)
      .map((l) => `${l.broche} ${echapper(K.couleurs[l.broche] || '—')}`)
      .join(' · ');
    let h = `<h3>Carnet de projet · ${A.PARTIES_CARNET.filter((p) => etats[p] === 'fait').length}/${A.PARTIES_CARNET.length}</h3>`;
    h += '<table class="detail-tableau carnet-detail"><thead><tr><th>Partie</th><th>État</th><th>Travail</th><th>Points</th></tr></thead><tbody>';
    h += ligne('idees', idees.length ? '<ol>' + idees.map((i) => `<li>${echapper(i)}</li>`).join('') + '</ol>' : '');
    h += ligne('definition', K.definition ? `« ${echapper(K.definition)} »` : '');
    for (const p of ['classement', 'mouvement', 'trappe', 'final']) h += ligne(p, avecReponses(p));
    h += ligne('cablage', couleurs);
    return h + '</tbody></table>';
  }

  // Programme du distributeur envoyé dans la vraie carte (maquette).
  function envoisHtml(d) {
    const v = (d.envoisCarte || []).filter((x) => x.reussi);
    if (!v.length) return '<p class="detail-resume">Programme envoyé dans la carte Arduino : pas encore.</p>';
    const der = v[v.length - 1];
    return `<p class="detail-resume">Programme envoyé dans la carte Arduino : <strong>${v.length} fois</strong>, ` +
      `dernière fois le ${echapper(heure(der.date))} (version ${echapper(der.version)}).</p>`;
  }

  // « 1,2 / 1,6 » et la raison des retenues.
  function pointsHtml(note, id) {
    const x = note.detail.find((y) => y.id === id);
    if (!x) return id === '13B' ? (note.bonus ? `<strong>bonus +${A.nombreFr(note.bonus)}</strong>` : '<span class="points-raison">bonus si réussi</span>') : '';
    return (
      `<strong class="nombre">${A.nombreFr(x.pointsNote, 2)} / ${A.nombreFr(x.pointsNoteMax, 2)}</strong>` +
      `<span class="points-raison">${x.raisons.map(echapper).join(' · ')}</span>`
    );
  }

  let detailOuvert = null; // clé de l'équipe affichée dans le détail
  function rafraichirDetail() {
    if (!detailOuvert || !$('.prof-detail').open) return;
    const eq = fusion.equipes.find((x) => x.cle === detailOuvert);
    if (eq) ouvrirDetail(eq, true);
  }

  function ouvrirDetail(eq, miseAJour) {
    detailOuvert = eq.cle;
    const d = eq.donnees;
    // Garder les historiques ouverts et la position de lecture pendant une mise à jour en direct.
    const ouverts = miseAJour ? new Set([...document.querySelectorAll('.historique[open] summary')].map((s) => s.textContent.split(' — ')[0])) : null;
    const defilement = miseAJour ? $('.prof-detail').scrollTop : 0;
    const r = A.resumerEquipe(d, seuils());
    const note = A.noterEquipe(d, bareme);
    const dialogue = $('.prof-detail');
    $('#detail-titre').textContent = `${d.equipe.eleves.join(', ')}${d.equipe.classe ? ' · ' + d.equipe.classe : ''}`;
    let h =
      `<p class="detail-note">Note : <strong>${A.nombreFr(note.note, 2)}/${note.sur}</strong>` +
      `${note.bonus ? ` (dont bonus 13B : +${A.nombreFr(note.bonus)})` : ''}</p>` +
      `<p class="detail-resume"><strong>${r.avancement}/13</strong> exercices réussis, dont <strong>★ ${r.premierCoup}</strong> du premier coup sans indice · ${A.dureeLisible(r.tempsTotal)} de travail · ` +
      `dernière activité ${echapper(heure(r.derniereActivite))} · fichier ${echapper(eq.fichier)}` +
      `${d.exercice13 && d.exercice13.versionReussie ? ' · exercice 13 réussi en version ' + d.exercice13.versionReussie : ''}</p>` +
      envoisHtml(d);
    h +=
      '<table class="detail-tableau"><thead><tr><th>Exercice</th><th>Statut</th><th>Tentatives</th><th>Échecs</th><th>Indices</th>' +
      '<th>Temps</th><th>Première réussite</th><th>Points</th><th></th></tr></thead><tbody>';
    for (const id of ORDRE) {
      const c = r.cellules[id];
      const e = d.exercices[id];
      h +=
        `<tr class="${c.bloque ? 'bloque' : ''}"><th scope="row">${id} · ${echapper(titre(id))}</th>` +
        `<td class="statut-${c.statut}">${A.SYMBOLES[c.statut]} ${A.MOTS_STATUT[c.statut]}${c.bloque ? ' ⚠' : ''}</td>` +
        `<td class="nombre">${c.tentatives}</td><td class="nombre">${c.echecs}</td><td class="nombre">${c.indices}/3</td>` +
        `<td class="nombre">${c.temps ? A.dureeLisible(c.temps) : ''}</td><td>${echapper(heure(c.premiereReussite))}</td>` +
        `<td>${pointsHtml(note, id)}</td>` +
        `<td>${e && e.programme ? `<button type="button" class="btn-lien" data-ouvrir="${id}">Lancer le programme</button>` : ''}</td></tr>`;
    }
    h += '</tbody></table>';

    h += carnetHtml(d, note);

    // Historique : chaque vérification (avec tous les écarts et le programme du moment) et chaque indice.
    h += '<h3>Historique</h3>';
    let vide = true;
    for (const id of ORDRE) {
      const e = d.exercices[id];
      if (!e || !e.historique || !e.historique.length) continue;
      vide = false;
      h += `<details class="historique"><summary>Exercice ${id} · ${echapper(titre(id))} — ${e.historique.length} événement${e.historique.length > 1 ? 's' : ''}</summary><ol>`;
      e.historique.forEach((ev, k) => {
        if (ev.type === 'indice') {
          h += `<li class="ev-indice"><span class="ev-heure">${echapper(heure(ev.date))}</span> Indice ${ev.niveau} ouvert</li>`;
          return;
        }
        h +=
          `<li class="${ev.reussi ? 'ev-reussi' : 'ev-ecart'}"><span class="ev-heure">${echapper(heure(ev.date))}</span> ` +
          (ev.reussi ? '<strong>✓ Vérification réussie</strong>' : '<strong>Vérification : écart</strong>');
        if (!ev.reussi) {
          const ecarts = ev.ecarts && ev.ecarts.length ? ev.ecarts : [ev.message];
          h += '<ul class="ev-ecarts">' + ecarts.map((m) => `<li>${echapper(m)}</li>`).join('') + '</ul>';
          if (ev.notes) h += '<ul class="ev-notes">' + ev.notes.map((n) => `<li>${echapper(n)}</li>`).join('') + '</ul>';
        }
        if (ev.programme) {
          h +=
            `<div class="ev-actions"><button type="button" class="btn-lien" data-blocs="${id}|${k}">Voir les blocs</button>` +
            `<button type="button" class="btn-lien" data-lancer="${id}|${k}">Lancer ce programme</button></div><div class="ev-blocs" hidden></div>`;
        }
        h += '</li>';
      });
      h += '</ol></details>';
    }
    if (vide) h += '<p>Aucune vérification ni aucun indice pour l’instant.</p>';
    $('.detail-corps').innerHTML = h;

    $('.detail-corps').onclick = (ev) => {
      const b = ev.target.closest('button');
      if (!b) return;
      if (b.dataset.ouvrir) return ouvrirDansAtelier(d, b.dataset.ouvrir, d.exercices[b.dataset.ouvrir].programme);
      const [id, k] = (b.dataset.blocs || b.dataset.lancer || '').split('|');
      if (!id) return;
      const programme = d.exercices[id].historique[Number(k)].programme;
      if (b.dataset.lancer) return ouvrirDansAtelier(d, id, programme);
      const zoneBlocs = b.closest('li').querySelector('.ev-blocs');
      if (zoneBlocs.hidden) zoneBlocs.innerHTML = A.blocsHtml(programme, { avecVides: true });
      zoneBlocs.hidden = !zoneBlocs.hidden;
      b.textContent = zoneBlocs.hidden ? 'Voir les blocs' : 'Masquer les blocs';
    };
    if (ouverts) for (const det of document.querySelectorAll('.historique')) if (ouverts.has(det.querySelector('summary').textContent.split(' — ')[0])) det.open = true;
    if (!dialogue.open) dialogue.showModal();
    dialogue.scrollTop = defilement;
  }
  $('.btn-fermer-detail').addEventListener('click', () => $('.prof-detail').close());

  // ---------- Exports ----------

  function nomExport(extension) {
    const classe = $('.filtre-classe').value || 'toutes-classes';
    const jour = new Date().toISOString().slice(0, 10);
    return `atelier-cereales-${classe}-${jour}.${extension}`;
  }
  function telecharger(contenu, type, nom) {
    const url = URL.createObjectURL(new Blob([contenu], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nom;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  $('.btn-csv').addEventListener('click', () => {
    const liste = selection();
    const t = A.tableauClasse(liste.map((x) => x.r), seuils());
    telecharger(A.enCsv(t.entete, [...t.lignes, [], t.legende]), 'text/csv;charset=utf-8', nomExport('csv'));
  });
  $('.btn-xlsx').addEventListener('click', () => {
    const liste = selection();
    const t = A.tableauClasse(liste.map((x) => x.r), seuils());
    const det = A.detailClasse(liste.map((x) => x.eq), seuils(), bareme);
    const octets = A.classeurXlsx([
      { nom: 'Classe', entete: t.entete, lignes: [...t.lignes, [], t.legende] },
      { nom: 'Détail par exercice', entete: det.entete, lignes: det.lignes },
    ]);
    telecharger(octets, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', nomExport('xlsx'));
  });
  $('.btn-imprimer').addEventListener('click', () => global.print());

  // ---------- Barème réglable dans la page ----------

  const zoneBareme = $('.prof-bareme');
  const NOMS_CARNET_BAREME = { classement: 'Carnet · classement', mouvement: 'Carnet · algorigramme 1', trappe: 'Carnet · algorigramme 2' };
  $('.bareme-coefs').innerHTML =
    Object.keys(A.BAREME_DEFAUT.coefficients)
      .map((id) => `<label title="${echapper(titre(id))}">Ex. ${id} <input type="number" data-coef="${id}" min="0" max="10" step="0.5"></label>`)
      .join('') +
    Object.keys(A.BAREME_DEFAUT.carnet)
      .map((p) => `<label>${NOMS_CARNET_BAREME[p]} <input type="number" data-coef-carnet="${p}" min="0" max="10" step="0.5"></label>`)
      .join('');
  function remplirBareme() {
    for (const el of zoneBareme.querySelectorAll('[data-b]')) {
      const v = bareme[el.dataset.b];
      el.value = el.hasAttribute('data-pourcent') ? Math.round(v * 100) : String(v);
    }
    for (const el of zoneBareme.querySelectorAll('[data-coef]')) el.value = bareme.coefficients[el.dataset.coef];
    for (const el of zoneBareme.querySelectorAll('[data-coef-carnet]')) el.value = bareme.carnet[el.dataset.coefCarnet];
    resumerBareme();
  }
  function resumerBareme() {
    $('.bareme-resume').textContent =
      `· sur ${bareme.sur}, ${bareme.objectif} exercices attendus, −${Math.round(bareme.penaliteIndice * 100)} % par indice, ` +
      `−${Math.round(bareme.penaliteEchec * 100)} % par essai raté${bareme.essaisGratuits ? ` au-delà de ${bareme.essaisGratuits}` : ''}, ` +
      `avance : ${Math.round(bareme.avance * 100)} %, ` +
      `commencé : ${Math.round(bareme.participation * 100)} %, bonus 13B : +${A.nombreFr(bareme.bonus13B)}`;
  }
  zoneBareme.addEventListener('input', (e) => {
    const el = e.target;
    const v = Number(el.value);
    if (el.value === '' || !Number.isFinite(v) || v < 0) return;
    if (el.dataset.coef) bareme.coefficients[el.dataset.coef] = v;
    else if (el.dataset.coefCarnet) bareme.carnet[el.dataset.coefCarnet] = v;
    else if (el.dataset.b) bareme[el.dataset.b] = el.hasAttribute('data-pourcent') ? v / 100 : v;
    resumerBareme();
    dessiner();
  });
  $('.btn-bareme-fichier').addEventListener('click', () => {
    bareme = A.completerBareme(A.bareme);
    remplirBareme();
    dessiner();
  });
  remplirBareme();
})(this);
