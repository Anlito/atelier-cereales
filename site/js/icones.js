// Icônes en trait épais (d'après les maquettes Claude Design). Chaque icône est un chemin SVG 24×24.
(function (global) {
  'use strict';

  const CHEMINS = {
    retour: 'M15 5l-7 7 7 7',
    equipe: 'M9 4.5a3.5 3.5 0 1 0 0.01 0zM2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.8a3.3 3.3 0 0 1 0 6.4M18 14.8c1.8.7 3 2.4 3.5 5.2',
    crayon: 'M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3',
    livre: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5',
    chevronHaut: 'M6 15l6-6 6 6',
    chevronBas: 'M6 9l6 6 6-6',
    horloge: 'M12 5a8 8 0 1 0 0.01 0zM12 9v4l2.5 2M9.5 2.5h5',
    pause: 'M8 5v14M16 5v14',
    recommencer: 'M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5',
    info: 'M12 3a9 9 0 1 0 0.01 0zM12 11v6M12 7.5v.5',
    ampoule: 'M9 18h6M10 21h4M8.5 14.5a6 6 0 1 1 7 0c-.9.8-1.5 1.8-1.5 3.5h-4c0-1.7-.6-2.7-1.5-3.5z',
    disquette: 'M5 3h11l3 3v15H5zM8 3v5h7V3M8 21v-7h8v7',
    coche: 'M12 3a9 9 0 1 0 0.01 0zM8 12.5l2.8 2.8L16.5 9.5',
    corbeille: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5',
    annuler: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
    retablir: 'M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3',
    recentrer: 'M12 8a4 4 0 1 0 0.01 0zM12 2v3M12 19v3M2 12h3M19 12h3',
    pas: 'M6 5v14M10 5l9 7-9 7z',
    oeil: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0.01 0z',
    suivant: 'M9 5l7 7-7 7',
    // Catégories de blocs
    lumiere: 'M8 15V10a4 4 0 0 1 8 0v5zM6 15h12M10 15v5M14 15v4',
    temps: 'M12 3.5a8.5 8.5 0 1 0 0.01 0zM12 7.5V12l3 2',
    bouton: 'M4 14h16v6H4zM8 14v-3a4 4 0 0 1 8 0v3',
    moteur: 'M4 12h16v8H4zM8 12V8M5 8h14',
    decisions: 'M12 3l9 9-9 9-9-9zM12 8v5M12 16v.5',
    variables: 'M5 8h14v12H5zM8 8V5h8v3M9 13h6',
  };

  // <svg> prêt à insérer dans du HTML.
  function icone(nom, options) {
    const o = options || {};
    const epaisseur = o.epaisseur || 2.6;
    const couleur = o.couleur || 'currentColor';
    return (
      `<svg class="icone ${o.classe || ''}" viewBox="0 0 24 24" aria-hidden="true" ` +
      `style="fill:none;stroke:${couleur};stroke-width:${epaisseur};stroke-linecap:round;stroke-linejoin:round">` +
      `<path d="${CHEMINS[nom]}"></path></svg>`
    );
  }

  // Icône pleine « lecture » (triangle).
  const LECTURE = '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" style="fill:currentColor"><path d="M7 4.5v15l12-7.5z"></path></svg>';

  // Image data: URI (pour les blocs Blockly et les tuiles de catégorie).
  function imageIcone(nom, couleur, epaisseur) {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${couleur || '#1F2A30'}" ` +
      `stroke-width="${epaisseur || 2.4}" stroke-linecap="round" stroke-linejoin="round"><path d="${CHEMINS[nom]}"/></svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  global.Atelier = global.Atelier || {};
  Object.assign(global.Atelier, { icone, imageIcone, LECTURE, CHEMINS_ICONES: CHEMINS });
})(this);
