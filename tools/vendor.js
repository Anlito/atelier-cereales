// Copie Blockly dans site/vendor/ pour que le site n'utilise AUCUN CDN.
// À lancer après « npm install » (ou après une mise à jour de Blockly) : npm run vendor
// Le dossier site/vendor/ est ensuite publié tel quel avec le site.

const { cpSync, mkdirSync } = require('node:fs');
const { join, dirname } = require('node:path');

const RACINE = join(__dirname, '..');
const NM = join(RACINE, 'node_modules');
const OUT = join(RACINE, 'site', 'vendor');

const copies = [
  ['blockly/blockly_compressed.js', 'blockly/blockly_compressed.js'],
  ['blockly/msg/fr.js', 'blockly/fr.js'],
  ['blockly/media', 'blockly/media'],
  ['blockly/LICENSE', 'LICENCES/blockly.txt'],
];

for (const [de, vers] of copies) {
  mkdirSync(dirname(join(OUT, vers)), { recursive: true });
  cpSync(join(NM, de), join(OUT, vers), { recursive: true });
  console.log('copié  ', vers);
}
