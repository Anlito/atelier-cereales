// Labo Blocs 0.3.0 — interface. Fichier construit par « npm run module » : ne pas modifier ici.
// ===== interface/gabarits.js =====
// Gabarits HTML des écrans partagés : le bandeau et l'écran d'exercice (A4, A5). Le site de Labo Blocs et les
// projets (distributeur de céréales…) affichent ainsi exactement le même écran.
(function (global) {
  'use strict';

  const A = (global.LaboBlocs = global.LaboBlocs || {});

  const BANDEAU = `<header class="bandeau">
  <div class="bandeau-accent"></div>
  <div class="bandeau-barre">
    <img class="logo" alt="" width="34" height="34">
    <div class="bandeau-titre">
      <strong class="titre-projet"></strong>
      <span class="equipe-texte"></span>
    </div>
    <button type="button" class="btn-onglet btn-vers-parcours" hidden><span data-icone="retour" data-epaisseur="2.8"></span>Parcours</button>
    <div class="bandeau-avancement" hidden>
      <span class="avancement-texte"></span>
      <div class="segments" role="img"></div>
    </div>
    <span class="espace"></span>
    <button type="button" class="btn-onglet btn-plein-ecran" hidden><span data-icone="pleinEcran" data-epaisseur="2.4"></span><span class="texte-plein-ecran">Plein écran</span></button>
    <span class="etat-enregistrement" aria-live="polite" hidden></span>
    <button type="button" class="btn-onglet btn-enregistrer" hidden><span data-icone="disquette" data-epaisseur="2.4"></span>Enregistrer</button>
  </div>
</header>`;

  const EXERCICE = `<div class="ecran ecran-exercice" hidden>
  <section class="carte consigne" aria-label="Consigne">
    <div class="consigne-tete">
      <span class="consigne-numero"></span>
      <h1 class="titre-exercice"></h1>
      <div class="consigne-actions">
        <button type="button" class="btn-aide" data-aide="fiche" aria-expanded="false"><span data-icone="info"></span>À savoir</button>
        <button type="button" class="btn-aide btn-lexique"><span data-icone="livre"></span>Lexique</button>
        <button type="button" class="btn-reduire-consigne" aria-expanded="true"><span class="texte-reduire">Masquer le texte</span></button>
      </div>
    </div>
    <div class="consigne-texte"></div>
    <div class="bulle" role="dialog" aria-label="Définition" hidden>
      <div class="bulle-entete"><strong class="bulle-mot"></strong><button type="button" class="bulle-fermer" aria-label="Fermer">×</button></div>
      <p class="bulle-definition"></p>
    </div>
  </section>

  <aside class="colonne-aide">
    <button type="button" class="bande-repliee" data-colonne="gauche" aria-expanded="false" title="Afficher les composants et l’aide">
      <span data-icone="chevronDroite" data-epaisseur="2.8"></span><span class="bande-texte">Composants et aide</span>
    </button>
    <section class="carte carte-aide" aria-label="Indices">
      <div class="aide-tete"><h2>Besoin d’aide ?</h2><span class="compteur compteur-indices"></span></div>
      <p class="aide-texte">Les indices s’ouvrent un par un. Ton professeur voit combien tu en as utilisé.</p>
      <button type="button" class="btn-secondaire btn-indice" data-aide="indice" aria-expanded="false"><span data-icone="ampoule"></span><span class="texte-indice">Ouvrir l’indice 1</span></button>
    </section>
    <section class="carte composants-liste" aria-label="Composants">
      <h2>Composants</h2>
      <ul class="liste-composants"></ul>
    </section>
  </aside>

  <main class="colonne-programme">
    <div class="programme-tete">
      <h2>Mon programme</h2>
      <button type="button" class="btn-onglet btn-solution" hidden title="Remplacer le programme affiché par la solution de référence"><span data-icone="oeil" data-epaisseur="2.4"></span>Solution</button>
      <div class="niveaux" role="group" aria-label="Niveau">
        <span class="niveaux-libelle">Niveau</span>
        <button type="button" class="btn-niveau" data-niveau="1" aria-pressed="true">1 · Premiers pas</button>
        <button type="button" class="btn-niveau" data-niveau="2" aria-pressed="false">2 · Boucles</button>
        <button type="button" class="btn-niveau" data-niveau="3" aria-pressed="false">3 · Code</button>
      </div>
    </div>
    <section class="editeur" aria-label="Éditeur de blocs">
      <div class="editeur-blockly"></div>
      <div class="editeur-etiquettes" aria-hidden="true"></div>
      <aside class="panneau-aide" aria-labelledby="titre-aide" hidden>
        <div class="panneau-aide-entete">
          <span class="panneau-aide-icone"></span>
          <h2 class="panneau-aide-titre" id="titre-aide"></h2>
          <button type="button" class="panneau-aide-fermer" aria-label="Fermer">×</button>
        </div>
        <div class="panneau-aide-corps"></div>
      </aside>
      <div class="editeur-outils">
        <div class="groupe-outils">
          <button type="button" class="btn-annuler" aria-label="Annuler" title="Annuler (Ctrl+Z)"><span data-icone="annuler"></span></button>
          <button type="button" class="btn-retablir" aria-label="Rétablir" title="Rétablir (Ctrl+Y)"><span data-icone="retablir"></span></button>
        </div>
        <div class="groupe-outils">
          <button type="button" class="btn-zoom-moins" aria-label="Dézoomer">−</button>
          <span class="zoom-valeur">100 %</span>
          <button type="button" class="btn-zoom-plus" aria-label="Zoomer">+</button>
        </div>
        <div class="groupe-outils">
          <button type="button" class="btn-recentrer" aria-label="Recentrer" title="Recentrer"><span data-icone="recentrer"></span></button>
        </div>
      </div>
    </section>
    <section class="code-arduino" aria-label="Code Arduino" hidden>
      <div class="code-tete"><strong>Code Arduino · niveau 3, lecture seule</strong><span>Clique sur un bloc : ses lignes se surlignent</span></div>
      <pre class="code-lignes"></pre>
    </section>
    <!-- Languettes sur les bords : replier ou rouvrir la colonne voisine -->
    <button type="button" class="btn-plier" data-colonne="gauche" aria-expanded="true" title="Replier les composants et l’aide pour agrandir le programme">
      <span data-icone="chevronGauche" data-epaisseur="2.8"></span><span class="texte-plier">Replier les composants et l’aide</span>
    </button>
    <button type="button" class="btn-plier" data-colonne="droite" aria-expanded="true" title="Replier le simulateur pour agrandir le programme">
      <span class="texte-plier">Replier le simulateur</span><span data-icone="chevronDroite" data-epaisseur="2.8"></span>
    </button>
  </main>

  <aside class="colonne-test">
    <button type="button" class="bande-repliee" data-colonne="droite" aria-expanded="false" title="Afficher le simulateur">
      <span data-icone="chevronGauche" data-epaisseur="2.8"></span><span class="bande-texte">Tester et vérifier</span>
    </button>
    <section class="carte simulateur" aria-label="Tester">
      <div class="simu-titre">
        <span>Tester</span>
        <div class="modes" role="group" aria-label="Mode">
          <button type="button" class="btn-mode" data-mode="simulateur" aria-pressed="true">Simulateur</button>
          <button type="button" class="btn-mode" data-mode="direct" aria-pressed="false" hidden>En direct</button>
          <button type="button" class="btn-mode" data-mode="carte" aria-pressed="false" hidden>Dans la carte</button>
        </div>
      </div>
      <div class="simu-carte"></div>
      <div class="simu-milieu">
        <div class="simu-composants"></div>
        <div class="simu-distributeur"></div>
      </div>
      <div class="simu-ligne">
        <span class="simu-note" aria-live="polite"></span>
        <div class="chrono" aria-label="Temps de la simulation"><span data-icone="horloge" data-epaisseur="2.4"></span><span class="chrono-valeur">00:00</span></div>
      </div>
      <div class="simu-commandes">
        <button type="button" class="btn-lancer" aria-pressed="false"><span data-icone="lecture"></span>Lancer</button>
        <button type="button" class="btn-commande btn-pause" disabled><span data-icone="pause" data-epaisseur="3.4"></span>Pause</button>
        <button type="button" class="btn-commande btn-pas" title="Pas à pas : un bloc à la fois"><span data-icone="pas" data-epaisseur="2.6"></span>Pas</button>
        <button type="button" class="btn-commande btn-recommencer" disabled aria-label="Recommencer"><span data-icone="recommencer" data-epaisseur="2.8"></span></button>
        <div class="vitesse" role="group" aria-label="Vitesse">
          <button type="button" class="btn-vitesse" data-vitesse="1" aria-pressed="true">×1</button>
          <button type="button" class="btn-vitesse" data-vitesse="2" aria-pressed="false">×2</button>
          <button type="button" class="btn-vitesse" data-vitesse="5" aria-pressed="false">×5</button>
        </div>
      </div>
    </section>
    <section class="carte verification">
      <button type="button" class="btn-verifier"><span data-icone="coche"></span>Vérifier mon programme</button>
      <div class="resultat" role="status" aria-live="polite" hidden></div>
    </section>
  </aside>

  <dialog class="dialogue-lexique" aria-label="Lexique">
    <div class="dialogue-entete">
      <span data-icone="livre" data-epaisseur="2.4"></span>
      <strong>Lexique</strong>
      <button type="button" class="btn-fermer-lexique" aria-label="Fermer">×</button>
    </div>
    <div class="lexique-outils">
      <input type="search" class="lexique-recherche" placeholder="Chercher un mot…" aria-label="Chercher un mot">
      <label class="lexique-filtre"><input type="checkbox" class="lexique-vus"> Mots déjà vus</label>
    </div>
    <div class="lexique-grille" aria-live="polite"></div>
  </dialog>
</div>`;

  const GABARITS = { bandeau: BANDEAU, exercice: EXERCICE };

  // Remplace chaque élément <… data-gabarit="nom"> de la racine par son gabarit.
  function poserGabarits(racine) {
    for (const el of racine.querySelectorAll('[data-gabarit]')) el.outerHTML = GABARITS[el.dataset.gabarit];
  }

  Object.assign(A, { GABARITS, poserGabarits });
})(this);

// ===== interface/icones.js =====
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
    chevronGauche: 'M15 6l-6 6 6 6',
    chevronDroite: 'M9 6l6 6-6 6',
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
    evenements: 'M5 21V4M5 4h11l-2 4 2 4H5',
    boucles: 'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3',
    calculs: 'M5 8h6M8 5v6M14 8h6M5 16h6M14 14h6M14 18h6',
    son: 'M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
    puzzle: 'M10 4a2 2 0 114 0v2h4a1 1 0 011 1v4h-2a2 2 0 100 4h2v4a1 1 0 01-1 1h-4v-2a2 2 0 10-4 0v2H6a1 1 0 01-1-1v-4h2a2 2 0 100-4H5V7a1 1 0 011-1h4V4z',
    dossier: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    importer: 'M12 15V4M7 9l5-5 5 5M5 20h14',
    telecharger: 'M12 4v11M7 10l5 5 5-5M5 20h14',
    imprimer: 'M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z',
    reglages: 'M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4',
    alerte: 'M12 3l9.5 16.5h-19zM12 10v4M12 17.5v.01',
    cadenas: 'M5 11h14v10H5zM8 11V8a4 4 0 0 1 8 0v3',
    pleinEcran: 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5',
    quitterPleinEcran: 'M9 4v5H4M15 4v5h5M20 15h-5v5M4 15h5v5',
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

  global.LaboBlocs = global.LaboBlocs || {};
  Object.assign(global.LaboBlocs, { icone, imageIcone, LECTURE, CHEMINS_ICONES: CHEMINS });
})(this);

