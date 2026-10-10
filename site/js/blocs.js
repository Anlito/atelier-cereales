// Blocs Blockly en français (libellés de Vittascience), thème de l'atelier et palette progressive.
(function (global) {
  'use strict';

  const A = global.Atelier;

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
  const BROCHES_LED = ['D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11'];
  const BROCHES_BOUTON = ['D8', 'D9', 'D10'];
  const BROCHES_SERVO = ['D5', 'D6'];
  const menu = (liste) => liste.map((b) => [b, b]);
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
          ],
        },
        { type: 'input_value', name: 'B' },
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'bleu',
      tooltip: '« = » : les deux valeurs sont égales. « ≠ » : elles sont différentes.',
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
    { nom: 'Lumière', cle: 'lumiere', couleur: COULEURS.lumiere, blocs: ['led_etat'] },
    { nom: 'Temps', cle: 'temps', couleur: COULEURS.bleu, blocs: ['attendre'] },
    { nom: 'Bouton', cle: 'bouton', couleur: COULEURS.bleu, blocs: ['bouton_etat', 'valeur_haut_bas'] },
    { nom: 'Moteur', cle: 'moteur', couleur: COULEURS.servo, blocs: ['servo_angle'] },
    { nom: 'Décisions', cle: 'decisions', couleur: COULEURS.decision, blocs: ['si_alors', 'si_sinon', 'comparaison'] },
    { nom: 'Variables', cle: 'variables', couleur: COULEURS.variable, blocs: ['affecter', 'variable', 'nombre'] },
  ];

  const FORMES_PALETTE = {
    attendre: { inputs: { DUREE: { shadow: { type: 'nombre', fields: { NUM: 1 } } } } },
    servo_angle: { inputs: { ANGLE: { shadow: { type: 'nombre', fields: { NUM: 90 } } } } },
    affecter: { inputs: { VALEUR: { shadow: { type: 'nombre', fields: { NUM: 0 } } } } },
    led_etat: { fields: { ETAT: '1', BROCHE: 'D3' } },
  };

  // Palette d'un exercice : seulement ses blocs autorisés ; une catégorie vide n'apparaît pas.
  function palette(blocsAutorises, composants) {
    const autorises = new Set(blocsAutorises || []);
    // Les menus de broches proposent d'abord la broche des composants de l'exercice.
    const premiere = (type) => {
      const c = (composants || []).find((x) => x.type === type);
      return c && c.broche;
    };
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
          if (type === 'led_etat' && premiere('led')) forme.fields.BROCHE = premiere('led');
          if (type === 'bouton_etat' && premiere('bouton')) forme.fields = { BROCHE: premiere('bouton') };
          if (type === 'servo_angle' && premiere('servo')) forme.fields = { BROCHE: premiere('servo') };
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

  Object.assign(A, { definirBlocs, palette, CATEGORIES, COULEURS_BLOCS: COULEURS });
})(this);
