// Tutoriel Arduino et câblage : rubriques, câblage du distributeur (depuis l'exercice 13A), composants.
(function (global) {
  'use strict';

  const A = global.Atelier;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const echapper = (s) => String(s === null || s === undefined ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const ordre = $$('.tuto-rubriques [data-rubrique]').map((b) => b.dataset.rubrique);
  const titres = Object.fromEntries($$('.tuto-rubriques [data-rubrique]').map((b) => [b.dataset.rubrique, b.textContent]));

  function montrer(cle) {
    if (!ordre.includes(cle)) cle = 'accueil';
    for (const s of $$('.rubrique')) s.hidden = s.dataset.rubrique !== cle;
    for (const b of $$('.tuto-rubriques [data-rubrique]')) b.setAttribute('aria-current', b.dataset.rubrique === cle ? 'page' : 'false');
    const i = ordre.indexOf(cle);
    $('.tuto-position').textContent = i ? `Rubrique ${i} / ${ordre.length - 1}` : '';
    const suivant = ordre[i + 1];
    $('.tuto-suivant').innerHTML =
      (i > 1 ? `<button type="button" class="btn-secondaire" data-aller="${ordre[i - 1]}">← ${echapper(titres[ordre[i - 1]])}</button>` : '') +
      (suivant && i ? `<button type="button" class="btn-principal" data-aller="${suivant}">${echapper(titres[suivant])} →</button>` : '');
    history.replaceState(null, '', '#' + cle);
    scrollTo(0, 0);
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-rubrique], [data-aller]');
    if (b && b.tagName === 'BUTTON') montrer(b.dataset.aller || b.dataset.rubrique);
  });

  // Câblage du distributeur : les composants de l'exercice 13A (mêmes broches que les programmes).
  const ex13 = A.catalogue.exercices().find((e) => e.id === '13A');
  $('.tableau-distributeur tbody').innerHTML = A.lignesCablage(ex13 ? ex13.composants : [])
    .map((l) => `<tr><td><strong>${echapper(l.nom)}</strong></td><td><span class="role role-${l.role}">${l.role === 'capteur' ? 'Capteur' : 'Actionneur'}</span></td>` +
      `<td><span class="broche-cablage">${l.broche}</span></td></tr>`)
    .join('');

  // Composants : filtre et fiches dépliables.
  let filtre = 'tous';
  const ouverts = new Set(['led']);
  function composants() {
    const liste = (A.composantsTuto || []).filter((c) => filtre === 'tous' || c.type === filtre);
    $('.liste-composants').innerHTML = liste.map((c) => {
      const ouvert = ouverts.has(c.id);
      return (
        `<article class="fiche-composant${ouvert ? ' ouverte' : ''}">` +
        `<button type="button" class="fiche-entete" data-composant="${c.id}" aria-expanded="${ouvert}">` +
        `<img src="${echapper(c.photo)}" alt="" width="64" height="64"><span class="fiche-nom">${echapper(c.nom)}</span>` +
        `<span class="role role-${c.type === 'Capteur' ? 'capteur' : 'actionneur'}">${c.type}</span><span class="chevron" aria-hidden="true">▾</span></button>` +
        (ouvert
          ? '<div class="fiche-corps"><h4>Branchement</h4><ul>' +
            c.branchement.map((b) => `<li><span class="fil" style="background:${echapper(b.couleur)}"></span>${echapper(b.texte)}</li>`).join('') +
            '</ul>' + (c.note ? `<p class="info">${echapper(c.note)}</p>` : '') + '</div>'
          : '') +
        '</article>'
      );
    }).join('');
  }
  $('.liste-composants').addEventListener('click', (e) => {
    const b = e.target.closest('[data-composant]');
    if (!b) return;
    if (ouverts.has(b.dataset.composant)) ouverts.delete(b.dataset.composant);
    else ouverts.add(b.dataset.composant);
    composants();
  });
  $('.filtres').addEventListener('click', (e) => {
    const b = e.target.closest('[data-filtre]');
    if (!b) return;
    filtre = b.dataset.filtre;
    for (const x of $$('.filtres button')) x.setAttribute('aria-pressed', String(x === b));
    composants();
  });

  composants();
  addEventListener('hashchange', () => montrer(location.hash.slice(1)));
  montrer(location.hash.slice(1) || 'accueil');
})(this);