// ===== interface/blocs.js =====
// Blocs Blockly en français (libellés de Vittascience), thème de l'atelier du distributeur (décision du 14/10/2026 :
// même rendu pour tous les projets) et palette limitée aux blocs autorisés par l'exercice.
// Un bloc ne dépend jamais d'un projet : seule la liste des blocs proposés change.
(function (global) {
  'use strict';

  const A = global.LaboBlocs;

  // Familles de blocs : couleur pastel soutenu en aplat, texte foncé (maquette 3b).
  const COULEURS = {
    debut: '#86C595',
    lumiere: '#F7AE5E',
    decision: '#F7AE5E',
    bleu: '#78B5D6',
    valeur: '#BCDAEB',
    servo: '#E78AB3',
    variable: '#EC8780',
  };

  // Broches proposées dans les menus.
  // Toutes les broches numériques D2 à D13 pour les LED et les boutons : c'est à l'élève de lire la consigne
  // et de choisir la bonne (le bloc de la palette part toujours de D2, il ne donne pas la réponse).
  const BROCHES_NUMERIQUES = ['D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13'];
  const BROCHES_LED = BROCHES_NUMERIQUES;
  const BROCHES_BOUTON = BROCHES_NUMERIQUES;
  const BROCHES_SERVO = ['D5', 'D6'];
  const menu = (liste) => liste.map((b) => [b, b]);
  // Pour une LED, on dit aussi ce que fait l'état : HAUT = allumée, BAS = éteinte.
  const HAUT_BAS_LED = [
    ['HAUT (1) : allumée', '1'],
    ['BAS (0) : éteinte', '0'],
  ];
  const HAUT_BAS = [
    ['HAUT (1)', '1'],
    ['BAS (0)', '0'],
  ];

  const image = (nom, alt) => ({ type: 'field_image', src: A.imageIcone(nom, '#1F2A30', 2.6), width: 22, height: 22, alt });

  const DEFINITIONS = [
    {
      type: 'demarrage',
      message0: 'Au démarrage %1 %2',
      args0: [{ type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }],
      style: 'debut',
      tooltip: 'Les blocs placés ici s’exécutent une seule fois, au démarrage de la carte.',
    },
    {
      type: 'boucle',
      message0: 'Répéter indéfiniment %1 %2',
      args0: [{ type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }],
      style: 'debut',
      tooltip: 'Les blocs placés ici recommencent sans fin, de haut en bas.',
    },
    {
      type: 'led_etat',
      message0: '%1 contrôler la LED à l’état %2 sur la broche %3',
      args0: [
        image('lumiere', 'LED'),
        { type: 'field_dropdown', name: 'ETAT', options: HAUT_BAS },
        { type: 'field_dropdown', name: 'BROCHE', options: menu(BROCHES_LED) },
      ],
      previousStatement: null,
      nextStatement: null,
      style: 'lumiere',
      tooltip: 'HAUT : la LED s’allume. BAS : elle s’éteint.',
    },
    {
      type: 'attendre',
      message0: 'attendre %1 seconde(s)',
      args0: [{ type: 'input_value', name: 'DUREE', check: 'Number' }],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'bleu',
      tooltip: 'La carte attend avant de passer au bloc suivant. On peut écrire 0.5 pour une demi-seconde.',
    },
    {
      type: 'bouton_etat',
      message0: '%1 état sur la broche %2',
      args0: [image('bouton', 'Module bouton'), { type: 'field_dropdown', name: 'BROCHE', options: menu(BROCHES_BOUTON) }],
      output: 'Boolean',
      style: 'valeur',
      tooltip: 'Donne HAUT (1) si le bouton est appuyé, BAS (0) sinon.',
    },
    {
      type: 'valeur_haut_bas',
      message0: '%1',
      args0: [{ type: 'field_dropdown', name: 'VALEUR', options: HAUT_BAS }],
      output: 'Boolean',
      style: 'valeur',
      tooltip: 'HAUT (1) ou BAS (0).',
    },
    {
      type: 'comparaison',
      message0: '%1 %2 %3',
      args0: [
        { type: 'input_value', name: 'A' },
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['=', 'EQ'],
            ['≠', 'NEQ'],
            ['<', 'LT'],
            ['≤', 'LTE'],
            ['>', 'GT'],
            ['≥', 'GTE'],
          ],
        },
        { type: 'input_value', name: 'B' },
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'bleu',
      tooltip: '« = » : les deux valeurs sont égales. « ≠ » : elles sont différentes. « < » : plus petite, « > » : plus grande.',
    },
    {
      type: 'quand_bouton',
      message0: '%1 quand le bouton de la broche %2 est %3 %4 %5',
      args0: [
        image('bouton', 'Bouton'),
        { type: 'field_dropdown', name: 'BROCHE', options: menu(BROCHES_BOUTON) },
        { type: 'field_dropdown', name: 'FRONT', options: [['appuyé', 'appui'], ['relâché', 'relache']] },
        { type: 'input_dummy' },
        { type: 'input_statement', name: 'DO' },
      ],
      style: 'debut',
      tooltip: 'Les blocs placés ici s’exécutent à chaque appui (ou relâchement), en même temps que « Répéter indéfiniment ».',
    },
    {
      type: 'repeter_n',
      message0: 'répéter %1 fois %2 %3',
      args0: [{ type: 'input_value', name: 'FOIS', check: 'Number' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'decision',
      tooltip: 'Les blocs à l’intérieur s’exécutent ce nombre de fois, puis le programme continue.',
    },
    {
      type: 'tant_que',
      message0: 'tant que %1 répéter %2 %3',
      args0: [{ type: 'input_value', name: 'CONDITION', check: 'Boolean' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      style: 'decision',
      tooltip: 'Tant que la condition est vraie, les blocs à l’intérieur recommencent.',
    },
    {
      type: 'repeter_jusqua',
      message0: 'répéter jusqu’à %1 %2 %3',
      args0: [{ type: 'input_value', name: 'CONDITION', check: 'Boolean' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      style: 'decision',
      tooltip: 'Les blocs à l’intérieur recommencent jusqu’à ce que la condition devienne vraie.',
    },
    {
      type: 'operation',
      message0: '%1 %2 %3',
      args0: [
        { type: 'input_value', name: 'A', check: 'Number' },
        { type: 'field_dropdown', name: 'OP', options: [['+', 'ADD'], ['−', 'SUB'], ['×', 'MUL'], ['÷', 'DIV'], ['reste de ÷', 'MOD']] },
        { type: 'input_value', name: 'B', check: 'Number' },
      ],
      inputsInline: true,
      output: 'Number',
      style: 'bleu',
      tooltip: 'Un calcul avec deux nombres.',
    },
    {
      type: 'hasard',
      message0: 'nombre au hasard entre %1 et %2',
      args0: [
        { type: 'input_value', name: 'MIN', check: 'Number' },
        { type: 'input_value', name: 'MAX', check: 'Number' },
      ],
      inputsInline: true,
      output: 'Number',
      style: 'bleu',
      tooltip: 'Un nombre entier tiré au hasard, bornes comprises.',
    },
    {
      type: 'logique',
      message0: '%1 %2 %3',
      args0: [
        { type: 'input_value', name: 'A', check: 'Boolean' },
        { type: 'field_dropdown', name: 'OP', options: [['et', 'ET'], ['ou', 'OU']] },
        { type: 'input_value', name: 'B', check: 'Boolean' },
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'bleu',
      tooltip: '« et » : les deux conditions sont vraies. « ou » : au moins une est vraie.',
    },
    {
      type: 'non',
      message0: 'non %1',
      args0: [{ type: 'input_value', name: 'A', check: 'Boolean' }],
      output: 'Boolean',
      style: 'bleu',
      tooltip: 'Vrai si la condition est fausse.',
    },
    {
      type: 'ajouter_a',
      message0: 'ajouter à %1 la valeur %2',
      args0: [
        { type: 'field_dropdown', name: 'VAR', options: [['CHOIX', 'CHOIX']] },
        { type: 'input_value', name: 'VALEUR', check: 'Number' },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'variable',
      tooltip: 'Augmente la valeur rangée dans la boîte (ou la diminue avec un nombre négatif).',
    },
    {
      type: 'son',
      message0: '%1 jouer la note %2 Hz pendant %3 s sur la broche %4',
      args0: [
        image('son', 'Buzzer'),
        { type: 'input_value', name: 'FREQUENCE', check: 'Number' },
        { type: 'input_value', name: 'DUREE', check: 'Number' },
        { type: 'field_dropdown', name: 'BROCHE', options: menu(BROCHES_NUMERIQUES) },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'lumiere',
      tooltip: 'Le buzzer joue une note (440 Hz = la). Le programme continue sans attendre la fin de la note.',
    },
    {
      type: 'si_alors',
      message0: 'si %1 alors %2 %3',
      args0: [{ type: 'input_value', name: 'CONDITION', check: 'Boolean' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'ALORS' }],
      previousStatement: null,
      nextStatement: null,
      style: 'decision',
      tooltip: 'Si la condition est vraie, alors les blocs à l’intérieur s’exécutent.',
    },
    {
      type: 'si_sinon',
      message0: 'si %1 alors %2 %3',
      args0: [{ type: 'input_value', name: 'CONDITION', check: 'Boolean' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'ALORS' }],
      message1: 'sinon %1',
      args1: [{ type: 'input_statement', name: 'SINON' }],
      previousStatement: null,
      nextStatement: null,
      style: 'decision',
      tooltip: 'Si la condition est vraie, les blocs de « alors » s’exécutent. Sinon, ceux de « sinon ».',
    },
    {
      type: 'servo_angle',
      message0: '%1 contrôler l’angle à %2 ° sur la broche %3',
      args0: [
        image('moteur', 'Servomoteur'),
        { type: 'input_value', name: 'ANGLE', check: 'Number' },
        { type: 'field_dropdown', name: 'BROCHE', options: menu(BROCHES_SERVO) },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'servo',
      tooltip: 'Le servomoteur tourne jusqu’à l’angle choisi, entre 0° et 180°.',
    },
    {
      type: 'affecter',
      message0: 'affecter à %1 la valeur %2',
      args0: [
        { type: 'field_dropdown', name: 'VAR', options: [['CHOIX', 'CHOIX']] },
        { type: 'input_value', name: 'VALEUR', check: 'Number' },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'variable',
      tooltip: 'Range une valeur dans la boîte CHOIX.',
    },
    {
      type: 'variable',
      message0: '%1',
      args0: [{ type: 'field_label_serializable', name: 'VAR', text: 'CHOIX' }],
      output: 'Number',
      style: 'variable',
      tooltip: 'La valeur rangée dans la boîte CHOIX.',
    },
    {
      type: 'nombre',
      message0: '%1',
      args0: [{ type: 'field_number', name: 'NUM', value: 0 }],
      output: 'Number',
      style: 'bleu',
      tooltip: 'Un nombre. Les nombres à virgule s’écrivent avec un point : 0.5',
    },
  ];

  // Catégories de la palette, dans l'ordre. Chaque bloc a sa forme de départ dans la palette.
  const CATEGORIES = [
    { nom: 'Événements', cle: 'evenements', couleur: COULEURS.debut, blocs: ['quand_bouton'] },
    { nom: 'Lumière', cle: 'lumiere', couleur: COULEURS.lumiere, blocs: ['led_etat'] },
    { nom: 'Son', cle: 'son', couleur: COULEURS.lumiere, blocs: ['son'] },
    { nom: 'Temps', cle: 'temps', couleur: COULEURS.bleu, blocs: ['attendre'] },
    { nom: 'Bouton', cle: 'bouton', couleur: COULEURS.bleu, blocs: ['bouton_etat', 'valeur_haut_bas'] },
    { nom: 'Moteur', cle: 'moteur', couleur: COULEURS.servo, blocs: ['servo_angle'] },
    { nom: 'Décisions', cle: 'decisions', couleur: COULEURS.decision, blocs: ['si_alors', 'si_sinon', 'comparaison', 'logique', 'non'] },
    { nom: 'Boucles', cle: 'boucles', couleur: COULEURS.decision, blocs: ['repeter_n', 'tant_que', 'repeter_jusqua'] },
    { nom: 'Calculs', cle: 'calculs', couleur: COULEURS.bleu, blocs: ['operation', 'hasard'] },
    { nom: 'Variables', cle: 'variables', couleur: COULEURS.variable, blocs: ['affecter', 'ajouter_a', 'variable', 'nombre'] },
  ];

  const FORMES_PALETTE = {
    attendre: { inputs: { DUREE: { shadow: { type: 'nombre', fields: { NUM: 1 } } } } },
    servo_angle: { inputs: { ANGLE: { shadow: { type: 'nombre', fields: { NUM: 90 } } } } },
    affecter: { inputs: { VALEUR: { shadow: { type: 'nombre', fields: { NUM: 0 } } } } },
    led_etat: { fields: { ETAT: '1', BROCHE: 'D2' } },
    quand_bouton: { fields: { BROCHE: 'D2', FRONT: 'appui' } },
    repeter_n: { inputs: { FOIS: { shadow: { type: 'nombre', fields: { NUM: 3 } } } } },
    ajouter_a: { inputs: { VALEUR: { shadow: { type: 'nombre', fields: { NUM: 1 } } } } },
    son: { fields: { BROCHE: 'D2' }, inputs: { FREQUENCE: { shadow: { type: 'nombre', fields: { NUM: 440 } } }, DUREE: { shadow: { type: 'nombre', fields: { NUM: 0.5 } } } } },
    operation: { inputs: { A: { shadow: { type: 'nombre', fields: { NUM: 1 } } }, B: { shadow: { type: 'nombre', fields: { NUM: 1 } } } } },
    hasard: { inputs: { MIN: { shadow: { type: 'nombre', fields: { NUM: 1 } } }, MAX: { shadow: { type: 'nombre', fields: { NUM: 6 } } } } },
  };

  // Palette d'un exercice : seulement ses blocs autorisés ; une catégorie vide n'apparaît pas.
  function palette(blocsAutorises, composants) {
    const autorises = new Set(blocsAutorises || []);
    // Les blocs de la palette ne donnent pas la broche de l'exercice : l'élève la choisit en lisant la consigne.
    void composants;
    const contenu = [];
    for (const cat of CATEGORIES) {
      const blocs = cat.blocs.filter((t) => autorises.has(t));
      if (!blocs.length) continue;
      contenu.push({
        kind: 'category',
        name: cat.nom,
        categorystyle: cat.cle,
        cssConfig: {
          container: 'blocklyToolboxCategoryContainer',
          row: 'blocklyToolboxCategory cat-ligne',
          icon: `cat-tuile cat-${cat.cle}`,
          label: 'blocklyToolboxCategoryLabel cat-libelle',
          selected: 'blocklyToolboxSelected cat-choisie',
        },
        contents: blocs.map((type) => {
          const forme = JSON.parse(JSON.stringify(FORMES_PALETTE[type] || {}));
          return Object.assign({ kind: 'block', type }, forme);
        }),
      });
    }
    return { kind: 'categoryToolbox', contents: contenu };
  }

  let defini = false;
  function definirBlocs(Blockly) {
    if (defini) return;
    defini = true;
    Blockly.common.defineBlocksWithJsonArray(DEFINITIONS);
    // Menu HAUT/BAS du bloc LED : « : allumée / : éteinte » pendant les premiers exercices seulement
    // (A.aideLed est réglé à l'ouverture de chaque exercice, voir parametres.js).
    const initLed = Blockly.Blocks.led_etat.init;
    Blockly.Blocks.led_etat.init = function () {
      initLed.call(this);
      const entree = this.getField('ETAT').getParentInput();
      const rang = entree.fieldRow.findIndex((f) => f.name === 'ETAT');
      entree.removeField('ETAT');
      entree.insertFieldAt(rang, new Blockly.FieldDropdown(() => (A.aideLed ? HAUT_BAS_LED : HAUT_BAS)), 'ETAT');
    };
    // Pastille « ? » sur « Au démarrage » et « Répéter indéfiniment » : un clic ouvre l'explication
    // des deux blocs (A.surAideChapeau est branché par l'écran d'exercice).
    const ICONE_AIDE =
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="#FFFFFF" stroke="#1F2A30" stroke-width="2"/>' +
          '<text x="12" y="17" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="15" font-weight="800" fill="#1A6E8E">?</text></svg>',
      );
    for (const type of ['demarrage', 'boucle']) {
      const init = Blockly.Blocks[type].init;
      Blockly.Blocks[type].init = function () {
        init.call(this);
        const aide = new Blockly.FieldImage(ICONE_AIDE, 24, 24, 'Aide sur ce bloc', () => A.surAideChapeau && A.surAideChapeau(type));
        this.inputList[0].appendField(aide, 'AIDE');
      };
    }
    const style = (c) => ({ colourPrimary: c, colourSecondary: c, colourTertiary: assombrir(c) });
    const blockStyles = {};
    for (const [cle, c] of Object.entries(COULEURS)) blockStyles[cle] = style(c);
    blockStyles.debut.hat = 'cap';
    const categoryStyles = {};
    for (const cat of CATEGORIES) categoryStyles[cat.cle] = { colour: cat.couleur };
    A.themeBlockly = Blockly.Theme.defineTheme('atelier', {
      base: Blockly.Themes.Classic,
      blockStyles,
      categoryStyles,
      componentStyles: {
        workspaceBackgroundColour: '#F7FAFB',
        toolboxBackgroundColour: '#FAFBFC',
        toolboxForegroundColour: '#1F2A30',
        flyoutBackgroundColour: '#EAF0F3',
        flyoutForegroundColour: '#1F2A30',
        flyoutOpacity: 1,
        scrollbarColour: '#9AA8B0',
        insertionMarkerColour: '#1F2A30',
        insertionMarkerOpacity: 0.3,
      },
      fontStyle: { family: "'Segoe UI', system-ui, sans-serif", weight: '700', size: 12 },
      startHats: false,
    });
  }

  function assombrir(hex) {
    const n = parseInt(hex.slice(1), 16);
    const f = (v) => Math.round(v * 0.72);
    const r = f(n >> 16);
    const g = f((n >> 8) & 255);
    const b = f(n & 255);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  // Noms des blocs pour l'éditeur du professeur (cases « blocs proposés aux élèves »), dans les mots de la palette.
  const NOMS_BLOCS = {
    quand_bouton: 'quand le bouton est appuyé',
    led_etat: 'contrôler la LED',
    son: 'jouer une note',
    attendre: 'attendre … seconde(s)',
    bouton_etat: 'état sur la broche (bouton)',
    valeur_haut_bas: 'HAUT / BAS',
    servo_angle: 'contrôler l’angle (servomoteur)',
    si_alors: 'si … alors',
    si_sinon: 'si … alors … sinon',
    comparaison: 'comparaison (=, ≠, <, >)',
    logique: 'et / ou',
    non: 'non',
    repeter_n: 'répéter … fois',
    tant_que: 'tant que … répéter',
    repeter_jusqua: 'répéter jusqu’à',
    operation: 'calcul (+, −, ×, ÷)',
    hasard: 'nombre au hasard',
    affecter: 'affecter une valeur à une variable',
    ajouter_a: 'ajouter à une variable',
    variable: 'valeur d’une variable',
    nombre: 'nombre',
  };
  // Broches que proposent les menus des blocs, par sorte de composant (l'éditeur du professeur propose les mêmes).
  const BROCHES_COMPOSANTS = { led: BROCHES_LED, bouton: BROCHES_BOUTON, servo: BROCHES_SERVO, buzzer: BROCHES_NUMERIQUES };

  Object.assign(A, { definirBlocs, palette, CATEGORIES, COULEURS_BLOCS: COULEURS, NOMS_BLOCS, BROCHES_COMPOSANTS });
})(this);

// ===== interface/editeur.js =====
// Éditeur de blocs (repris de l'atelier) : Blockly, palette de l'exercice, blocs de départ, surlignage des blocs en cours,
// blocs restés seuls hors du programme, zoom, annuler / rétablir.
(function (global) {
  'use strict';

  const A = global.LaboBlocs;

  function creerEditeur(conteneur, rappels) {
    const Blockly = global.Blockly;
    A.definirBlocs(Blockly);
    const zone = conteneur.querySelector('.editeur-blockly');
    const calque = conteneur.querySelector('.editeur-etiquettes');
    // Tuiles des catégories : couleur de la famille et pictogramme.
    if (!document.getElementById('style-categories')) {
      const style = document.createElement('style');
      style.id = 'style-categories';
      style.textContent = A.CATEGORIES.map(
        (c) => `.cat-${c.cle}{background-color:${c.couleur};background-image:url("${A.imageIcone(c.cle, '#1F2A30', 2.4)}")}`,
      ).join('\n');
      document.head.appendChild(style);
    }
    const echelle = () => Number(getComputedStyle(document.documentElement).getPropertyValue('--s')) || 1;

    const ws = Blockly.inject(zone, {
      toolbox: { kind: 'categoryToolbox', contents: [] },
      renderer: 'zelos',
      // Images de Blockly (corbeille…) copiées dans le dépôt : aucun appel réseau.
      media: A.mediaBlockly || 'vendor/blockly/media/', // un projet le règle (monterExercice)
      theme: A.themeBlockly,
      trashcan: true,
      sounds: false,
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: { controls: false, wheel: false, pinch: true, startScale: 0.9 * echelle(), maxScale: 2, minScale: 0.4, scaleSpeed: 1.15 },
      grid: { spacing: 22, length: 2, colour: '#C9D4DA', snap: false },
      maxInstances: { demarrage: 1, boucle: 1 },
    });
    let enChargement = false;
    let enCours = null;

    // ---------- Chargement / sauvegarde ----------

    function charger(exercice, sauvegarde) {
      enChargement = true;
      // Les événements de Blockly partent un instant plus tard : on les coupe pendant le chargement,
      // sinon ils passeraient pour une modification de l'élève (et arrêteraient la simulation).
      Blockly.Events.disable();
      try {
        ws.updateToolbox(A.palette(exercice.blocsAutorises, exercice.composants));
        ws.clear();
        const depart = sauvegarde || A.versBlockly(exercice.blocsDepart || { demarrage: [], boucle: [] });
        Blockly.serialization.workspaces.load(depart, ws);
        // « Au démarrage » et « Répéter indéfiniment » ne se suppriment pas, même dans une sauvegarde.
        for (const b of ws.getTopBlocks(false)) if (b.type === 'demarrage' || b.type === 'boucle') b.setDeletable(false);
      } finally {
        Blockly.Events.enable();
      }
      ws.clearUndo();
      ws.setScale(0.9 * echelle());
      ws.scroll(0, 0);
      enChargement = false;
      majHorsProgramme();
    }

    function sauvegarder() {
      return Blockly.serialization.workspaces.save(ws);
    }

    function lire() {
      return A.depuisBlockly(sauvegarder());
    }

    // ---------- Étiquettes posées à côté des blocs ----------

    function position(bloc) {
      const r = bloc.getSvgRoot().getBoundingClientRect();
      const z = zone.getBoundingClientRect();
      // Pour un bloc en C, on se cale sur sa première ligne (son en-tête).
      const hauteur = Math.min(r.height, 44 * ws.scale);
      return { x: r.right - z.left, y: r.top - z.top + hauteur / 2 };
    }

    function dessinerEtiquettes() {
      calque.innerHTML = '';
      const ajouter = (bloc, classe, texte, decalage) => {
        const p = position(bloc);
        const e = document.createElement('span');
        e.className = 'etiquette-bloc ' + classe;
        e.textContent = texte;
        e.style.left = p.x + (decalage || 12) + 'px';
        e.style.top = p.y + 'px';
        calque.appendChild(e);
      };
      const b = enCours && ws.getBlockById(enCours);
      if (b && !b.isInFlyout) {
        // Bloc en C : l'étiquette se place après la ligne d'en-tête, à droite du bloc.
        ajouter(b, 'etiquette-en-cours', '◀ en cours');
      }
      for (const h of horsProgramme) {
        const bloc = ws.getBlockById(h);
        if (bloc) ajouter(bloc, 'etiquette-hors', 'hors du programme', 14);
      }
    }

    // ---------- Bloc en cours ----------

    // id : un bloc, ou une liste (un bloc en cours par fil : « Répéter indéfiniment » et les blocs « quand… »).
    let tousEnCours = [];
    function surligner(id) {
      const ids = Array.isArray(id) ? id.filter(Boolean) : id ? [id] : [];
      if (ids.join() === tousEnCours.join()) return;
      for (const ancien of tousEnCours) {
        const b = ws.getBlockById(ancien);
        if (b && b.getSvgRoot()) b.getSvgRoot().classList.remove('bloc-en-cours');
      }
      tousEnCours = ids;
      enCours = ids[0] || null;
      for (const x of ids) {
        const b = ws.getBlockById(x);
        if (b && b.getSvgRoot()) b.getSvgRoot().classList.add('bloc-en-cours');
      }
      dessinerEtiquettes();
    }

    // ---------- Blocs restés seuls hors du programme ----------

    let horsProgramme = [];
    function majHorsProgramme() {
      for (const b of ws.getAllBlocks(false)) b.getSvgRoot().classList.remove('bloc-hors-programme');
      horsProgramme = [];
      for (const b of ws.getTopBlocks(false)) {
        if (b.type === 'demarrage' || b.type === 'boucle' || b.type === 'quand_bouton' || b.isInsertionMarker()) continue;
        if (b.isDragging && b.isDragging()) continue;
        horsProgramme.push(b.id);
        b.getSvgRoot().classList.add('bloc-hors-programme');
      }
      dessinerEtiquettes();
    }

    ws.addChangeListener((e) => {
      if (enChargement) return;
      const deplacementVue = e.type === Blockly.Events.VIEWPORT_CHANGE;
      if (deplacementVue || e.type === Blockly.Events.BLOCK_DRAG || e.isUiEvent) {
        if (e.type === Blockly.Events.BLOCK_DRAG && !e.isStart) majHorsProgramme();
        else dessinerEtiquettes();
        if (deplacementVue) rappels.zoom(Math.round((ws.scale / echelle()) * 100));
        return;
      }
      majHorsProgramme();
      rappels.modifie();
    });

    // ---------- Boutons de l'espace de travail ----------

    function zoomer(sens) {
      const centre = zone.getBoundingClientRect();
      ws.zoom(centre.width / 2, centre.height / 2, sens);
    }

    function recentrer() {
      ws.setScale(0.9 * echelle());
      ws.scroll(0, 0);
    }

    // La zone change de taille (fenêtre, consigne réduite) : Blockly doit se redimensionner.
    new ResizeObserver(() => {
      Blockly.svgResize(ws);
      dessinerEtiquettes();
    }).observe(zone);

    return {
      ws,
      charger,
      sauvegarder,
      lire,
      surligner,
      zoomer,
      recentrer,
      annuler: () => ws.undo(false),
      retablir: () => ws.undo(true),
      horsProgramme: () => horsProgramme.slice(),
      // Éditeur du professeur : les blocs proposés changent sans recharger le programme.
      changerPalette: (blocsAutorises) => ws.updateToolbox(A.palette(blocsAutorises)),
    };
  }

  A.creerEditeur = creerEditeur;
})(this);

// ===== interface/simulateur-vue.js =====
// Affichage du simulateur (repris de l'atelier) : carte Arduino stylisée (dessin original, sans logo), fils, cartes des
// composants, et l'illustration propre au projet s'il en a une (« illustration » de l'exercice, ex. le distributeur).
// Aucune logique de programme ici : on affiche des états.
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const NS = 'http://www.w3.org/2000/svg';

  // Position des broches sur la rangée DIGITAL du dessin de la carte.
  const XS = { GND: 144.5, D13: 154.5, D12: 164, D11: 174, D10: 183.5, D9: 193.5, D8: 203, D7: 219.5, D6: 229, D5: 239, D4: 248.5, D3: 258.5, D2: 268 };
  const PY = 57;
  const FILS = { D3: '#D32F2F', D4: '#1976D2', D5: '#F9A825', D6: '#7B1FA2', D8: '#2E7D32', D9: '#00838F', D10: '#455A64', D7: '#6D4C41', D11: '#AD1457', GND: '#7B4A2A' };
  const FAMILLES = { led: '#FAB22B', bouton: '#1A6E8E', servo: '#C2185B', buzzer: '#6D4C41' };
  const COULEURS_LED = { PetiteDose: '#F5B800', GrandeDose: '#2F80ED', Trappe: '#E53935' };

  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  function couleurFil(broche) {
    return FILS[broche] || '#455A64';
  }
  function couleurLed(c) {
    return c.couleur || COULEURS_LED[c.nom] || '#E53935';
  }
  function libelle(c) {
    const type = { led: 'LED', bouton: 'BOUTON', servo: 'Servomoteur', buzzer: 'Buzzer' }[c.type] || c.type;
    return c.nom ? `${type} ${c.nom}` : type;
  }

  // ---------- Carte Arduino ----------

  function dessinCarte(composants, recadrer) {
    const etiquettes = ['GND', '13', '12', '~11', '~10', '~9', '8', '7', '~6', '~5', '4', '~3', '2'];
    const broches = ['GND', 'D13', 'D12', 'D11', 'D10', 'D9', 'D8', 'D7', 'D6', 'D5', 'D4', 'D3', 'D2'];
    let trous = '';
    broches.forEach((b, i) => {
      const x = XS[b];
      trous += `<rect x="${x - 3.2}" y="${PY - 3.2}" width="6.4" height="6.4" rx="1" fill="#0E1418" stroke="#C9A227" stroke-width="0.8"/>`;
      trous += `<text x="${x}" y="74" class="carte-etiquette" text-anchor="middle">${etiquettes[i]}</text>`;
    });
    // Fils : de chaque broche utilisée vers le haut, le long du bord droit, puis vers les cartes.
    const utilises = [{ broche: 'GND' }].concat(composants).filter((c) => XS[c.broche] !== undefined);
    const vus = new Set();
    const fils = utilises
      .filter((c) => (vus.has(c.broche) ? false : vus.add(c.broche)))
      .sort((a, b) => XS[b.broche] - XS[a.broche]);
    let traces = '';
    fils.forEach((f, r) => {
      const x = XS[f.broche];
      const y = 34 - r * 4;
      const lx = 334 + r * 4.5;
      const coul = couleurFil(f.broche);
      traces +=
        `<polyline points="${x},${PY} ${x},${y} ${lx},${y} ${lx},${recadrer ? 94 : 280}" fill="none" stroke="${coul}" ` +
        `stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>` +
        `<circle cx="${x}" cy="${PY}" r="2.6" fill="${coul}" stroke="#FFFFFF" stroke-width="1"/>`;
    });
    const vb = recadrer ? '128 2 246 92' : '0 0 372 280';
    return (
      `<svg class="carte-arduino" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Carte Arduino UNO et ses fils">` +
      // Circuit imprimé
      '<rect x="14" y="44" width="308" height="228" rx="12" fill="#1C7286" stroke="#11505F" stroke-width="2"/>' +
      '<circle cx="30" cy="60" r="5" fill="#F4F7F9" stroke="#11505F"/><circle cx="306" cy="60" r="5" fill="#F4F7F9" stroke="#11505F"/>' +
      '<circle cx="30" cy="256" r="5" fill="#F4F7F9" stroke="#11505F"/><circle cx="306" cy="256" r="5" fill="#F4F7F9" stroke="#11505F"/>' +
      // Prise USB et prise d'alimentation
      '<rect x="2" y="78" width="46" height="40" rx="3" fill="#C5CFD5" stroke="#7C8B94" stroke-width="1.5"/>' +
      '<rect x="8" y="86" width="34" height="24" rx="2" fill="#9AA8B0"/>' +
      '<rect x="4" y="196" width="40" height="36" rx="4" fill="#2B3338"/>' +
      '<circle cx="24" cy="214" r="8" fill="#11171A"/>' +
      // Rangée DIGITAL
      '<rect x="137" y="49" width="138" height="16" rx="2" fill="#1B2226"/>' +
      trous +
      '<text x="206" y="88" class="carte-titre" text-anchor="middle">DIGITAL</text>' +
      // Rangées du bas (alimentation et analogique), pour l'allure
      '<rect x="96" y="250" width="80" height="14" rx="2" fill="#1B2226"/>' +
      '<rect x="196" y="250" width="66" height="14" rx="2" fill="#1B2226"/>' +
      '<text x="136" y="244" class="carte-etiquette" text-anchor="middle">POWER</text>' +
      '<text x="229" y="244" class="carte-etiquette" text-anchor="middle">ANALOG IN</text>' +
      // Microcontrôleur et quartz
      '<rect x="150" y="176" width="120" height="34" rx="3" fill="#2B3338"/>' +
      '<rect x="72" y="150" width="26" height="12" rx="6" fill="#B8C4CA"/>' +
      // Bouton reset et voyants
      '<rect x="62" y="56" width="16" height="16" rx="3" fill="#C5CFD5"/><circle cx="70" cy="64" r="4.5" fill="#D32F2F"/>' +
      '<rect x="110" y="104" width="7" height="4" fill="#F9A825"/><text x="122" y="108" class="carte-etiquette">L</text>' +
      '<rect x="270" y="112" width="7" height="4" fill="#4CAF50"/><text x="282" y="116" class="carte-etiquette">ON</text>' +
      '<text x="180" y="140" class="carte-nom" text-anchor="middle">UNO</text>' +
      '<g class="carte-surlignage"></g>' +
      traces +
      '</svg>'
    );
  }

  function surlignerBroche(conteneur, broche) {
    const g = conteneur.querySelector('.carte-surlignage');
    if (!g) return;
    g.innerHTML =
      broche && XS[broche] !== undefined
        ? `<rect x="${XS[broche] - 6}" y="${PY - 7}" width="12" height="36" rx="3" fill="rgba(255,196,0,.35)" stroke="#FFC400" stroke-width="2.5"/>`
        : '';
  }

  // ---------- Cartes des composants ----------

  function dessinLed(couleur) {
    return (
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      `<circle class="led-halo" cx="24" cy="18" r="18" fill="${couleur}" opacity="0"/>` +
      '<path class="led-verre" d="M14 30V18a10 10 0 0 1 20 0v12z" fill="#EEF3F6" stroke="#7C8B94" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path class="led-reflet" d="M18.5 18a6 6 0 0 1 3.5-5.5" fill="none" stroke="#FFFFFF" opacity=".95" stroke-width="2.5" stroke-linecap="round"/>' +
      '<rect class="led-socle" x="11" y="29" width="26" height="5" rx="2" fill="#7C8B94"/>' +
      '<path d="M20 34v12M28 34v9" fill="none" stroke="#7C8B94" stroke-width="3" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  function dessinBouton() {
    return (
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      '<rect x="5" y="30" width="38" height="12" rx="3" fill="#3B4A52"/>' +
      '<rect class="bouton-capuchon" x="13" y="12" width="22" height="18" rx="4" fill="#1A6E8E" stroke="#12506A" stroke-width="2"/>' +
      '<path d="M12 42v5M36 42v5" fill="none" stroke="#7C8B94" stroke-width="3" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  function dessinServo() {
    let graduations = '';
    for (let a = 0; a <= 180; a += 30) {
      const r = (a * Math.PI) / 180;
      const x1 = 24 + 19 * Math.cos(r);
      const y1 = 36 - 19 * Math.sin(r);
      const x2 = 24 + (a % 90 === 0 ? 15 : 16.5) * Math.cos(r);
      const y2 = 36 - (a % 90 === 0 ? 15 : 16.5) * Math.sin(r);
      graduations += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#4F5D66" stroke-width="${a % 90 === 0 ? 2.5 : 1.5}" stroke-linecap="round"/>`;
    }
    return (
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      '<path d="M5 36A19 19 0 0 1 43 36" fill="none" stroke="#9AA8B0" stroke-width="2"/>' +
      graduations +
      '<text x="47" y="45" class="servo-texte" text-anchor="end">0°</text>' +
      '<text x="24" y="12" class="servo-texte" text-anchor="middle">90°</text>' +
      '<text x="1" y="45" class="servo-texte">180°</text>' +
      '<rect x="15" y="33" width="18" height="13" rx="2" fill="#3B4A52"/>' +
      '<g class="servo-bras" style="transform-origin:24px 36px">' +
      '<line x1="24" y1="36" x2="39" y2="36" stroke="#1F2A30" stroke-width="6" stroke-linecap="round"/>' +
      '<line x1="24" y1="36" x2="39" y2="36" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>' +
      '</g>' +
      '<circle cx="24" cy="36" r="3.5" fill="#FFFFFF" stroke="#1F2A30" stroke-width="2"/>' +
      '</svg>'
    );
  }

  function dessinBuzzer() {
    return (
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      '<circle cx="24" cy="24" r="16" fill="#2B3338"/><circle cx="24" cy="24" r="4" fill="#11171A"/>' +
      '<path class="buzzer-onde" d="M40 14a16 16 0 0 1 0 20M44 9a22 22 0 0 1 0 30" fill="none" stroke="#6D4C41" stroke-width="2.5" stroke-linecap="round" opacity="0"/>' +
      '</svg>'
    );
  }

  function carteComposant(c, compact) {
    const fam = FAMILLES[c.type];
    let dessin;
    if (c.type === 'led') dessin = `<div class="composant-dessin">${dessinLed(couleurLed(c))}</div>`;
    else if (c.type === 'bouton')
      dessin =
        `<button type="button" class="composant-dessin bouton-poussoir" aria-pressed="false" ` +
        `aria-label="Bouton poussoir ${echapper(libelle(c))} ${c.broche} : maintenir pour appuyer">${dessinBouton()}</button>`;
    else if (c.type === 'buzzer') dessin = `<div class="composant-dessin">${dessinBuzzer()}</div>`;
    else dessin = `<div class="composant-dessin">${dessinServo()}</div>`;
    const aide = c.type === 'bouton' && !compact ? '<span class="composant-aide">Maintiens le clic pour appuyer</span>' : '';
    return (
      `<div class="composant composant-${c.type}${compact ? ' compact' : ''}" data-broche="${c.broche}" data-type="${c.type}" style="--famille:${fam};--led:${couleurLed(c)}">` +
      dessin +
      '<div class="composant-texte">' +
      `<div class="composant-nom"><span class="composant-fil" style="background:${couleurFil(c.broche)}"></span>` +
      `<span>${echapper(libelle(c))} · ${c.broche}</span></div>` +
      `<div class="composant-etat"><span class="pastille-etat" aria-live="polite"></span>${aide}</div>` +
      '</div></div>'
    );
  }

  // ---------- Distributeur de céréales ----------

  function dessinDistributeur() {
    let grains = '';
    const pos = [
      [38, 56], [48, 50], [58, 58], [70, 52], [82, 57], [44, 66], [56, 70], [66, 64], [78, 68], [50, 78], [62, 80], [72, 76],
      [34, 44], [46, 40], [60, 44], [74, 40], [86, 46], [40, 32], [54, 30], [68, 32], [80, 30],
    ];
    for (const [x, y] of pos) grains += `<ellipse cx="${x}" cy="${y}" rx="4.2" ry="3.2" fill="#E0A44A" stroke="#A86A1E" stroke-width="1"/>`;
    let chute = '';
    for (let i = 0; i < 6; i++)
      chute += `<ellipse class="grain-chute" style="animation-delay:${(i * 0.13).toFixed(2)}s" cx="${57 + (i % 3) * 3}" cy="100" rx="3.4" ry="2.6" fill="#E0A44A" stroke="#A86A1E" stroke-width="0.8"/>`;
    const voyant = (cle, x, nom) =>
      `<g class="voyant" data-voyant="${cle}"><circle cx="${x}" cy="150" r="7" fill="#EEF3F6" stroke="#7C8B94" stroke-width="2"/>` +
      `<text x="${x}" y="166" text-anchor="middle" class="voyant-nom">${nom}</text></g>`;
    return (
      '<svg class="distributeur" viewBox="0 0 120 200" role="img" aria-label="Distributeur de céréales">' +
      // Trémie transparente pleine de céréales
      '<path d="M22 18h76l-28 70H50z" fill="#F4F7F9" stroke="#4F5D66" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<clipPath id="tremie"><path d="M23 26h74l-27 61H51z"/></clipPath>' +
      `<g clip-path="url(#tremie)">${grains}</g>` +
      '<rect x="18" y="12" width="84" height="8" rx="3" fill="#4F5D66"/>' +
      // Trappe (tourne autour de sa charnière, à gauche du goulot)
      '<g class="trappe" style="transform-origin:50px 90px"><rect x="48" y="88" width="24" height="5" rx="2" fill="#C2185B" stroke="#7A0F39" stroke-width="1"/></g>' +
      '<circle cx="50" cy="90.5" r="2.4" fill="#1F2A30"/>' +
      `<g class="chute">${chute}</g>` +
      // Boîtier et voyants
      '<rect x="14" y="132" width="92" height="44" rx="8" fill="#FFFFFF" stroke="#4F5D66" stroke-width="2.5"/>' +
      voyant('PetiteDose', 34, 'Petite') +
      voyant('GrandeDose', 60, 'Grande') +
      voyant('Trappe', 86, 'Trappe') +
      // Bol
      '<path d="M36 182h48a24 14 0 0 1-48 0z" fill="#1A6E8E" stroke="#12506A" stroke-width="2"/>' +
      '<text x="60" y="126" text-anchor="middle" class="trappe-etat"></text>' +
      '</svg>'
    );
  }

  // ---------- Vue complète ----------

  // Bouton poussoir : appuyé tant qu'on garde le clic (ou la touche Espace / Entrée), relâché dès qu'on lâche.
  function poussoir(el, appuyer) {
    let tenu = false;
    const lacher = () => {
      if (!tenu) return;
      tenu = false;
      appuyer(0);
    };
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      tenu = true;
      appuyer(1);
    });
    el.addEventListener('pointerup', lacher);
    el.addEventListener('pointercancel', lacher);
    el.addEventListener('lostpointercapture', lacher);
    el.addEventListener('keydown', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      if (e.repeat || tenu) return;
      tenu = true;
      appuyer(1);
    });
    el.addEventListener('keyup', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      lacher();
    });
    el.addEventListener('blur', lacher);
  }

  function creerVue(racine, exercice, rappels) {
    const composants = exercice.composants || [];
    const compact = composants.length > 4;
    const recadrer = composants.length > 4;
    racine.querySelector('.simu-carte').innerHTML = `<div class="simu-carte-dessin">${dessinCarte(composants, recadrer)}</div>`;
    // Illustration du projet (distributeur : exercices 8 et 13) : à droite des cartes des composants.
    const distributeur = exercice.illustration === 'distributeur';
    racine.querySelector('.simu-distributeur').innerHTML = distributeur ? dessinDistributeur() : '';
    racine.querySelector('.simu-milieu').classList.toggle('avec-distributeur', distributeur);
    const grille = racine.querySelector('.simu-composants');
    grille.classList.toggle('compact', compact);
    grille.innerHTML = composants.map((c) => carteComposant(c, compact)).join('');

    const cartes = {};
    for (const el of grille.querySelectorAll('.composant')) {
      const broche = el.dataset.broche;
      cartes[broche] = el;
      el.addEventListener('mouseenter', () => {
        surlignerBroche(racine, broche);
        el.classList.add('survol');
      });
      el.addEventListener('mouseleave', () => {
        surlignerBroche(racine, null);
        el.classList.remove('survol');
      });
      const b = el.querySelector('.bouton-poussoir');
      if (b) poussoir(b, (valeur) => rappels.appuyerBouton(broche, valeur));
    }

    const memoire = {};
    function maj(broche, valeur, quoi) {
      if (memoire[broche] === valeur) return;
      memoire[broche] = valeur;
      const el = cartes[broche];
      const c = composants.find((x) => x.broche === broche);
      if (el && c) {
        const pastille = el.querySelector('.pastille-etat');
        if (c.type === 'led') {
          el.classList.toggle('actif', !!valeur);
          pastille.textContent = valeur ? '● Allumée (HAUT)' : '○ Éteinte (BAS)';
        } else if (c.type === 'bouton') {
          el.classList.toggle('actif', !!valeur);
          el.querySelector('.bouton-poussoir').setAttribute('aria-pressed', valeur ? 'true' : 'false');
          pastille.textContent = valeur ? 'ON' : 'OFF';
        } else if (c.type === 'buzzer') {
          el.classList.toggle('actif', !!valeur);
          pastille.textContent = valeur ? `♪ ${Math.round(valeur)} Hz` : 'Silence';
        } else if (c.type === 'servo') {
          el.querySelector('.servo-bras').style.transform = `rotate(${-valeur}deg)`;
          pastille.textContent = Math.round(valeur) + '°';
        }
      }
      if (quoi) quoi();
    }

    // Distributeur : voyants (LED nommées PetiteDose / GrandeDose / Trappe) et trappe.
    const distri = racine.querySelector('.distributeur');
    function majDistributeur(etats, enMarche) {
      if (!distri) return;
      for (const c of composants) {
        if (c.type !== 'led' || !COULEURS_LED[c.nom]) continue;
        const v = distri.querySelector(`[data-voyant="${c.nom}"] circle`);
        const on = !!etats[c.broche];
        v.setAttribute('fill', on ? COULEURS_LED[c.nom] : '#EEF3F6');
        v.setAttribute('stroke', on ? '#5B3A00' : '#7C8B94');
      }
      // Servo : 90° = trappe fermée, 0° = ouverte. Sans servo (exercice 8), la LED Trappe ouvre la trappe.
      const servo = composants.find((c) => c.type === 'servo');
      const ledTrappe = composants.find((c) => c.type === 'led' && c.nom === 'Trappe');
      let ouverture = 0; // 0 fermée, 1 ouverte
      if (servo) ouverture = Math.min(1, Math.max(0, (90 - (etats[servo.broche] || 0)) / 90));
      else if (ledTrappe) ouverture = etats[ledTrappe.broche] ? 1 : 0;
      distri.querySelector('.trappe').style.transform = `rotate(${ouverture * 80}deg)`;
      // Les céréales ne tombent que pendant la simulation.
      distri.classList.toggle('ouverte', ouverture > 0.6 && !!enMarche);
      distri.querySelector('.trappe-etat').textContent = ouverture > 0.6 ? 'Trappe ouverte' : 'Trappe fermée';
    }

    // etats : { broche: valeur } (LED 0/1, servo en degrés, boutons 0/1)
    function afficher(etats, enMarche) {
      for (const c of composants) maj(c.broche, etats[c.broche] || 0);
      majDistributeur(etats, enMarche);
    }

    return { afficher };
  }

  Object.assign(A, { creerVueSimulateur: creerVue, couleurFil });
})(this);

// ===== interface/aides.js =====
// Aides pédagogiques (reprises de l'atelier) : indices (3 niveaux), fiches « À savoir » (avec schéma), lexique.
// Les textes viennent du paquet de parcours (exercices, fiches, lexique).
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const C = () => A.COULEURS_BLOCS;
  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // ---------- Petits blocs (même allure que l'éditeur), pour les fiches et la silhouette ----------

  // trous : true → chaque valeur (broche, HAUT/BAS, nombre, symbole) devient une case « ? ».
  function blocsHtml(programme, options) {
    const o = options || {};
    const trous = !!o.trous;
    const trou = '<span class="pb-trou" aria-label="à compléter">?</span>';
    const pastille = (texte) => (trous ? trou : `<span class="pb-champ">${echapper(texte)}</span>`);
    const image = (nom) => `<img class="pb-icone" alt="" src="${A.imageIcone(nom, '#1F2A30', 2.6)}">`;
    const hautBas = (v) => (v ? 'HAUT (1)' : 'BAS (0)');
    const hautBasLed = (v) => (A.aideLed ? (v ? 'HAUT (1) : allumée' : 'BAS (0) : éteinte') : hautBas(v));

    function expression(e) {
      if (e === null || e === undefined) return '<span class="pb-vide" aria-label="case vide"></span>';
      if (typeof e === 'number') return pastille(String(e));
      switch (e.bloc) {
        case 'nombre':
          return pastille(String(e.valeur));
        case 'variable':
          return `<span class="pb-rond" style="background:${C().variable}">${echapper(e.variable || 'CHOIX')}</span>`;
        case 'operation':
          return `<span class="pb-rond pb-grand" style="background:${C().bleu}">${expression(e.a)} ${trous ? trou : echapper(e.op === 'mod' ? 'reste de ÷' : e.op)} ${expression(e.b)}</span>`;
        case 'hasard':
          return `<span class="pb-rond pb-grand" style="background:${C().bleu}">nombre au hasard entre ${expression(e.min)} et ${expression(e.max)}</span>`;
        case 'logique':
          return `<span class="pb-hexa pb-grand" style="background:${C().bleu}">${expression(e.a)} ${trous ? trou : e.op} ${expression(e.b)}</span>`;
        case 'non':
          return `<span class="pb-hexa pb-grand" style="background:${C().bleu}">non ${expression(e.a)}</span>`;
        case 'bouton_etat':
          return `<span class="pb-hexa" style="background:${C().valeur}">${image('bouton')} état sur la broche ${pastille(e.broche)}</span>`;
        case 'valeur_haut_bas':
          return `<span class="pb-hexa" style="background:${C().valeur}">${trous ? trou : hautBas(e.valeur)}</span>`;
        case 'comparaison':
          return `<span class="pb-hexa pb-grand" style="background:${C().bleu}">${expression(e.a)} ${trous ? trou : e.op} ${expression(e.b)}</span>`;
        default:
          return '';
      }
    }

    function instruction(i) {
      const style = (c) => `style="background:${c}"`;
      switch (i.bloc) {
        case 'led_etat':
          return `<div class="pb-bloc" ${style(C().lumiere)}>${image('lumiere')} contrôler la LED à l’état ${pastille(hautBasLed(i.etat))} sur la broche ${pastille(i.broche)}</div>`;
        case 'attendre':
          return `<div class="pb-bloc" ${style(C().bleu)}>attendre ${expression(i.duree)} seconde(s)</div>`;
        case 'servo_angle':
          return `<div class="pb-bloc" ${style(C().servo)}>${image('moteur')} contrôler l’angle à ${expression(i.angle)} ° sur la broche ${pastille(i.broche)}</div>`;
        case 'affecter':
          return `<div class="pb-bloc" ${style(C().variable)}>affecter à <span class="pb-champ">${echapper(i.variable || 'CHOIX')}</span> la valeur ${expression(i.valeur)}</div>`;
        case 'ajouter_a':
          return `<div class="pb-bloc" ${style(C().variable)}>ajouter à <span class="pb-champ">${echapper(i.variable || 'CHOIX')}</span> la valeur ${expression(i.valeur)}</div>`;
        case 'son':
          return `<div class="pb-bloc" ${style(C().lumiere)}>${image('son')} jouer la note ${expression(i.frequence)} Hz pendant ${expression(i.duree)} s sur la broche ${pastille(i.broche)}</div>`;
        case 'repeter_n':
        case 'tant_que':
        case 'repeter_jusqua': {
          const tete = i.bloc === 'repeter_n' ? `répéter ${expression(i.fois)} fois` : i.bloc === 'tant_que' ? `tant que ${expression(i.condition)} répéter` : `répéter jusqu’à ${expression(i.condition)}`;
          return `<div class="pb-c" style="--c:${C().decision}"><div class="pb-tete">${tete}</div><div class="pb-corps">${pile(i.corps)}</div><div class="pb-pied"></div></div>`;
        }
        case 'si_alors':
        case 'si_sinon': {
          const c = C().decision;
          let h = `<div class="pb-c" style="--c:${c}"><div class="pb-tete">si ${expression(i.condition)} alors</div>`;
          h += `<div class="pb-corps">${pile(i.alors)}</div>`;
          if (i.bloc === 'si_sinon') h += `<div class="pb-tete pb-milieu">sinon</div><div class="pb-corps">${pile(i.sinon)}</div>`;
          return h + '<div class="pb-pied"></div></div>';
        }
        default:
          return '';
      }
    }

    function pile(liste) {
      if (!liste || !liste.length) return '<div class="pb-emplacement"></div>';
      return liste.map(instruction).join('');
    }

    const chapeau = (titre, liste) =>
      `<div class="pb-c pb-chapeau" style="--c:${C().debut}"><div class="pb-tete">${titre}</div>` +
      `<div class="pb-corps">${pile(liste)}</div><div class="pb-pied"></div></div>`;

    // Programme v1 (fils) ou programme de l'atelier ({ demarrage, boucle }).
    const fils = A.versV1(programme || {}).fils;
    const fil = (q) => fils.find((f) => f.quand === q);
    let h = '<div class="petits-blocs">';
    const demarrage = fil('demarrage');
    if (demarrage && (demarrage.corps.length || o.avecVides)) h += chapeau('Au démarrage', demarrage.corps);
    if (fil('boucle')) h += chapeau('Répéter indéfiniment', fil('boucle').corps);
    for (const f of fils.filter((x) => x.quand === 'appui' || x.quand === 'relache')) {
      h += chapeau(`${image('bouton')} quand le bouton de la broche ${pastille(f.broche)} est ${f.quand === 'appui' ? 'appuyé' : 'relâché'}`, f.corps);
    }
    return h + '</div>';
  }

  // ---------- Schémas des fiches ----------

  function chronogramme(series) {
    const total = Math.max(...series.map((s) => s.etats.reduce((t, e) => t + e[0], 0)));
    const largeur = 300;
    const gauche = 92;
    const hLigne = 44;
    const ech = (largeur - gauche - 8) / total;
    let svg = `<svg class="schema-svg" viewBox="0 0 ${largeur} ${series.length * hLigne + 26}" role="img" aria-label="Chronogramme">`;
    series.forEach((s, i) => {
      const y0 = 10 + i * hLigne;
      svg += `<text x="0" y="${y0 + 20}" class="schema-texte">${echapper(s.nom)}</text>`;
      let x = gauche;
      for (const [duree, etat] of s.etats) {
        const w = duree * ech;
        const haut = etat === 'HAUT' || /^9|^18/.test(etat);
        const y = haut ? y0 + 2 : y0 + 22;
        svg += `<rect x="${x}" y="${y}" width="${w}" height="${haut ? 28 : 8}" rx="3" fill="${haut ? '#FAB22B' : '#D5DEE3'}" stroke="#1F2A30" stroke-width="1.2"/>`;
        if (w > 22) svg += `<text x="${x + w / 2}" y="${haut ? y + 18 : y - 4}" text-anchor="middle" class="schema-petit">${echapper(etat)}</text>`;
        x += w;
      }
    });
    // Axe du temps, en secondes
    const yAxe = series.length * hLigne + 12;
    svg += `<line x1="${gauche}" y1="${yAxe}" x2="${largeur - 8}" y2="${yAxe}" stroke="#4F5D66" stroke-width="1.2"/>`;
    for (let t = 0; t <= total; t += total > 4 ? 2 : 1) {
      const x = gauche + t * ech;
      svg += `<line x1="${x}" y1="${yAxe - 3}" x2="${x}" y2="${yAxe + 3}" stroke="#4F5D66"/>`;
      svg += `<text x="${x}" y="${yAxe + 13}" text-anchor="middle" class="schema-petit">${t} s</text>`;
    }
    return svg + '</svg>';
  }

  function ledSchema() {
    const led = (x, on) =>
      `<g transform="translate(${x},0)">` +
      (on ? '<circle cx="24" cy="30" r="22" fill="#FAB22B" opacity=".3"/>' : '') +
      `<path d="M12 46V30a12 12 0 0 1 24 0v16z" fill="${on ? '#FAB22B' : '#EEF3F6'}" stroke="${on ? '#5B3A00' : '#7C8B94'}" stroke-width="2.5"/>` +
      '<path d="M20 46v14M28 46v10" stroke="#7C8B94" stroke-width="3" stroke-linecap="round"/>' +
      `<text x="24" y="78" text-anchor="middle" class="schema-texte">${on ? 'HAUT (1)' : 'BAS (0)'}</text>` +
      `<text x="24" y="92" text-anchor="middle" class="schema-petit">${on ? 'allumée' : 'éteinte'}</text></g>`;
    return `<svg class="schema-svg schema-etroit" viewBox="0 0 200 96" role="img" aria-label="LED éteinte et LED allumée">${led(30, false)}${led(122, true)}</svg>`;
  }

  function servoSchema(angles) {
    const cadran = (cx, angle, legende) => {
      const r = (angle * Math.PI) / 180;
      return (
        `<g><path d="M${cx - 30} 50A30 30 0 0 1 ${cx + 30} 50" fill="none" stroke="#9AA8B0" stroke-width="2"/>` +
        `<line x1="${cx}" y1="50" x2="${cx + 24 * Math.cos(r)}" y2="${50 - 24 * Math.sin(r)}" stroke="#1F2A30" stroke-width="6" stroke-linecap="round"/>` +
        `<line x1="${cx}" y1="50" x2="${cx + 24 * Math.cos(r)}" y2="${50 - 24 * Math.sin(r)}" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>` +
        `<circle cx="${cx}" cy="50" r="4" fill="#FFFFFF" stroke="#1F2A30" stroke-width="2"/>` +
        `<text x="${cx}" y="68" text-anchor="middle" class="schema-texte">${angle}°</text>` +
        (legende ? `<text x="${cx}" y="82" text-anchor="middle" class="schema-petit">${legende}</text>` : '') +
        '</g>'
      );
    };
    if (!angles) {
      return (
        '<svg class="schema-svg" viewBox="0 0 300 90" role="img" aria-label="Servo-moteur à 0°, 90° et 180°">' +
        cadran(50, 0, 'bras à droite') + cadran(150, 90, 'bras en haut') + cadran(250, 180, 'bras à gauche') + '</svg>'
      );
    }
    const pas = 300 / angles.length;
    let svg = `<svg class="schema-svg" viewBox="0 0 300 90" role="img" aria-label="Suite de positions du servo-moteur">`;
    angles.forEach((a, i) => {
      svg += cadran(pas / 2 + i * pas, a, '');
      if (i < angles.length - 1) svg += `<text x="${pas * (i + 1)}" y="44" text-anchor="middle" class="schema-texte">›</text>`;
    });
    return svg + '</svg>';
  }

  function fourche() {
    return (
      '<svg class="schema-svg" viewBox="0 0 300 120" role="img" aria-label="Fourche si alors sinon">' +
      '<rect x="95" y="4" width="110" height="30" rx="8" fill="#78B5D6" stroke="#1F2A30" stroke-width="1.5"/>' +
      '<text x="150" y="24" text-anchor="middle" class="schema-texte">bouton appuyé ?</text>' +
      '<path d="M150 34v14M150 48H70v18M150 48h80v18" fill="none" stroke="#1F2A30" stroke-width="2"/>' +
      '<text x="96" y="62" class="schema-petit">oui</text><text x="186" y="62" class="schema-petit">non</text>' +
      '<rect x="10" y="68" width="120" height="44" rx="8" fill="#F7AE5E" stroke="#1F2A30" stroke-width="1.5"/>' +
      '<text x="70" y="86" text-anchor="middle" class="schema-texte">alors</text><text x="70" y="102" text-anchor="middle" class="schema-petit">LED allumée</text>' +
      '<rect x="170" y="68" width="120" height="44" rx="8" fill="#F7AE5E" stroke="#1F2A30" stroke-width="1.5"/>' +
      '<text x="230" y="86" text-anchor="middle" class="schema-texte">sinon</text><text x="230" y="102" text-anchor="middle" class="schema-petit">LED éteinte</text>' +
      '</svg>'
    );
  }

  function capteurActionneur() {
    const boite = (x, couleur, titre, sous) =>
      `<rect x="${x}" y="20" width="84" height="48" rx="8" fill="${couleur}" stroke="#1F2A30" stroke-width="1.5"/>` +
      `<text x="${x + 42}" y="40" text-anchor="middle" class="schema-texte">${titre}</text>` +
      `<text x="${x + 42}" y="56" text-anchor="middle" class="schema-petit">${sous}</text>`;
    const fleche = (x) => `<path d="M${x} 44h20m-6-6 6 6-6 6" fill="none" stroke="#1F2A30" stroke-width="2" stroke-linecap="round"/>`;
    return (
      '<svg class="schema-svg" viewBox="0 0 300 88" role="img" aria-label="Le capteur commande l’actionneur">' +
      boite(0, '#78B5D6', 'Bouton', 'capteur') + fleche(88) + boite(108, '#BCDAEB', 'Carte', 'programme') + fleche(196) +
      boite(216, '#E78AB3', 'Moteur', 'actionneur') + '</svg>'
    );
  }

  function variableSchema(nom, valeur) {
    return (
      '<svg class="schema-svg schema-etroit" viewBox="0 0 200 100" role="img" aria-label="Une variable est une boîte avec une étiquette">' +
      '<path d="M40 40h120v52H40z" fill="#FFF4DD" stroke="#1F2A30" stroke-width="2"/>' +
      '<path d="M40 40l14-16h92l14 16" fill="#F0D9A8" stroke="#1F2A30" stroke-width="2" stroke-linejoin="round"/>' +
      `<rect x="62" y="6" width="76" height="22" rx="6" fill="#EC8780" stroke="#1F2A30" stroke-width="1.5"/>` +
      `<text x="100" y="22" text-anchor="middle" class="schema-texte">${echapper(nom)}</text>` +
      `<text x="100" y="76" text-anchor="middle" class="schema-grand">${echapper(valeur)}</text>` +
      '</svg>'
    );
  }

  // Au démarrage (une fois), puis Répéter indéfiniment (sans fin).
  function deroulement() {
    return (
      '<svg class="schema-svg" viewBox="0 0 300 116" role="img" aria-label="Au démarrage une fois, puis Répéter indéfiniment sans fin">' +
      '<rect x="4" y="34" width="112" height="44" rx="14" fill="#86C595" stroke="#1F2A30" stroke-width="1.5"/>' +
      '<text x="60" y="54" text-anchor="middle" class="schema-texte">Au démarrage</text>' +
      '<text x="60" y="69" text-anchor="middle" class="schema-petit">une seule fois</text>' +
      '<path d="M118 56h40m-7-7 7 7-7 7" fill="none" stroke="#1F2A30" stroke-width="2.2" stroke-linecap="round"/>' +
      '<rect x="162" y="34" width="134" height="44" rx="14" fill="#86C595" stroke="#1F2A30" stroke-width="1.5"/>' +
      '<text x="229" y="54" text-anchor="middle" class="schema-texte">Répéter indéfiniment</text>' +
      '<text x="229" y="69" text-anchor="middle" class="schema-petit">puis sans fin</text>' +
      '<path d="M270 80c0 26-82 26-82 0" fill="none" stroke="#1A6E8E" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M182 86l6-7 6 7" fill="none" stroke="#1A6E8E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<text x="229" y="112" text-anchor="middle" class="schema-petit">on recommence au début</text>' +
      '<text x="60" y="22" text-anchor="middle" class="schema-petit">la carte s’allume</text>' +
      '</svg>'
    );
  }

  function schemaHtml(s) {
    if (!s) return '';
    switch (s.type) {
      case 'led':
        return ledSchema();
      case 'chronogramme':
        return chronogramme(s.series);
      case 'blocs':
        return blocsHtml(s.programme, {});
      case 'fourche':
        return fourche();
      case 'servo':
        return servoSchema();
      case 'angles':
        return servoSchema(s.angles);
      case 'capteur-actionneur':
        return capteurActionneur();
      case 'deroulement':
        return deroulement();
      case 'variable':
        return variableSchema(s.nom || 'CHOIX', s.valeur === undefined ? 3 : s.valeur);
      default:
        return '';
    }
  }

  // ---------- Panneau qui glisse par-dessus l'éditeur ----------

  function creerAides(rappels) {
    const panneau = document.querySelector('.panneau-aide');
    const titre = panneau.querySelector('.panneau-aide-titre');
    const corps = panneau.querySelector('.panneau-aide-corps');
    const icone = panneau.querySelector('.panneau-aide-icone');
    let ouvert = null; // 'fiche' | 'indice'
    let exercice = null;

    function ouvrir(sorte, nomIcone, texteTitre, html) {
      ouvert = sorte;
      icone.innerHTML = A.icone(nomIcone, { couleur: '#1A6E8E' });
      titre.textContent = texteTitre;
      corps.innerHTML = html;
      panneau.hidden = false;
      panneau.querySelector('.panneau-aide-fermer').focus();
      for (const b of document.querySelectorAll('[data-aide]')) b.setAttribute('aria-expanded', String(b.dataset.aide === sorte));
    }
    function fermer() {
      ouvert = null;
      panneau.hidden = true;
      for (const b of document.querySelectorAll('[data-aide]')) b.setAttribute('aria-expanded', 'false');
    }
    panneau.querySelector('.panneau-aide-fermer').addEventListener('click', fermer);

    // ----- Fiche « À savoir » -----

    // Fiche choisie par sa clé (ex. l'explication des blocs « Au démarrage » et « Répéter indéfiniment »).
    function explication(cle) {
      const f = (A.fiches || {})[cle];
      if (!f) return;
      ouvrir('explication', 'info', f.titre,
        '<ul class="fiche-lignes">' + f.lignes.map((l) => `<li>${echapper(l)}</li>`).join('') + '</ul>' +
          `<div class="fiche-schema">${schemaHtml(f.schema)}</div>`);
    }

    function fiche() {
      if (ouvert === 'fiche') return fermer();
      const f = (A.fiches || {})[exercice.aSavoir];
      if (!f) return ouvrir('fiche', 'info', 'À savoir', '<p>Pas de fiche pour cet exercice.</p>');
      let html = '<ul class="fiche-lignes">' + f.lignes.map((l) => `<li>${echapper(l)}</li>`).join('') + '</ul>';
      if (f.etapes) {
        html += '<div class="fiche-etapes" aria-live="polite"></div>' +
          '<div class="fiche-navigation"><button type="button" class="btn-secondaire btn-etape-prec">Précédent</button>' +
          '<span class="etape-numero"></span>' +
          '<button type="button" class="btn-principal btn-etape-suiv">Suivant</button></div>';
      } else html += `<div class="fiche-schema">${schemaHtml(f.schema)}</div>`;
      ouvrir('fiche', 'info', f.titre, html);
      if (f.etapes) {
        let n = 0;
        const montrer = () => {
          const e = f.etapes[n];
          corps.querySelector('.fiche-etapes').innerHTML = `<p class="etape-texte">${echapper(e.texte)}</p>${blocsHtml(e.programme, {})}`;
          corps.querySelector('.etape-numero').textContent = `Étape ${n + 1} sur ${f.etapes.length}`;
          corps.querySelector('.btn-etape-prec').disabled = n === 0;
          corps.querySelector('.btn-etape-suiv').disabled = n === f.etapes.length - 1;
        };
        corps.querySelector('.btn-etape-prec').addEventListener('click', () => {
          n = Math.max(0, n - 1);
          montrer();
        });
        corps.querySelector('.btn-etape-suiv').addEventListener('click', () => {
          n = Math.min(f.etapes.length - 1, n + 1);
          montrer();
        });
        montrer();
      }
    }

    // ----- Indices : révélés un par un, jamais la solution complète -----

    const NOMS = ['La consigne en une phrase', 'Les blocs à utiliser', 'La silhouette du programme'];
    function indiceHtml(niveau) {
      if (niveau === 3) {
        const solution = exercice.silhouette || exercice.solutionReference;
        return '<p>Les cases « ? » sont à compléter : à toi de trouver les broches et les valeurs.</p>' + blocsHtml(solution, { trous: true });
      }
      return `<p>${echapper((exercice.indices || [])[niveau - 1] || '')}</p>`;
    }
    function dessinerIndices() {
      const vus = rappels.indicesOuverts();
      let html = '';
      for (let n = 1; n <= vus; n++) {
        html += `<section class="indice"><h3><span class="indice-niveau">${n}</span>${NOMS[n - 1]}</h3>${indiceHtml(n)}</section>`;
      }
      if (vus < 3) {
        html +=
          (vus ? '' : '<p class="indice-intro">Trois indices, du plus léger au plus fort. Ouvre-les un par un.</p>') +
          '<p class="indice-note">Les indices s’ouvrent un par un. Ton professeur voit combien tu en as utilisé : essaie d’abord sans !</p>' +
          `<button type="button" class="btn-principal btn-indice-suivant">${A.icone('ampoule')}Voir l’indice ${vus + 1}</button>`;
      } else html += '<p class="indice-intro">Tu as vu les trois indices. La solution complète n’est jamais montrée : à toi de jouer !</p>';
      ouvrir('indice', 'ampoule', `Indices (${vus}/3)`, html);
      const b = corps.querySelector('.btn-indice-suivant');
      if (b) {
        b.addEventListener('click', () => {
          rappels.ouvrirIndice(vus + 1);
          dessinerIndices();
          const dernier = corps.querySelectorAll('.indice');
          if (dernier.length) dernier[dernier.length - 1].scrollIntoView({ block: 'nearest' });
        });
      }
    }
    function indice() {
      if (ouvert === 'indice') return fermer();
      dessinerIndices();
    }

    return {
      changerExercice(ex) {
        exercice = ex;
        fermer();
      },
      fiche,
      indice,
      explication,
      fermer,
    };
  }

  // ---------- Lexique : toutes les définitions, avec recherche ----------

  function creerLexique(motsVus) {
    const dialogue = document.querySelector('.dialogue-lexique');
    const recherche = dialogue.querySelector('.lexique-recherche');
    const filtre = dialogue.querySelector('.lexique-vus');
    const grille = dialogue.querySelector('.lexique-grille');
    const simple = (s) => A.simplifierNom(s);

    function dessiner() {
      const q = simple(recherche.value);
      const vus = motsVus();
      const entrees = (A.lexique || []).map((e, i) => ({ e, i })).filter(({ e, i }) => {
        if (filtre.checked && !vus.has(i)) return false;
        return !q || simple(e.mot).includes(q) || simple(e.definition).includes(q) || (e.formes || []).some((f) => simple(f).includes(q));
      });
      if (!entrees.length) {
        grille.innerHTML = `<p class="lexique-vide">Aucun mot ne correspond${recherche.value ? ` à « ${echapper(recherche.value)} »` : ''}.</p>`;
        return;
      }
      grille.innerHTML = entrees
        .map(
          ({ e, i }) =>
            `<article class="lexique-carte${vus.has(i) ? ' vu' : ''}">` +
            `<div class="lexique-picto">${A.icone(e.icone || 'livre', { couleur: '#1A6E8E', epaisseur: 2.4 })}</div>` +
            `<div><h3>${echapper(e.mot)}${vus.has(i) ? '<span class="lexique-badge">déjà vu</span>' : ''}</h3>` +
            `<p>${echapper(e.definition)}</p></div></article>`,
        )
        .join('');
    }
    recherche.addEventListener('input', dessiner);
    filtre.addEventListener('change', dessiner);
    dialogue.querySelector('.btn-fermer-lexique').addEventListener('click', () => dialogue.close());

    return {
      ouvrir() {
        recherche.value = '';
        dessiner();
        dialogue.showModal();
        recherche.focus();
      },
    };
  }

  // Le mot apparaît-il tel quel dans le texte (pas au milieu d'un autre mot) ?
  function contientMot(texte, mot) {
    const echappe = mot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(?<![\\p{L}\\d])' + echappe + '(?![\\p{L}\\d])', 'u').test(texte);
  }

  Object.assign(A, { blocsHtml, schemaHtml, creerAides, creerLexique, contientMot });
})(this);

// ===== interface/fichiers.js =====
// Fichier de l'équipe : choix du dossier, ouverture, enregistrement, copie de secours (repris de l'atelier).
// Chrome (et Edge) : on choisit le dossier de l'équipe une fois, puis le fichier s'y réécrit tout seul.
// Firefox : pas d'accès aux dossiers ; « Enregistrer » télécharge le fichier, à ranger ensuite.
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  // Clés propres au projet (un projet = son dossier, son fichier mémorisé, sa copie de secours).
  const cle = () => 'labo-blocs-' + ((A.projet && A.projet.id) || 'projet');
  const CLE_SECOURS = () => cle() + '-secours';

  const accesDossiers = typeof global.showDirectoryPicker === 'function';
  const accesFichiers = typeof global.showOpenFilePicker === 'function' && typeof global.showSaveFilePicker === 'function';
  const TYPES = [{ description: 'Sauvegarde de l’équipe', accept: { 'application/json': ['.json'] } }];

  const nomFichier = (donnees) => A.nomEquipe(donnees.equipe.eleves) + '.json';
  const texte = (donnees) => JSON.stringify(donnees, null, 1);

  // Droit d'écrire dans le fichier. demander = false : on regarde seulement, sans afficher la fenêtre
  // « Autoriser ce site à modifier … ? » (elle n'est montrée qu'au premier vrai travail de l'équipe).
  async function autorise(handle, demander) {
    const options = { mode: 'readwrite' };
    if ((await handle.queryPermission(options)) === 'granted') return true;
    if (demander === false) return false;
    return (await handle.requestPermission(options)) === 'granted';
  }

  async function lireHandle(handle) {
    return A.lireSauvegarde(await (await handle.getFile()).text());
  }

  // ---------- Choix du dossier de l'équipe (nouvelle équipe) ----------

  // Renvoie { dossier, nom } ou null si l'élève a fermé la fenêtre.
  async function choisirDossier() {
    try {
      const dossier = await global.showDirectoryPicker({ id: cle(), mode: 'readwrite' });
      return { dossier, nom: dossier.name };
    } catch (e) {
      if (e && e.name === 'AbortError') return null;
      throw e;
    }
  }

  // Le dossier choisi est-il celui de l'équipe, le dossier du projet (ex. « DISTRIBUTEUR DE CEREALES »), ou un autre ?
  function analyserDossier(nomDossier, equipe) {
    const s = A.simplifierNom(nomDossier);
    if (s === A.simplifierNom(equipe)) return 'equipe';
    const projet = A.projet && A.projet.cheminSauvegarde ? A.projet.cheminSauvegarde[A.projet.cheminSauvegarde.length - 2] : '';
    if (projet && s === A.simplifierNom(projet)) return 'parent';
    return 'autre';
  }

  async function creerSousDossier(dossier, nom) {
    return dossier.getDirectoryHandle(nom, { create: true });
  }

  // Une sauvegarde existe-t-elle déjà dans ce dossier ? On regarde tous les fichiers .json, pour ne pas
  // créer un deuxième fichier si l'équipe a écrit son prénom autrement (« Lea » au lieu de « Léa »).
  // Renvoie d'abord le fichier au nom de l'équipe, sinon la première sauvegarde valide, sinon un .json
  // invalide qui porte le nom de l'équipe (à ne pas écraser), sinon null.
  async function sauvegardeExistante(dossier, nom) {
    const cible = A.simplifierNom(nom.replace(/\.json$/i, ''));
    let premiere = null;
    let homonymeInvalide = null;
    try {
      for await (const entree of dossier.values()) {
        if (entree.kind !== 'file' || !/\.json$/i.test(entree.name)) continue;
        let lecture;
        try {
          lecture = await lireHandle(entree);
        } catch {
          continue;
        }
        const memeNom = A.simplifierNom(entree.name.replace(/\.json$/i, '')) === cible;
        if (lecture.ok && memeNom) return { handle: entree, lecture };
        if (lecture.ok && !premiere) premiere = { handle: entree, lecture };
        if (!lecture.ok && memeNom) homonymeInvalide = { handle: entree, lecture };
      }
    } catch {
      return null;
    }
    return premiere || homonymeInvalide;
  }

  async function fichierDansDossier(dossier, nom) {
    return dossier.getFileHandle(nom, { create: true });
  }

  // ---------- Ouvrir une sauvegarde ----------

  // Renvoie { lecture, handle } (handle nul sur Firefox) ou null si annulé.
  async function ouvrir() {
    if (accesFichiers) {
      let handle;
      try {
        [handle] = await global.showOpenFilePicker({ id: cle(), types: TYPES, multiple: false });
      } catch (e) {
        if (e && e.name === 'AbortError') return null;
        throw e;
      }
      const lecture = await lireHandle(handle);
      return { lecture, handle };
    }
    // Repli : sélecteur de fichier classique.
    return new Promise((resoudre) => {
      const entree = document.createElement('input');
      entree.type = 'file';
      entree.accept = '.json,application/json';
      entree.addEventListener('change', async () => {
        const f = entree.files && entree.files[0];
        if (!f) return resoudre(null);
        resoudre({ lecture: A.lireSauvegarde(await f.text()), handle: null });
      });
      entree.addEventListener('cancel', () => resoudre(null));
      entree.click();
    });
  }

  // ---------- Enregistrer ----------

  // Écrit dans le fichier connu si possible. Renvoie { ok, handle, telecharge }.
  async function enregistrer(donnees, handle, options) {
    const o = options || {};
    if (handle) {
      if (!(await autorise(handle, !o.silencieux))) {
        if (o.silencieux) return { ok: false, handle, permission: true };
        throw new Error('permission');
      }
      const flux = await handle.createWritable();
      await flux.write(texte(donnees));
      await flux.close();
      return { ok: true, handle };
    }
    if (o.silencieux) return { ok: false, handle: null };
    if (accesFichiers) {
      let nouveau;
      try {
        nouveau = await global.showSaveFilePicker({ id: cle(), suggestedName: nomFichier(donnees), types: TYPES });
      } catch (e) {
        if (e && e.name === 'AbortError') return { ok: false, handle: null };
        throw e;
      }
      return enregistrer(donnees, nouveau);
    }
    // Firefox : téléchargement classique.
    const url = URL.createObjectURL(new Blob([texte(donnees)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nomFichier(donnees);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return { ok: true, handle: null, telecharge: true };
  }

  // ---------- Fichier de l'équipe mémorisé entre deux ouvertures de la page (IndexedDB) ----------

  function base() {
    return new Promise((resoudre, rejeter) => {
      const r = indexedDB.open(cle(), 1);
      r.onupgradeneeded = () => r.result.createObjectStore('fichiers');
      r.onsuccess = () => resoudre(r.result);
      r.onerror = () => rejeter(r.error);
    });
  }
  async function memoriserHandle(handle) {
    try {
      const db = await base();
      await new Promise((ok, ko) => {
        const t = db.transaction('fichiers', 'readwrite');
        if (handle) t.objectStore('fichiers').put(handle, 'equipe');
        else t.objectStore('fichiers').delete('equipe');
        t.oncomplete = ok;
        t.onerror = () => ko(t.error);
      });
    } catch {
      /* stockage indisponible : on redemandera le fichier */
    }
  }
  async function handleMemorise() {
    try {
      const db = await base();
      return await new Promise((ok) => {
        const r = db.transaction('fichiers').objectStore('fichiers').get('equipe');
        r.onsuccess = () => ok(r.result || null);
        r.onerror = () => ok(null);
      });
    } catch {
      return null;
    }
  }

  // ---------- Copie de secours dans le navigateur ----------

  function sauverSecours(donnees) {
    try {
      localStorage.setItem(CLE_SECOURS(), JSON.stringify(donnees));
    } catch {
      /* navigation privée ou stockage plein */
    }
  }
  function lireSecours() {
    try {
      const t = localStorage.getItem(CLE_SECOURS());
      if (!t) return null;
      const r = A.lireSauvegarde(t);
      return r.ok ? r.donnees : null;
    } catch {
      return null;
    }
  }
  function effacerSecours() {
    try {
      localStorage.removeItem(CLE_SECOURS());
    } catch {
      /* rien */
    }
  }

  A.fichiers = {
    accesDossiers,
    accesFichiers,
    nomFichier,
    choisirDossier,
    analyserDossier,
    creerSousDossier,
    sauvegardeExistante,
    fichierDansDossier,
    ouvrir,
    enregistrer,
    autorise,
    memoriserHandle,
    handleMemorise,
    sauverSecours,
    lireSecours,
    effacerSecours,
  };
})(this);

// ===== interface/session.js =====
// Session de l'équipe : un seul fichier (Prénom_Prénom.json) pour le carnet de projet et les exercices.
// Copie de secours dans le navigateur à chaque modification ; fichier de l'équipe réécrit tout seul
// (Chrome, Edge) ou par le bouton « Enregistrer » (Firefox : téléchargement).
(function (global) {
  'use strict';

  const A = global.LaboBlocs;

  // options : { donnees, handle, lecture (mode enseignant : rien n'est enregistré) }
  function creerSession(options) {
    const s = {
      donnees: options.donnees,
      handle: options.handle || null,
      lecture: !!options.lecture,
      nonEnregistre: false,
      dernierEnregistrement: null,
      attenteAutorisation: false,
    };
    const avantEcriture = []; // ex. l'écran d'exercice range le programme affiché dans les données
    let minuteurFichier = null;
    let enCours = null;

    const preparer = () => avantEcriture.forEach((f) => f());

    // Une modification a eu lieu. Avec le fichier de l'équipe, il est réécrit tout seul
    // (tout de suite, ou après 10 s). geste : l'élève vient de cliquer (vérifier, indice…) ; si le
    // navigateur n'a pas encore donné le droit d'écrire dans le fichier, c'est le moment de le demander.
    function aEnregistrer(maintenant, geste) {
      if (s.lecture) return;
      preparer();
      A.fichiers.sauverSecours(s.donnees);
      s.nonEnregistre = true;
      majEtat();
      if (!s.handle) return;
      clearTimeout(minuteurFichier);
      if (geste) enregistrer('geste');
      else minuteurFichier = setTimeout(() => enregistrer('auto'), maintenant ? 0 : 10000);
    }

    // mode : 'auto' (minuteur : jamais de fenêtre), 'geste' (après un clic, sans message),
    // ou autre (bouton « Enregistrer » : message de confirmation).
    async function enregistrer(mode) {
      const automatique = mode === 'auto';
      const discret = automatique || mode === 'geste';
      if (s.lecture) return null;
      if (enCours) return enCours;
      preparer();
      A.fichiers.sauverSecours(s.donnees);
      majEtat('…');
      enCours = (async () => {
        try {
          const r = await A.fichiers.enregistrer(s.donnees, s.handle, { silencieux: automatique });
          if (r.ok) {
            if (r.handle && r.handle !== s.handle) {
              s.handle = r.handle;
              A.fichiers.memoriserHandle(r.handle);
            }
            s.nonEnregistre = false;
            s.dernierEnregistrement = new Date();
            s.attenteAutorisation = false;
            if (r.telecharge) message(`Le fichier « ${A.fichiers.nomFichier(s.donnees)} » est dans Téléchargements : range-le dans le dossier de ton équipe.`, 6000);
            else if (!discret) message('C’est enregistré dans le dossier de ton équipe.');
          } else if (r.permission) s.attenteAutorisation = true; // on attendra un clic de l'élève
        } catch {
          if (!automatique) message('L’enregistrement n’a pas marché. Clique encore sur « Enregistrer » et choisis le dossier de ton équipe.', 6000);
        } finally {
          enCours = null;
          majEtat();
        }
      })();
      return enCours;
    }

    // « Enregistré à 10:42 » à côté de chaque bouton Enregistrer (carnet et exercice).
    function majEtat(texte) {
      for (const el of document.querySelectorAll('.etat-enregistrement')) {
        if (texte) el.textContent = 'Enregistrement' + texte;
        else if (!s.nonEnregistre && s.dernierEnregistrement)
          el.textContent = 'Enregistré à ' + s.dernierEnregistrement.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        else el.textContent = s.nonEnregistre ? 'Pas encore enregistré' : '';
        el.classList.toggle('a-faire', !texte && s.nonEnregistre && (!s.handle || s.attenteAutorisation));
      }
    }

    let minuteurMessage = null;
    function message(texte, duree) {
      const t = document.querySelector('.message-bref');
      t.textContent = texte;
      t.hidden = false;
      clearTimeout(minuteurMessage);
      minuteurMessage = setTimeout(() => (t.hidden = true), duree || 2600);
    }

    for (const b of document.querySelectorAll('.btn-enregistrer')) {
      if (s.lecture) b.hidden = true;
      else b.addEventListener('click', () => enregistrer('bouton'));
    }
    if (s.lecture) for (const el of document.querySelectorAll('.etat-enregistrement')) el.hidden = true;

    // Rappel à la fermeture de l'onglet si le fichier n'est pas à jour.
    addEventListener('beforeunload', (e) => {
      if (s.lecture) return;
      preparer();
      A.fichiers.sauverSecours(s.donnees);
      if (s.nonEnregistre) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    Object.assign(s, { aEnregistrer, enregistrer, majEtat, message, surAvantEcriture: (f) => avantEcriture.push(f) });
    majEtat();
    return s;
  }

  A.creerSession = creerSession;
})(this);

// ===== interface/accueil.js =====
// Accueil (A1, A2 ; repris de l'atelier) : « Nouvelle équipe » (prénoms, classe, dossier de l'équipe),
// « Ouvrir notre sauvegarde », ou « Reprendre le travail de … ».
// Pas de compte : l'équipe tape ses prénoms. Le fichier est la seule référence ; la copie du
// navigateur sert seulement à reprendre après une fermeture d'onglet.
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const F = A.fichiers;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  function dateFr(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  // paquet : parcours préparé (pour l'avancement d'une sauvegarde trouvée dans le dossier).
  function demarrer(commencer, paquet) {
    const racine = $('.ecran-accueil');
    const nouvelleSauvegarde = () => A.creerSauvegarde(equipe, { parcours: paquet, projet: A.projet.id, application: A.projet.application });
    function avancementTexte(d) {
      const copie = JSON.parse(JSON.stringify(d));
      A.relierParcours(copie, paquet);
      const a = A.avancement(copie, paquet);
      return `${a.reussis}/${a.total} exercices réussis`;
    }
    racine.hidden = false;
    let equipe = null; // { eleves, classe, nom }

    for (const el of racine.querySelectorAll('[data-icone]')) el.outerHTML = A.icone(el.dataset.icone, { epaisseur: el.dataset.epaisseur });

    const panneaux = [...racine.querySelectorAll('.accueil-panneau')];
    function montrer(nom) {
      for (const p of panneaux) p.hidden = p.dataset.panneau !== nom;
      const champ = racine.querySelector(`[data-panneau="${nom}"] input, [data-panneau="${nom}"] button.btn-principal`);
      if (champ) champ.focus();
    }
    function erreur(nomPanneau, message) {
      const zone = $('.erreur-' + nomPanneau, racine);
      zone.textContent = message || '';
      zone.hidden = !message;
    }

    // ----- Choix -----

    const secours = F.lireSecours();
    const carte = $('.accueil-reprendre', racine);
    if (secours) {
      carte.hidden = false;
      $('.reprendre-equipe', carte).textContent = secours.equipe.eleves.join(', ') + (secours.equipe.classe ? ' · ' + secours.equipe.classe : '');
      $('.reprendre-date', carte).textContent = 'Dernière modification le ' + dateFr(secours.modifieLe);
    }
    $('.btn-reprendre', racine).addEventListener('click', async () => {
      // Le fichier mémorisé est réutilisé s'il est bien celui de cette équipe ; on prend la version la plus récente.
      let handle = await F.handleMemorise();
      let donnees = secours;
      if (handle) {
        try {
          // Pas de fenêtre d'autorisation ici : on lit le fichier seulement si c'est déjà permis.
          // L'autorisation d'écrire sera demandée au premier vrai travail (vérification, indice, Enregistrer).
          if ((await handle.queryPermission({ mode: 'read' })) === 'granted') {
            const lecture = A.lireSauvegarde(await (await handle.getFile()).text());
            const meme = lecture.ok && A.nomEquipe(lecture.donnees.equipe.eleves) === A.nomEquipe(secours.equipe.eleves);
            if (!meme) handle = null;
            else if (lecture.donnees.modifieLe > secours.modifieLe) donnees = lecture.donnees;
          }
        } catch {
          handle = null;
        }
      }
      fin(donnees, handle);
    });
    $('.btn-pas-nous', racine).addEventListener('click', () => (carte.hidden = true));

    $('.btn-ouvrir', racine).addEventListener('click', async () => {
      erreur('choix', '');
      let r;
      try {
        r = await F.ouvrir();
      } catch {
        return erreur('choix', 'Le fichier n’a pas pu être ouvert. Réessaie.');
      }
      if (!r) return;
      if (!r.lecture.ok) return erreur('choix', r.lecture.raison + ' Rien n’a été modifié.');
      // Pas de demande d'autorisation à l'ouverture : rien n'a encore été fait. Elle viendra au premier
      // vrai travail de l'équipe (vérification, indice ou clic sur « Enregistrer »).
      fin(r.lecture.donnees, r.handle);
    });

    // ----- Équipe -----

    // Chemin du dossier (modèle) et dossier du projet, Firefox.
    const modele = A.projet.cheminSauvegarde || ['{classe}', '{equipe}'];
    $('.chemin-texte', racine).textContent = modele.map((p) => p.replace('{classe}', (A.projet.classes || ['5A'])[0]).replace('{equipe}', 'Prénom_Prénom')).join(' › ');
    $('.nom-dossier-projet', racine).textContent = modele.length > 1 ? modele[modele.length - 2] : '';
    $('.info-firefox', racine).hidden = F.accesDossiers;

    const choixClasse = $('.champ-classe', racine);
    choixClasse.innerHTML =
      '<option value="">Choisis ta classe</option>' + (A.projet.classes || []).map((c) => `<option>${echapper(c)}</option>`).join('');

    $('.formulaire-equipe', racine).addEventListener('submit', (e) => {
      e.preventDefault();
      const eleves = [...racine.querySelectorAll('.champ-prenom')].map((c) => c.value.trim()).filter(Boolean);
      if (!eleves.length) return erreur('equipe', 'Écris au moins un prénom.');
      if (eleves.some((p) => !/^[\p{L}][\p{L}' -]*$/u.test(p))) return erreur('equipe', 'Un prénom ne doit contenir que des lettres.');
      if (!choixClasse.value) return erreur('equipe', 'Choisis ta classe.');
      erreur('equipe', '');
      equipe = { eleves, classe: choixClasse.value, nom: A.nomEquipe(eleves) };
      preparerDossier();
      montrer('dossier');
    });

    // ----- Dossier de l'équipe -----

    function preparerDossier() {
      const chemin = (A.projet.cheminSauvegarde || ['{classe}', '{equipe}']).map((p) => p.replace('{classe}', equipe.classe).replace('{equipe}', equipe.nom));
      $('.chemin', racine).innerHTML = chemin
        .map((p, i) => `<span class="chemin-dossier${i === chemin.length - 1 ? ' equipe' : ''}">${echapper(p)}</span>`)
        .join('<span class="chemin-fleche" aria-hidden="true">›</span>');
      $('.nom-fichier', racine).textContent = equipe.nom + '.json';
      $('.nom-dossier-equipe', racine).textContent = equipe.nom;
      racine.querySelector('[data-panneau="dossier"]').classList.toggle('sans-acces', !F.accesDossiers);
      $('.dossier-resultat', racine).innerHTML = '';
      $('.btn-choisir-dossier', racine).hidden = !F.accesDossiers;
      $('.btn-commencer-sans-dossier', racine).hidden = F.accesDossiers;
    }

    function resultat(html) {
      $('.dossier-resultat', racine).innerHTML = html;
    }

    async function choisirDossier() {
      erreur('dossier', '');
      let choix;
      try {
        choix = await F.choisirDossier();
      } catch {
        return erreur('dossier', 'Ce dossier ne peut pas être utilisé. Choisis-en un autre.');
      }
      if (!choix) return;
      const sorte = F.analyserDossier(choix.nom, equipe.nom);
      if (sorte === 'equipe') return valider(choix.dossier, '');
      if (sorte === 'parent') {
        const dossier = await F.creerSousDossier(choix.dossier, equipe.nom);
        return valider(dossier, `Le dossier « ${equipe.nom} » est prêt dans « ${choix.nom} ».`);
      }
      // Un autre dossier : on demande à l'élève.
      resultat(
        `<div class="avertissement"><p>Le dossier choisi s’appelle <strong>« ${echapper(choix.nom)} »</strong>. ` +
          `Le dossier de ton équipe devrait s’appeler <strong>« ${echapper(equipe.nom)} »</strong>.</p>` +
          '<div class="accueil-actions">' +
          '<button type="button" class="btn-principal btn-autre-dossier">Choisir un autre dossier</button>' +
          `<button type="button" class="btn-secondaire btn-creer-ici">Créer « ${echapper(equipe.nom)} » ici</button>` +
          '<button type="button" class="btn-secondaire btn-garder">Utiliser ce dossier quand même</button>' +
          '</div></div>',
      );
      $('.btn-autre-dossier', racine).addEventListener('click', choisirDossier);
      $('.btn-creer-ici', racine).addEventListener('click', async () =>
        valider(await F.creerSousDossier(choix.dossier, equipe.nom), `Le dossier « ${equipe.nom} » est prêt dans « ${choix.nom} ».`),
      );
      $('.btn-garder', racine).addEventListener('click', () => valider(choix.dossier, ''));
    }

    async function valider(dossier, note) {
      const nom = equipe.nom + '.json';
      // Ne jamais écraser une sauvegarde qui existe déjà : on propose de l'ouvrir.
      const existante = await F.sauvegardeExistante(dossier, nom);
      if (existante) {
        if (!existante.lecture.ok) {
          return resultat(
            `<div class="avertissement"><p>Ce dossier contient déjà un fichier « ${echapper(nom)} » qui n’est pas une sauvegarde d’équipe. ` +
              'Il n’a pas été touché. Choisis un autre dossier.</p></div>',
          );
        }
        const d = existante.lecture.donnees;
        resultat(
          `<div class="avertissement"><p>Ce dossier contient déjà la sauvegarde de <strong>${echapper(d.equipe.eleves.join(', '))}</strong> ` +
            `(${avancementTexte(d)}, modifiée le ${dateFr(d.modifieLe)}). Elle n’a pas été touchée.</p>` +
            '<div class="accueil-actions">' +
            '<button type="button" class="btn-principal btn-ouvrir-existante">Ouvrir cette sauvegarde</button>' +
            '<button type="button" class="btn-secondaire btn-autre-dossier">Choisir un autre dossier</button></div></div>',
        );
        $('.btn-ouvrir-existante', racine).addEventListener('click', () => fin(d, existante.handle));
        $('.btn-autre-dossier', racine).addEventListener('click', choisirDossier);
        return;
      }
      const donnees = nouvelleSauvegarde();
      let handle;
      try {
        handle = await F.fichierDansDossier(dossier, nom);
        await F.enregistrer(donnees, handle);
      } catch {
        return erreur('dossier', 'Impossible d’écrire dans ce dossier. Vérifie que c’est bien le dossier de ton équipe, ou demande à ton professeur.');
      }
      resultat(
        `<div class="confirmation">${A.icone('coche', { couleur: '#2E7D32', epaisseur: 2.8 })}<div>` +
          `<p><strong>Dossier validé.</strong> ${echapper(note)}</p>` +
          `<p>Ton travail s’enregistre dans le fichier « ${echapper(nom)} » de ce dossier.</p></div></div>` +
          `<div class="accueil-actions"><button type="button" class="btn-principal btn-commencer">Commencer${A.icone('suivant', { epaisseur: 2.8 })}</button></div>`,
      );
      $('.btn-choisir-dossier', racine).hidden = true;
      const b = $('.btn-commencer', racine);
      b.addEventListener('click', () => fin(donnees, handle));
      b.focus();
    }

    $('.btn-choisir-dossier', racine).addEventListener('click', choisirDossier);
    $('.btn-commencer-sans-dossier', racine).addEventListener('click', () => fin(nouvelleSauvegarde(), null));
    $('.btn-retour-equipe', racine).addEventListener('click', () => montrer('choix'));

    function fin(donnees, handle) {
      F.memoriserHandle(handle);
      F.sauverSecours(donnees);
      racine.hidden = true;
      commencer({ donnees, handle });
    }

    montrer('choix');
  }

  A.demarrerAccueil = demarrer;
})(this);

// ===== interface/ecran-parcours.js =====
// A3 · Parcours : les exercices dans l'ordre, l'état de chacun (verrouillé, à faire, en cours, réussi,
// à revérifier), les défis facultatifs, l'avancement. État toujours dit par un mot et un pictogramme.
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const ETATS = {
    reussi: { mot: 'Réussi', icone: 'coche' },
    a_reverifier: { mot: 'À revérifier', icone: 'alerte' },
    en_cours: { mot: 'En cours', icone: 'lecture' },
    a_faire: { mot: 'À faire', icone: 'suivant' },
    verrouille: { mot: 'Réussis le précédent pour l’ouvrir', icone: 'cadenas' },
  };

  // contexte : { session, paquet, toutDebloquer, ouvrirExercice(id) }
  function creerEcranParcours(contexte) {
    const { session, paquet } = contexte;
    const D = session.donnees;
    const opts = { toutDebloquer: !!contexte.toutDebloquer };
    const ecran = $('.ecran-parcours');

    function dessiner() {
      const a = A.avancement(D, paquet);
      $('.parcours-compte', ecran).textContent = `${a.reussis} exercice${a.reussis > 1 ? 's' : ''} réussi${a.reussis > 1 ? 's' : ''} sur ${a.total}`;
      const barre = $('.barre', ecran);
      barre.setAttribute('aria-label', `${a.reussis} sur ${a.total}`);
      $('span', barre).style.width = Math.round((a.reussis / Math.max(1, a.total)) * 100) + '%';
      $('.pilule-revoir', ecran).hidden = !a.aReverifier;
      $('.revoir-texte', ecran).textContent = `${a.aReverifier} exercice${a.aReverifier > 1 ? 's' : ''} à revérifier`;
      const reprendre = paquet.exercices.find((e) => e.id === A.exerciceAReprendre(D, paquet, opts));
      const continuer = $('.btn-continuer', ecran);
      continuer.innerHTML = `<span>Continuer : exercice ${echapper(reprendre.numero)}</span>${A.icone('suivant', { epaisseur: 2.8 })}`;
      continuer.onclick = () => contexte.ouvrirExercice(reprendre.id);

      $('.parcours-grille', ecran).innerHTML = paquet.exercices
        .map((ex) => {
          const etat = A.etat(D, paquet, ex.id, opts);
          const courant = ex.id === reprendre.id && etat !== 'reussi' && etat !== 'verrouille';
          const e = courant ? { mot: 'En cours', icone: 'lecture' } : ETATS[etat];
          const mot = ex.defi ? (etat === 'verrouille' ? 'Défi facultatif · verrouillé' : 'Défi facultatif · ' + e.mot.toLowerCase()) : e.mot;
          const classes = ['carte-exercice', 'etat-' + etat, courant ? 'courant' : '', ex.defi ? 'defi' : ''].join(' ');
          return (
            `<button type="button" class="${classes}" data-id="${echapper(ex.id)}"${etat === 'verrouille' ? ' aria-disabled="true"' : ''}>` +
            `<span class="numero-exercice">${echapper(ex.numero)}</span>` +
            `<span class="exercice-texte"><strong>${echapper(ex.titre)}</strong>` +
            `<span class="exercice-etat">${e.icone === 'lecture' ? A.LECTURE : A.icone(e.icone, { epaisseur: 2.6 })}${echapper(mot)}</span>` +
            (etat === 'a_reverifier' ? '<span class="exercice-note">La consigne a changé. Tes blocs sont gardés : relance la vérification.</span>' : '') +
            '</span></button>'
          );
        })
        .join('');
    }

    $('.parcours-grille', ecran).addEventListener('click', (e) => {
      const b = e.target.closest('.carte-exercice');
      if (!b) return;
      if (b.getAttribute('aria-disabled') === 'true') return session.message('Cet exercice s’ouvrira quand tu auras réussi le précédent.');
      contexte.ouvrirExercice(b.dataset.id);
    });

    return { dessiner };
  }

  Object.assign(A, { creerEcranParcours });
})(this);

// ===== interface/ecran-exercice.js =====
// A4 · Écran d'exercice (repris de l'atelier) : consigne en bandeau, composants, indices, éditeur de blocs, code Arduino
// (niveau 3), simulateur, vérification et son résultat (A5).
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // ---------- Consigne ----------

  // Souligne la première apparition de chaque mot du lexique.
  function souligner(texteEchappe, lexique, dejaVus) {
    const formes = [];
    lexique.forEach((entree, i) => (entree.formes || []).forEach((f) => formes.push({ f, i })));
    formes.sort((a, b) => b.f.length - a.f.length);
    if (!formes.length) return texteEchappe;
    const motif = new RegExp('(?<![\\p{L}\\d])(' + formes.map((x) => x.f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\p{L}\\d])', 'gu');
    return texteEchappe.replace(motif, (m) => {
      const x = formes.find((y) => y.f === m);
      if (!x || dejaVus.has(x.i)) return m;
      dejaVus.add(x.i);
      return `<button type="button" class="mot-cle" data-mot="${x.i}">${m}</button>`;
    });
  }

  // Les broches (D3, P0, A1) en pastille, comme dans la maquette.
  const broches = (html) => html.replace(/(?<![\p{L}\d>])([DPA]\d{1,2})(?![\p{L}\d])/gu, '<span class="broche">$1</span>');

  // Mots qui construisent le programme, mis en évidence (comme les blocs « Décisions » et « Boucles »).
  const STRUCTURE = /(?<![\p{L}\d])(sinon|si|alors|tant que|répéter|jusqu’à|jusqu'à|quand)(?![\p{L}\d])/giu;
  // Dans du HTML : seulement le texte, jamais l'intérieur des balises.
  const marquerStructure = (html) =>
    html
      .split(/(<[^>]+>)/)
      .map((morceau) => (morceau.startsWith('<') ? morceau : morceau.replace(STRUCTURE, '<strong class="mot-structure">$1</strong>')))
      .join('');

  // Une phrase « si … alors … sinon … » est coupée comme les blocs : chaque « si » commence une ligne,
  // « alors » et « sinon » vont à la ligne, en retrait.
  function decouper(phrase) {
    const coupe = /(?<![\p{L}\d])(sinon|si|alors)(?![\p{L}\d])/giu;
    const morceaux = [];
    let debut = 0;
    let niveau = 0;
    for (const m of phrase.matchAll(coupe)) {
      if (m.index > debut && phrase.slice(debut, m.index).trim()) morceaux.push({ texte: phrase.slice(debut, m.index).trim(), niveau });
      if (m.index > debut || !morceaux.length) debut = m.index;
      niveau = m[1].toLowerCase() === 'si' ? 0 : 1;
    }
    morceaux.push({ texte: phrase.slice(debut).trim(), niveau });
    return morceaux.filter((x) => x.texte);
  }

  function consigneHtml(texte, lexique) {
    const vus = new Set();
    const rendre = (t) => marquerStructure(broches(souligner(echapper(t), lexique, vus)));
    let html = '';
    let etiquettes = [];
    const vider = () => {
      if (etiquettes.length) html += `<div class="consigne-etiquettes">${etiquettes.join('')}</div>`;
      etiquettes = [];
    };
    for (const l of texte.split('\n')) {
      if (/^\s*-\s/.test(l)) etiquettes.push(`<span class="consigne-etiquette">${rendre(l.replace(/^\s*-\s/, ''))}</span>`);
      else {
        vider();
        const morceaux = decouper(l);
        if (morceaux.length > 1) html += `<p class="consigne-structure">${morceaux.map((m) => `<span class="consigne-ligne niveau-${m.niveau}">${rendre(m.texte)}</span>`).join('')}</p>`;
        else html += `<p>${rendre(l)}</p>`;
      }
    }
    vider();
    return html;
  }

  const NOMS_COMPOSANTS = { led: 'LED', bouton: 'Bouton', servo: 'Servomoteur', buzzer: 'Buzzer' };
  const ICONES_COMPOSANTS = { led: 'lumiere', bouton: 'bouton', servo: 'moteur', buzzer: 'son' };

  // contexte : { session, paquet, toutDebloquer, majBandeau(exercice), solution (bouton « Solution » du mode enseignant),
  //   actionsReussite(exercice) → [{ texte, principal, action }] (boutons ajoutés au message de réussite, ex. envoi dans
  //   la carte du projet) }
  function creerEcranExercice(contexte) {
    const { session, paquet } = contexte;
    const D = session.donnees;
    const exercices = paquet.exercices;
    const lexique = paquet.lexique || [];
    const lecture = !!session.lecture;
    const opts = { toutDebloquer: !!contexte.toutDebloquer };
    A.fiches = paquet.fiches || {};
    A.lexique = lexique;

    const etat = { exercice: null, mode: 'arrete', vitesse: 1, sim: null, servos: {}, rejeu: null, niveau: 1, boutonsAvant: null };
    const ecran = $('.ecran-exercice');

    const editeur = A.creerEditeur($('.editeur', ecran), {
      modifie() {
        if (etat.mode !== 'arrete') arreter();
        fermerResultat();
        programmeModifie();
        majCode();
      },
      zoom(pourcent) {
        $('.zoom-valeur', ecran).textContent = pourcent + ' %';
      },
    });
    let vue = null;

    // ----- Aides : indices, fiche « À savoir », lexique -----

    const aides = A.creerAides({
      indicesOuverts: () => A.progressionExercice(D, etat.exercice.id).indicesOuverts,
      ouvrirIndice(niveau) {
        A.noterIndice(D, etat.exercice.id, niveau);
        majIndices();
        session.aEnregistrer(true, true);
      },
    });
    function majIndices() {
      const n = A.progressionExercice(D, etat.exercice.id).indicesOuverts;
      $('.compteur-indices', ecran).textContent = `${n} sur 3 utilisés`;
      $('.texte-indice', ecran).textContent = n >= 3 ? 'Revoir les indices' : n ? `Revoir · ouvrir l’indice ${n + 1}` : 'Ouvrir l’indice 1';
    }
    // Mots du lexique déjà rencontrés : ceux des consignes des exercices ouverts par l'équipe.
    function motsVus() {
      const vus = new Set();
      for (const ex of exercices) {
        if (!D.programmation.exercices[ex.id]) continue;
        lexique.forEach((entree, i) => {
          if ((entree.formes || []).some((forme) => A.contientMot(ex.consigne, forme))) vus.add(i);
        });
      }
      return vus;
    }
    const lexiqueComplet = A.creerLexique(motsVus);
    // Pastille « ? » des blocs « Au démarrage » et « Répéter indéfiniment ».
    A.surAideChapeau = () => {
      fermerResultat();
      aides.explication('demarrage-boucle');
    };
    $('[data-aide="fiche"]', ecran).addEventListener('click', () => aides.fiche());
    $('[data-aide="indice"]', ecran).addEventListener('click', () => aides.indice());
    $('.btn-lexique', ecran).addEventListener('click', () => lexiqueComplet.ouvrir());

    // ----- Ouverture d'un exercice -----

    // programme : sauvegarde Blockly ou programme à montrer à la place de celui de l'équipe (lecture par le professeur).
    function ouvrir(ex, programme) {
      if (!A.estDebloque(D, paquet, ex.id, opts)) return false;
      if (etat.exercice) A.noterProgramme(D, etat.exercice.id, editeur.sauvegarder());
      A.aideLed = !!ex.aideLed; // menu de la LED : « HAUT (1) : allumée » pendant les premiers exercices
      arreter();
      fermerResultat();
      fermerBulle();
      etat.exercice = ex;
      $('.consigne-numero', ecran).textContent = (ex.defi ? 'Défi · ' : '') + 'Exercice ' + ex.numero;
      $('.titre-exercice', ecran).textContent = ex.titre;
      document.title = `Exercice ${ex.numero} · ${ex.titre} — ${A.projet.titre}`;
      $('.consigne-texte', ecran).innerHTML = consigneHtml(ex.consigne, lexique);
      $('.consigne', ecran).classList.toggle('longue', ex.consigne.length > 300);
      // Beaucoup de composants (exercice 13) : le simulateur prend plus de place.
      ecran.classList.toggle('beaucoup', (ex.composants || []).length > 4);
      $('.liste-composants', ecran).innerHTML = (ex.composants || [])
        .map(
          (c) =>
            `<li><span class="composant-pastille composant-${c.type}">${A.icone(ICONES_COMPOSANTS[c.type] || 'info', { epaisseur: 2.4 })}</span>` +
            `<span>${echapper(NOMS_COMPOSANTS[c.type] || c.type)}${c.nom ? ' ' + echapper(c.nom) : ''} <span class="broche">${echapper(c.broche)}</span></span></li>`,
        )
        .join('');
      const avant = A.progressionExercice(D, ex.id);
      const statutAvant = avant.statut;
      editeur.charger(ex, programme ? (programme.blocks ? programme : A.versBlockly(programme)) : avant.programme);
      vue = A.creerVueSimulateur($('.simulateur', ecran), ex, { appuyerBouton });
      niveauDeLExercice(ex);
      afficher();
      A.noterOuverture(D, ex.id);
      aides.changerExercice(ex);
      majIndices();
      majCode();
      if (avant.aReverifier) montrerRevoir();
      if (contexte.majBandeau) contexte.majBandeau(ex);
      // Rouvrir un exercice déjà commencé n'est pas un travail à enregistrer.
      if (A.progressionExercice(D, ex.id).statut !== statutAvant) session.aEnregistrer(true);
      return true;
    }

    // ----- Consigne : bulle de définition -----

    let motOuvert = null;
    $('.consigne-texte', ecran).addEventListener('click', (e) => {
      const mot = e.target.closest('.mot-cle');
      if (!mot) return;
      if (motOuvert === mot.dataset.mot) return fermerBulle();
      motOuvert = mot.dataset.mot;
      const entree = lexique[Number(motOuvert)];
      const bulle = $('.bulle', ecran);
      $('.bulle-mot', bulle).textContent = entree.mot;
      $('.bulle-definition', bulle).textContent = entree.definition;
      bulle.hidden = false;
      // Sous le mot cliqué, sans sortir du bandeau de la consigne.
      const cadre = $('.consigne', ecran).getBoundingClientRect();
      const r = mot.getBoundingClientRect();
      bulle.style.left = Math.max(8, Math.min(r.left - cadre.left, cadre.width - bulle.offsetWidth - 8)) + 'px';
      bulle.style.top = r.bottom - cadre.top + 6 + 'px';
      $('.bulle-fermer', bulle).focus();
    });
    $('.bulle-fermer', ecran).addEventListener('click', fermerBulle);
    function fermerBulle() {
      motOuvert = null;
      $('.bulle', ecran).hidden = true;
    }
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !ecran.hidden) {
        fermerBulle();
        aides.fermer();
      }
    });

    // ----- Colonnes repliables : plus de place pour le programme (choix gardé sur ce poste) -----

    const CLE_COLONNES = 'labo-blocs-colonnes';
    const replie = { gauche: false, droite: false, consigne: false };
    try {
      Object.assign(replie, JSON.parse(localStorage.getItem(CLE_COLONNES)) || {});
    } catch {
      /* stockage indisponible : tout est déplié */
    }
    function majColonnes() {
      for (const cote of ['gauche', 'droite']) {
        ecran.classList.toggle('replie-' + cote, !!replie[cote]);
        const nom = cote === 'gauche' ? 'les composants et l’aide' : 'le simulateur';
        for (const b of ecran.querySelectorAll(`.btn-plier[data-colonne="${cote}"]`)) {
          b.setAttribute('aria-expanded', String(!replie[cote]));
          $('.texte-plier', b).textContent = (replie[cote] ? 'Afficher ' : 'Replier ') + nom;
          b.title = replie[cote] ? `Afficher ${nom}` : `Replier ${nom} pour agrandir le programme`;
          const icone = b.querySelector('.icone');
          const vers = (cote === 'gauche') === !replie[cote] ? 'chevronGauche' : 'chevronDroite';
          if (icone) icone.outerHTML = A.icone(vers, { epaisseur: 2.8 });
        }
      }
      // Texte de la consigne masqué : il reste le titre, « À savoir » et « Lexique ».
      $('.consigne', ecran).classList.toggle('reduite', !!replie.consigne);
      const bouton = $('.btn-reduire-consigne', ecran);
      bouton.setAttribute('aria-expanded', String(!replie.consigne));
      $('.texte-reduire', bouton).textContent = replie.consigne ? 'Afficher le texte' : 'Masquer le texte';
      if (replie.consigne) fermerBulle();
    }
    function basculerColonne(cote) {
      replie[cote] = !replie[cote];
      try {
        localStorage.setItem(CLE_COLONNES, JSON.stringify(replie));
      } catch {
        /* rien */
      }
      majColonnes();
    }
    for (const b of ecran.querySelectorAll('.btn-plier, .bande-repliee')) b.addEventListener('click', () => basculerColonne(b.dataset.colonne));
    $('.btn-reduire-consigne', ecran).addEventListener('click', () => basculerColonne('consigne'));
    majColonnes();

    // ----- Niveaux : 3 = code Arduino en lecture seule, relié aux blocs -----

    function choisirNiveau(n) {
      etat.niveau = n;
      for (const b of ecran.querySelectorAll('.btn-niveau')) b.setAttribute('aria-pressed', String(Number(b.dataset.niveau) === n));
      $('.code-arduino', ecran).hidden = n !== 3;
      ecran.classList.toggle('avec-code', n === 3);
      majCode();
    }
    for (const b of ecran.querySelectorAll('.btn-niveau')) b.addEventListener('click', () => choisirNiveau(Number(b.dataset.niveau)));
    // Niveau choisi par le professeur pour l'exercice (ex.niveau), éventuellement verrouillé (évaluation).
    function niveauDeLExercice(ex) {
      if (ex.niveau) choisirNiveau(Number(ex.niveau));
      for (const b of ecran.querySelectorAll('.btn-niveau')) {
        const autre = Number(b.dataset.niveau) !== Number(ex.niveau);
        b.disabled = !!ex.niveauVerrouille && autre;
        b.title = b.disabled ? 'Ton professeur a choisi le niveau de cet exercice.' : '';
      }
      $('.niveaux-libelle', ecran).textContent = ex.niveauVerrouille ? 'Niveau imposé' : 'Niveau';
    }
    let code = null;
    let blocChoisi = null;
    function majCode() {
      if (etat.niveau !== 3 || !etat.exercice) return;
      try {
        code = A.versArduino(editeur.lire().programme, { titre: `Exercice ${etat.exercice.numero} · ${etat.exercice.titre}`, boutonsVersMasse: etat.exercice.boutonsVersMasse });
      } catch {
        code = null;
      }
      dessinerCode();
    }
    function dessinerCode() {
      const zone = $('.code-lignes', ecran);
      if (!code) {
        zone.textContent = '';
        return;
      }
      const plage = blocChoisi && code.lignes[blocChoisi];
      zone.innerHTML = code.code
        .replace(/\n$/, '')
        .split('\n')
        .map((l, i) => `<span class="ligne${plage && i + 1 >= plage[0] && i + 1 <= plage[1] ? ' surlignee' : ''}">${echapper(l) || ' '}</span>`)
        .join('');
      const premiere = zone.querySelector('.surlignee');
      if (premiere) premiere.scrollIntoView({ block: 'nearest' });
    }
    editeur.ws.addChangeListener((e) => {
      if (e.type !== global.Blockly.Events.SELECTED) return;
      blocChoisi = e.newElementId || null;
      if (etat.niveau === 3) dessinerCode();
    });

    // ----- Modes : seulement ceux que le parcours propose (direct et carte : jalons 3 et 4) -----

    const modes = paquet.modes || ['simulateur'];
    for (const b of ecran.querySelectorAll('.btn-mode')) b.hidden = !modes.includes(b.dataset.mode);
    ecran.querySelector('.modes').hidden = modes.length < 2;

    // ----- Simulation -----

    function nouvelleSimulation() {
      const { programme } = editeur.lire();
      etat.sim = A.creerSimulation(programme, { composants: etat.exercice.composants, boutonsVersMasse: etat.exercice.boutonsVersMasse });
      etat.servos = {};
      etat.rejeu = null;
      $('.simu-note', ecran).textContent = '';
    }
    function lancer() {
      if (etat.mode === 'pause') etat.mode = 'marche';
      else if (etat.mode === 'arrete') {
        nouvelleSimulation();
        etat.mode = 'marche';
      }
      majCommandes();
    }
    function pause() {
      if (etat.mode === 'marche') etat.mode = 'pause';
      majCommandes();
    }
    function pasAPas() {
      if (etat.mode === 'arrete') nouvelleSimulation();
      etat.mode = 'pause';
      appliquerBoutonsAvant();
      etat.sim.pas();
      afficher();
      majCommandes();
    }
    function recommencer() {
      nouvelleSimulation();
      etat.mode = 'marche';
      majCommandes();
    }
    function arreter() {
      etat.mode = 'arrete';
      etat.sim = null;
      etat.servos = {};
      etat.rejeu = null;
      $('.simu-note', ecran).textContent = '';
      majCommandes();
      afficher();
    }
    function appliquerBoutonsAvant() {
      if (!etat.boutonsAvant || !etat.sim) return;
      for (const [b, v] of Object.entries(etat.boutonsAvant)) etat.sim.changerEntree(b, v);
      etat.boutonsAvant = null;
    }
    // Bouton poussoir du simulateur : appuyé tant qu'on le tient. Programme arrêté : l'élève est invité à le lancer.
    function appuyerBouton(broche, valeur) {
      if (etat.rejeu) return;
      if (!etat.sim) {
        etat.boutonsAvant = etat.boutonsAvant || {};
        etat.boutonsAvant[broche] = valeur;
        if (valeur) $('.simu-note', ecran).textContent = 'Clique sur « Lancer » pour que ton programme réagisse au bouton.';
      } else etat.sim.changerEntree(broche, valeur);
      afficher();
    }
    function majCommandes() {
      const marche = etat.mode === 'marche';
      const b = $('.btn-lancer', ecran);
      b.classList.toggle('actif', marche);
      b.setAttribute('aria-pressed', String(marche));
      $('.btn-pause', ecran).disabled = !marche;
      $('.btn-recommencer', ecran).disabled = etat.mode === 'arrete';
      for (const v of ecran.querySelectorAll('.btn-vitesse')) v.setAttribute('aria-pressed', String(Number(v.dataset.vitesse) === etat.vitesse));
    }
    $('.btn-lancer', ecran).addEventListener('click', lancer);
    $('.btn-pause', ecran).addEventListener('click', pause);
    $('.btn-pas', ecran).addEventListener('click', pasAPas);
    $('.btn-recommencer', ecran).addEventListener('click', recommencer);
    for (const v of ecran.querySelectorAll('.btn-vitesse')) {
      v.addEventListener('click', () => {
        etat.vitesse = Number(v.dataset.vitesse);
        majCommandes();
      });
    }

    const chrono = (ms) => {
      const s = Math.floor(ms / 1000);
      return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    };

    function afficher(dtVirtuel) {
      if (!vue) return;
      const sim = etat.sim;
      const etats = {};
      for (const c of etat.exercice.composants || []) {
        if (c.type === 'bouton') etats[c.broche] = sim ? sim.entrees[c.broche] || 0 : (etat.boutonsAvant && etat.boutonsAvant[c.broche]) || 0;
        else if (c.type === 'led') etats[c.broche] = sim ? sim.sorties[c.broche] || 0 : 0;
        else if (c.type === 'buzzer') {
          const note = sim && sim.journal.filter((e) => e.broche === c.broche && e.type === 'son').pop();
          etats[c.broche] = note && note.valeur && sim.t < note.t + note.duree ? note.valeur : 0;
        } else {
          // Le bras du servo tourne à vitesse constante (180° en 0,3 s) vers sa consigne.
          const cible = sim ? sim.sorties[c.broche] || 0 : 0;
          const pos = etat.servos[c.broche] === undefined ? 0 : etat.servos[c.broche];
          const pasMax = (dtVirtuel || 0) * A.VITESSE_SERVO;
          etats[c.broche] = etat.servos[c.broche] = Math.abs(cible - pos) <= pasMax ? cible : pos + Math.sign(cible - pos) * pasMax;
          if (!sim) etats[c.broche] = etat.servos[c.broche] = 0;
        }
      }
      vue.afficher(etats, !!sim);
      editeur.surligner(sim ? sim.blocsEnCours : null);
      $('.chrono-valeur', ecran).textContent = chrono(sim ? sim.t : 0);
    }

    let dernier = performance.now();
    function image(maintenant) {
      const dt = Math.min(100, maintenant - dernier);
      dernier = maintenant;
      let dtVirtuel = 0;
      if (etat.mode === 'marche' && etat.sim && !ecran.hidden) {
        appliquerBoutonsAvant();
        dtVirtuel = dt * etat.vitesse;
        let cible = etat.sim.t + dtVirtuel;
        if (etat.rejeu && cible >= etat.rejeu.fin) {
          cible = etat.rejeu.fin;
          etat.mode = 'pause';
          $('.simu-note', ecran).textContent = 'Fin du test : regarde l’état des composants.';
          majCommandes();
        }
        etat.sim.avancerJusqua(cible);
        // Le journal ne sert pas à l'affichage : on évite qu'il grossisse sans fin.
        if (etat.sim.journal.length > 20000) etat.sim.journal.splice(0, 15000);
      }
      if (etat.mode !== 'pause' || dtVirtuel) afficher(dtVirtuel);
      requestAnimationFrame(image);
    }
    requestAnimationFrame(image);

    // ----- Vérification et résultat (A5) -----

    const resultat = $('.resultat', ecran);
    const suivantDe = (ex) => exercices.slice(exercices.indexOf(ex) + 1).find((x) => A.estDebloque(D, paquet, x.id, opts));

    function verifier() {
      fermerBulle();
      aides.fermer();
      const { programme, horsProgramme, incomplets } = editeur.lire();
      const ex = etat.exercice;
      const r = A.valider(ex, programme);
      const notes = [];
      if (horsProgramme.length) notes.push('Un bloc est resté seul, hors du programme : il ne s’exécute pas. Accroche-le dans « Au démarrage » ou « Répéter indéfiniment ».');
      if (incomplets.length) notes.push('Un bloc a une case vide : complète-la.');
      A.noterProgramme(D, ex.id, editeur.sauvegarder());
      A.noterVerification(D, ex, { reussi: r.reussi, message: r.message, programme });
      session.aEnregistrer(true, true);
      if (contexte.majBandeau) contexte.majBandeau(ex);
      resultat.className = 'resultat ' + (r.reussi ? 'reussi' : 'ecart');
      if (r.reussi) {
        const suivant = suivantDe(ex);
        resultat.innerHTML =
          `<div class="resultat-message">${A.icone('coche', { epaisseur: 2.8 })}<div><strong>Ton programme fait ce qu’on attend.</strong>` +
          (suivant ? `<span>L’exercice ${echapper(suivant.numero)} est ouvert.</span>` : '<span>Tu as fini le parcours. Bravo !</span>') +
          (session.handle || lecture ? '' : '<span class="resultat-note">Pense à enregistrer ton travail dans le dossier de ton équipe.</span>') +
          '</div></div><div class="resultat-actions">' +
          (suivant ? `<button type="button" class="btn-principal btn-suivant">Exercice suivant${A.icone('suivant', { epaisseur: 2.8 })}</button>` : '') +
          `<button type="button" class="btn-secondaire btn-rester">${suivant ? 'Rester sur cet exercice' : 'Fermer'}</button></div>`;
        if (suivant) $('.btn-suivant', resultat).addEventListener('click', () => ouvrir(suivant));
        // Actions propres au projet (ex. « Envoyer dans la carte Arduino » après l'exercice 13).
        const actions = (contexte.actionsReussite && contexte.actionsReussite(ex)) || [];
        for (const a of actions.slice().reverse()) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = a.principal ? 'btn-principal' : 'btn-secondaire';
          b.textContent = a.texte;
          b.addEventListener('click', a.action);
          $('.resultat-actions', resultat).prepend(b);
        }
        $('.btn-rester', resultat).addEventListener('click', fermerResultat);
      } else {
        resultat.innerHTML =
          `<div class="resultat-message">${A.icone('info', { epaisseur: 2.4 })}<div><span>${echapper(r.message)}</span>` +
          notes.map((n) => `<span class="resultat-note">${echapper(n)}</span>`).join('') +
          '</div></div><div class="resultat-actions">' +
          `<button type="button" class="btn-secondaire btn-voir-test">${A.icone('oeil')}Voir le test</button></div>`;
        $('.btn-voir-test', resultat).addEventListener('click', () => rejouer(r));
      }
      resultat.hidden = false;
      resultat.scrollIntoView({ block: 'nearest' });
    }
    function montrerRevoir() {
      resultat.className = 'resultat ecart';
      resultat.innerHTML = `<div class="resultat-message">${A.icone('alerte', { epaisseur: 2.4 })}<div><span>Cet exercice a été modifié par ton professeur. Tes blocs sont gardés : relance la vérification.</span></div></div>`;
      resultat.hidden = false;
    }

    // Rejoue le test raté dans le simulateur : les boutons s'appuient tout seuls.
    function rejouer(r) {
      fermerResultat();
      nouvelleSimulation();
      etat.boutonsAvant = null;
      for (const e of r.entrees) etat.sim.planifierEntree(e.t, e.broche, e.valeur);
      etat.rejeu = { fin: r.temps + 600 };
      etat.mode = 'marche';
      $('.simu-note', ecran).textContent = 'Le test se rejoue : les boutons s’appuient tout seuls.';
      majCommandes();
    }
    function fermerResultat() {
      resultat.hidden = true;
    }
    $('.btn-verifier', ecran).addEventListener('click', verifier);

    // Mode enseignant : remplacer le programme par la solution de référence (démonstration en classe).
    const btnSolution = $('.btn-solution', ecran);
    btnSolution.hidden = !contexte.solution;
    btnSolution.addEventListener('click', () => {
      if (!etat.exercice || !confirm('Remplacer le programme affiché par la solution de référence ?')) return;
      arreter();
      editeur.charger(etat.exercice, A.versBlockly(etat.exercice.solutionReference));
      majCode();
    });

    // ----- Outils de l'espace de travail -----

    $('.btn-annuler', ecran).addEventListener('click', editeur.annuler);
    $('.btn-retablir', ecran).addEventListener('click', editeur.retablir);
    $('.btn-zoom-moins', ecran).addEventListener('click', () => editeur.zoomer(-1));
    $('.btn-zoom-plus', ecran).addEventListener('click', () => editeur.zoomer(1));
    $('.btn-recentrer', ecran).addEventListener('click', editeur.recentrer);

    // ----- Enregistrement -----

    let minuteurSecours = null;
    function programmeModifie() {
      clearTimeout(minuteurSecours);
      minuteurSecours = setTimeout(() => session.aEnregistrer(false), 800);
    }
    // Avant chaque écriture, le programme affiché est rangé dans les données de l'équipe.
    session.surAvantEcriture(() => {
      if (etat.exercice && !ecran.hidden) A.noterProgramme(D, etat.exercice.id, editeur.sauvegarder());
    });
    // Temps passé : seulement l'activité réelle (onglet visible et actif).
    setInterval(() => {
      if (etat.exercice && !ecran.hidden && document.visibilityState === 'visible' && document.hasFocus()) A.ajouterTemps(D, etat.exercice.id, 1);
    }, 1000);

    function quitter() {
      if (etat.exercice) A.noterProgramme(D, etat.exercice.id, editeur.sauvegarder());
      arreter();
      aides.fermer();
    }

    choisirNiveau(1);
    majCommandes();
    return { ouvrir, quitter, editeur, etat, arreter };
  }

  Object.assign(A, { creerEcranExercice });
})(this);

// ===== interface/app.js =====
// Démarrage de Labo Blocs côté élève : projet (site/projet.js), parcours (parcours/<id>/parcours.js), accueil,
// puis parcours et exercices. ?enseignant=1 : tout est ouvert et rien n'est enregistré (démonstration en classe).
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  global.definirProjet = (p) => (A.projet = p);

  // Taille de l'interface : ×1 jusqu'à 1536×864, puis jusqu'à ×1,25 en 1920×1080 (vidéoprojecteur : ×1,4).
  function ajusterEchelle() {
    const projecteur = document.body.classList.contains('projecteur');
    const s = Math.min(projecteur ? 1.4 : 1.25, Math.max(projecteur ? 1.2 : 1, Math.min(innerWidth / 1536, innerHeight / 864)));
    document.documentElement.style.setProperty('--s', String(s));
    document.documentElement.style.fontSize = 16 * s + 'px';
  }

  // Icônes déclarées dans le HTML par data-icone.
  function poserIcones(racine) {
    for (const el of racine.querySelectorAll('[data-icone]')) {
      el.outerHTML = el.dataset.icone === 'lecture' ? A.LECTURE : A.icone(el.dataset.icone, { epaisseur: el.dataset.epaisseur });
    }
  }

  // Plein écran du navigateur : plus de place pour le programme (Échap ou le même bouton pour en sortir).
  function preparerPleinEcran(racine) {
    const bouton = $('.btn-plein-ecran', racine);
    if (!bouton || !document.fullscreenEnabled) return;
    bouton.hidden = false;
    const maj = () => {
      const actif = !!document.fullscreenElement;
      bouton.querySelector('.icone').outerHTML = A.icone(actif ? 'quitterPleinEcran' : 'pleinEcran', { epaisseur: 2.4 });
      $('.texte-plein-ecran', bouton).textContent = actif ? 'Quitter le plein écran' : 'Plein écran';
      bouton.title = actif ? 'Revenir à la fenêtre normale (touche Échap)' : 'Afficher la page sur tout l’écran';
    };
    bouton.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else
        document.documentElement.requestFullscreen().catch(() => {
          const t = $('.message-bref');
          if (!t) return;
          t.textContent = 'Le plein écran n’est pas possible sur ce poste : appuie sur la touche F11.';
          t.hidden = false;
          setTimeout(() => (t.hidden = true), 5000);
        });
    });
    document.addEventListener('fullscreenchange', maj);
    maj();
  }

  // Avancement dans le bandeau : « Exercice 4 sur 14 » et un segment par exercice (réussi, en cours, à faire).
  function majAvancement(bandeau, D, paquet, ex, options) {
    const liste = paquet.exercices;
    const rang = liste.indexOf(ex);
    $('.avancement-texte', bandeau).textContent = `Exercice ${rang + 1} sur ${liste.length}`;
    const a = A.avancement(D, paquet);
    const segments = $('.segments', bandeau);
    segments.setAttribute('aria-label', `Progression : ${a.reussis} exercices réussis sur ${a.total}`);
    segments.innerHTML = liste
      .map((e, i) => `<span class="segment segment-${A.etat(D, paquet, e.id, options)}${i === rang ? ' segment-courant' : ''}"></span>`)
      .join('');
  }

  function erreurFatale(texte) {
    document.body.innerHTML = `<main class="erreur-fatale"><h1>Labo Blocs ne peut pas démarrer</h1><p>${echapper(texte)}</p><p>Demande à ton professeur.</p></main>`;
  }

  function demarrerApplication() {
    const q = new URLSearchParams(location.search);
    if (q.has('projecteur')) document.body.classList.add('projecteur');
    ajusterEchelle();
    addEventListener('resize', ajusterEchelle);
    A.poserGabarits(document);
    poserIcones(document);
    preparerPleinEcran(document);

    const projet = A.projet;
    if (!projet) return erreurFatale('Le fichier du projet (projet.js) est absent.');
    const brut = A.parcoursDefinis.find((p) => p.id === projet.parcours);
    if (!brut) return erreurFatale(`Le parcours « ${projet.parcours} » est introuvable.`);
    const problemes = A.controler(brut);
    if (problemes.length) return erreurFatale(problemes.join(' '));
    const paquet = A.preparer(brut);

    document.documentElement.style.setProperty('--accent', projet.accent || '#2547D0');
    for (const el of document.querySelectorAll('.bandeau .logo')) el.src = projet.logo || 'img/logo.svg';
    for (const el of document.querySelectorAll('.titre-projet')) el.textContent = projet.titre;
    document.title = `${projet.titre} — Labo Blocs`;

    if (q.has('enseignant')) {
      const donnees = A.creerSauvegarde({ eleves: ['Mode enseignant'], classe: '' }, { parcours: paquet, projet: projet.id });
      A.relierParcours(donnees, paquet);
      return lancer(A.creerSession({ donnees, lecture: true }), paquet, { toutDebloquer: true, exercice: q.get('exercice') });
    }
    A.demarrerAccueil((r) => {
      const changes = A.relierParcours(r.donnees, paquet);
      const session = A.creerSession(r);
      lancer(session, paquet, {});
      if (changes.length) session.message(`Ton professeur a modifié ${changes.length > 1 ? changes.length + ' exercices' : 'un exercice'}. Tes blocs sont gardés : relance la vérification.`, 6000);
    }, paquet);
  }

  function lancer(session, paquet, options) {
    const D = session.donnees;
    const bandeau = $('.bandeau');
    if (!session.lecture) for (const el of bandeau.querySelectorAll('.etat-enregistrement, .btn-enregistrer')) el.hidden = false;
    $('.equipe-texte', bandeau).textContent = 'Équipe ' + D.equipe.eleves.join(' · ') + (D.equipe.classe ? ' · ' + D.equipe.classe : '');
    if (session.lecture) $('.equipe-texte', bandeau).textContent = 'Mode enseignant · rien n’est enregistré';

    const ecrans = { parcours: $('.ecran-parcours'), exercice: $('.ecran-exercice') };
    function montrer(nom) {
      for (const [k, el] of Object.entries(ecrans)) el.hidden = k !== nom;
      $('.btn-vers-parcours', bandeau).hidden = nom !== 'exercice';
      $('.bandeau-avancement', bandeau).hidden = nom !== 'exercice';
    }

    const majBandeau = (ex) => majAvancement(bandeau, D, paquet, ex, options);

    const ecranExercice = A.creerEcranExercice({ session, paquet, toutDebloquer: options.toutDebloquer, solution: session.lecture, majBandeau });
    const ecranParcours = A.creerEcranParcours({
      session,
      paquet,
      toutDebloquer: options.toutDebloquer,
      ouvrirExercice(id) {
        const ex = paquet.exercices.find((e) => e.id === id);
        montrer('exercice');
        if (!ecranExercice.ouvrir(ex)) montrer('parcours');
      },
    });
    function versParcours() {
      ecranExercice.quitter();
      ecranParcours.dessiner();
      montrer('parcours');
      document.title = `${A.projet.titre} — Labo Blocs`;
    }
    $('.btn-vers-parcours', bandeau).addEventListener('click', versParcours);

    ecranParcours.dessiner();
    if (options.exercice && paquet.exercices.some((e) => e.id === options.exercice)) {
      montrer('exercice');
      ecranExercice.ouvrir(paquet.exercices.find((e) => e.id === options.exercice));
    } else montrer('parcours');
    A.app = { session, paquet, ecranExercice, ecranParcours, versParcours };
  }

  Object.assign(A, { demarrerApplication, ajusterEchelle, poserIcones, preparerPleinEcran, majAvancement });
})(this);

