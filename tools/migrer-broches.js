// Migration unique (octobre 2026) : les broches des exercices suivent désormais le tableau de câblage
// du document élève. Boutons PetiteDose D3, GrandeDose D4, Trappe D5 ; LED PetiteDose D9, GrandeDose D10,
// Trappe D11 ; servo D6. À l'exercice 12, le bouton passe sur D5 et le moteur sur D6.
// Le script remplace chaque broche « Dn » d'un coup (pas de remplacements en chaîne) dans les fichiers
// d'exercices, les fiches et les programmes faux des tests. Gardé pour mémoire ; ne pas relancer.

const fs = require('node:fs');
const path = require('node:path');
const RACINE = path.join(__dirname, '..');

const BASE = { D3: 'D9', D4: 'D10', D5: 'D11', D8: 'D3', D9: 'D4', D10: 'D5' };
// Exercice 12 : bouton D10 → D5 ; servo D5 → D6 (et D6 → D5 pour le programme faux « mauvaise broche »).
const EX12 = { D10: 'D5', D5: 'D6', D6: 'D5' };

const remplacer = (texte, table) => texte.replace(/\bD(\d{1,2})\b/g, (m) => table[m] || m);

function migrerFichier(relatif, table) {
  const f = path.join(RACINE, relatif);
  const avant = fs.readFileSync(f, 'utf8');
  if (avant.includes('broches-migrees')) return console.log('déjà fait :', relatif);
  fs.writeFileSync(f, remplacer(avant, table));
  console.log('migré :', relatif);
}

if (fs.readFileSync(path.join(RACINE, 'site/exercices/01.js'), 'utf8').includes('"broche": "D9"')) {
  console.log('Migration déjà faite.');
  process.exit(0);
}

for (const n of ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '13A', '13B']) migrerFichier(`site/exercices/${n}.js`, BASE);
migrerFichier('site/exercices/12.js', EX12);
migrerFichier('site/donnees/fiches.js', BASE);

// Programmes faux : chaque bloc d'exercice avec sa table (le haut du fichier, partagé par 7, 8 et 13, avec BASE).
const f = path.join(RACINE, 'tests/programmes-faux.js');
const lignes = fs.readFileSync(f, 'utf8').split('\n');
let table = BASE;
const sortie = lignes.map((l) => {
  const m = l.match(/^ {2}('?\w+'?): \[$/);
  if (m) table = m[1] === '12' ? EX12 : BASE;
  return remplacer(l, table);
});
fs.writeFileSync(f, sortie.join('\n'));
console.log('migré : tests/programmes-faux.js');
