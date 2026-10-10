// Outil professeur : import des sauvegardes, tableau de la classe, détail d'une équipe, exports.
(function (global) {
  'use strict';

  const A = global.Atelier;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (s) => String(s === null || s === undefined ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const ORDRE = A.ORDRE_PARCOURS;
  const exercices = A.catalogue.exercices();
  const titre = (id) => (exercices.find((e) => e.id === id) || {}).titre || '';

  let fichiers = []; // { nom, texte } : tout ce qui a été importé
  let bareme = A.completerBareme(A.bareme);
  let fusion = { equipes: [], invalides: [] };

  // ---------- Import ----------

  async function ajouter(nouveaux) {
    // Un même fichier importé deux fois n'est compté qu'une fois.
    const cle = (f) => f.nom + '|' + f.texte.length + '|' + f.texte.slice(-60);
    const vus = new Set(fichiers.map(cle));
    for (const f of nouveaux) if (!vus.has(cle(f))) fichiers.push(f);
    fusion = A.fusionnerEquipes(fichiers);
    messages();
    dessiner();
  }

  async function lireFichiers(liste) {
    const sortie = [];
    for (const f of liste) if (/\.json$/i.test(f.name)) sortie.push({ nom: f.name, texte: await f.text() });
    return sortie;
  }

  // Tous les .json du dossier choisi et de ses sous-dossiers (ex. DISTRIBUTEUR DE CEREALES › Léa_Hugo › Léa_Hugo.json).
  async function lireDossier(dossier, chemin, profondeur) {
    const sortie = [];
    for await (const entree of dossier.values()) {
      if (entree.kind === 'file' && /\.json$/i.test(entree.name)) {
        sortie.push({ nom: chemin + entree.name, texte: await (await entree.getFile()).text() });
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
      ajouter(await lireDossier(dossier, dossier.name + ' › ', 0));
    });
  } else $('.zone-depot-aide').textContent = 'Sur ce navigateur, sélectionne tous les fichiers .json d’un coup (Ctrl+A dans la fenêtre).';

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
      fichiers = [];
      fusion = { equipes: [], invalides: [] };
      $('.prof-messages').innerHTML = '';
      dessiner();
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
    h += `<th scope="col">Avancement</th><th scope="col">Note /${bareme.sur}</th><th scope="col">Dernière activité</th><th scope="col">Temps total</th></tr></thead><tbody>`;
    if (!liste.length) h += `<tr><td colspan="${ORDRE.length + 5}" class="prof-vide">Aucune équipe ne correspond aux filtres.</td></tr>`;
    liste.forEach((x, i) => {
      const r = x.r;
      h +=
        `<tr class="ligne-equipe${r.bloque ? ' equipe-bloquee' : ''}" data-i="${fusion.equipes.indexOf(x.eq)}" tabindex="0">` +
        `<th scope="row" class="col-equipe"><span class="nom-equipe">${echapper(r.eleves.join(', '))}</span>` +
        `<span class="classe-equipe">${echapper(r.classe)}${r.bloque ? ' · <strong>⚠ bloquée</strong>' : ''}</span></th>` +
        ORDRE.map((id) => cellule(r.cellules[id], id)).join('') +
        `<td class="nombre">${r.avancement}/13</td><td class="nombre note">${A.nombreFr(r.note.note, 2)}</td>` +
        `<td>${echapper(A.dateCourte(r.derniereActivite))}</td><td class="nombre">${A.dureeLisible(r.tempsTotal)}</td></tr>`;
      void i;
    });
    const taux = A.tauxReussite(liste.map((x) => x.r));
    h += '</tbody><tfoot><tr><th scope="row" class="col-equipe">Taux de réussite</th>';
    for (const id of ORDRE) h += `<td class="nombre">${liste.length ? Math.round(taux[id] * 100) + ' %' : ''}</td>`;
    const notes = liste.map((x) => x.r.note.note);
    const moyenne = notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : 0;
    h += `<td></td><td class="nombre note" title="Moyenne des équipes affichées">moy. ${A.nombreFr(moyenne)}</td><td colspan="2"></td></tr></tfoot>`;
    $('.prof-tableau').innerHTML = h;
    $('.prof-legende').textContent =
      `✓ réussi · ● en cours · ○ non commencé. Le nombre est celui des tentatives (clics sur « Vérifier »). ` +
      `⚠ bloqué : au moins ${s.tentatives} tentatives ou plus de ${s.minutes} min sur un exercice non réussi. Clique sur une équipe pour voir son détail.`;
  }

  for (const sel of ['.filtre-classe', '.tri', '.filtre-bloquees', '.seuil-tentatives', '.seuil-minutes']) {
    $(sel).addEventListener(sel.startsWith('.seuil') ? 'input' : 'change', dessiner);
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

  // « 1,2 / 1,6 » et la raison des retenues.
  function pointsHtml(note, id) {
    const x = note.detail.find((y) => y.id === id);
    if (!x) return id === '13B' ? (note.bonus ? `<strong>bonus +${A.nombreFr(note.bonus)}</strong>` : '<span class="points-raison">bonus si réussi</span>') : '';
    return (
      `<strong class="nombre">${A.nombreFr(x.pointsNote, 2)} / ${A.nombreFr(x.pointsNoteMax, 2)}</strong>` +
      `<span class="points-raison">${x.raisons.map(echapper).join(' · ')}</span>`
    );
  }

  function ouvrirDetail(eq) {
    const d = eq.donnees;
    const r = A.resumerEquipe(d, seuils());
    const note = A.noterEquipe(d, bareme);
    const dialogue = $('.prof-detail');
    $('#detail-titre').textContent = `${d.equipe.eleves.join(', ')}${d.equipe.classe ? ' · ' + d.equipe.classe : ''}`;
    let h =
      `<p class="detail-note">Note : <strong>${A.nombreFr(note.note, 2)}/${note.sur}</strong>` +
      `${note.bonus ? ` (dont bonus 13B : +${A.nombreFr(note.bonus)})` : ''}</p>` +
      `<p class="detail-resume"><strong>${r.avancement}/13</strong> exercices réussis · ${A.dureeLisible(r.tempsTotal)} de travail · ` +
      `dernière activité ${echapper(heure(r.derniereActivite))} · fichier ${echapper(eq.fichier)}` +
      `${d.exercice13 && d.exercice13.versionReussie ? ' · exercice 13 réussi en version ' + d.exercice13.versionReussie : ''}</p>`;
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
    dialogue.showModal();
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
  $('.bareme-coefs').innerHTML = Object.keys(A.BAREME_DEFAUT.coefficients)
    .map((id) => `<label title="${echapper(titre(id))}">Ex. ${id} <input type="number" data-coef="${id}" min="0" max="10" step="0.5"></label>`)
    .join('');
  function remplirBareme() {
    for (const el of zoneBareme.querySelectorAll('[data-b]')) {
      const v = bareme[el.dataset.b];
      el.value = el.hasAttribute('data-pourcent') ? Math.round(v * 100) : String(v);
    }
    for (const el of zoneBareme.querySelectorAll('[data-coef]')) el.value = bareme.coefficients[el.dataset.coef];
    resumerBareme();
  }
  function resumerBareme() {
    $('.bareme-resume').textContent =
      `· sur ${bareme.sur}, ${bareme.objectif} exercices attendus, −${Math.round(bareme.penaliteIndice * 100)} % par indice, ` +
      `−${Math.round(bareme.penaliteEchec * 100)} % par essai raté au-delà de ${bareme.essaisGratuits}, ` +
      `commencé : ${Math.round(bareme.participation * 100)} %, bonus 13B : +${A.nombreFr(bareme.bonus13B)}`;
  }
  zoneBareme.addEventListener('input', (e) => {
    const el = e.target;
    const v = Number(el.value);
    if (el.value === '' || !Number.isFinite(v) || v < 0) return;
    if (el.dataset.coef) bareme.coefficients[el.dataset.coef] = v;
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