// ===== interface/integration.js =====
// Labo Blocs dans un projet (distributeur de céréales…) : le projet garde ses pages (accueil, carnet, outil du
// professeur) et sa session d'équipe ; l'écran d'exercice est celui de Labo Blocs, posé dans un élément de sa page.
//
//   const ecran = LaboBlocs.monterExercice(element, {
//     session,                 // donnees (avec la rubrique « programmation »), lecture, aEnregistrer, enregistrer…
//     paquet,                  // parcours préparé (LaboBlocs.preparer)
//     projet: { id, titre, accent, logo },
//     media: 'vendor/labo-blocs/blockly/media/',   // images de Blockly, relatives à la page
//     retour: { texte: 'Carnet', action() {} },   // bouton en haut à gauche
//     toutDebloquer, solution, // mode enseignant
//     listeExercices,          // sans « retour » : le bouton « Exercices » ouvre la liste des exercices (mode enseignant)
//     actionsReussite(exercice) → [{ texte, principal, action }],
//   });
//   ecran.ouvrir(id, programme)  ·  ecran.quitter()
(function (global) {
  'use strict';

  const A = global.LaboBlocs;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  function monterExercice(hote, options) {
    const o = options || {};
    const { session, paquet } = o;
    const D = session.donnees;
    A.projet = Object.assign({}, A.projet, o.projet);
    if (o.media) A.mediaBlockly = o.media;

    hote.classList.add('labo-blocs', 'labo-blocs-page');
    hote.innerHTML = A.GABARITS.bandeau + A.GABARITS.exercice;
    A.poserIcones(hote);
    if (A.projet.accent) hote.style.setProperty('--accent', A.projet.accent);
    const bandeau = $('.bandeau', hote);
    const logo = $('.logo', bandeau);
    if (A.projet.logo) logo.src = A.projet.logo;
    else logo.remove();
    $('.titre-projet', bandeau).textContent = A.projet.titre || '';
    $('.equipe-texte', bandeau).textContent = session.lecture
      ? 'Mode enseignant · rien n’est enregistré'
      : 'Équipe ' + D.equipe.eleves.join(' · ') + (D.equipe.classe ? ' · ' + D.equipe.classe : '');
    $('.bandeau-avancement', bandeau).hidden = false;
    $('.ecran-exercice', hote).hidden = false;

    const retour = $('.btn-vers-parcours', bandeau);
    if (o.retour) {
      retour.hidden = false;
      retour.lastChild.textContent = o.retour.texte || 'Retour';
      retour.addEventListener('click', () => {
        ecran.quitter();
        o.retour.action();
      });
    }
    if (!o.retour && o.listeExercices) {
      retour.hidden = false;
      retour.lastChild.textContent = 'Exercices';
      const liste = document.createElement('dialog');
      liste.className = 'dialogue-liste';
      liste.setAttribute('aria-label', 'Choisir un exercice');
      hote.append(liste);
      retour.addEventListener('click', () => {
        liste.innerHTML =
          '<div class="dialogue-entete"><strong>Choisir un exercice</strong><button type="button" class="btn-fermer-liste" aria-label="Fermer">×</button></div><div class="liste-exercices">' +
          paquet.exercices
            .map((e) => `<button type="button" data-id="${e.id}"><span class="liste-numero">${e.numero}</span><span>${echapper(e.titre)}</span></button>`)
            .join('') +
          '</div>';
        liste.showModal();
      });
      liste.addEventListener('click', (e) => {
        if (e.target.closest('.btn-fermer-liste')) return liste.close();
        const b = e.target.closest('button[data-id]');
        if (!b) return;
        liste.close();
        ecran.quitter();
        ecran.ouvrir(paquet.exercices.find((x) => x.id === b.dataset.id));
      });
    }
    if (!session.lecture) {
      for (const el of bandeau.querySelectorAll('.etat-enregistrement, .btn-enregistrer')) el.hidden = false;
      $('.btn-enregistrer', bandeau).addEventListener('click', () => session.enregistrer('bouton'));
      if (session.majEtat) session.majEtat();
    }
    A.preparerPleinEcran(bandeau);

    const opts = { toutDebloquer: !!o.toutDebloquer };
    const ecran = A.creerEcranExercice({
      session,
      paquet,
      toutDebloquer: opts.toutDebloquer,
      solution: !!o.solution,
      actionsReussite: o.actionsReussite,
      majBandeau: (ex) => A.majAvancement(bandeau, D, paquet, ex, opts),
    });

    return {
      // Ouvre l'exercice demandé s'il est ouvert, sinon celui où l'équipe en est.
      ouvrir(id, programme) {
        const parId = (x) => paquet.exercices.find((e) => e.id === x);
        let ex = id && parId(id);
        if (!ex || !A.estDebloque(D, paquet, ex.id, opts)) ex = parId(A.exerciceAReprendre(D, paquet, opts)) || paquet.exercices[0];
        ecran.ouvrir(ex, programme);
        return ex;
      },
      quitter: ecran.quitter,
      ecran,
    };
  }

  A.monterExercice = monterExercice;
})(this);
