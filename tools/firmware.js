// Compile le programme du distributeur (solutions de référence 13A et 13B) pour la carte Arduino Uno
// et le range dans le site, prêt à être envoyé dans la carte depuis le navigateur :  npm run firmware
//   → site/firmware/distributeur_13A.ino et _13B.ino (lisibles dans l'IDE Arduino)
//   → site/firmware/programmes.js (les .hex, dans un script pour que le site marche aussi en file://)
// À relancer si une broche ou une solution de l'exercice 13 change (exercices/13A.js, 13B.js, parametres.js).
//
// arduino-cli : variable ARDUINO_CLI, sinon celui du PATH, sinon celui du théâtre d'ombre.
// La bibliothèque Servo est installée dans tools/arduino-libs (propre au projet, ignoré par git).

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { versArduino } = require('../site/js/moteur/arduino.js');
const { chargerExercices } = require('../tests/outils.js');

const RACINE = path.join(__dirname, '..');
const SORTIE = path.join(RACINE, 'site', 'firmware');
const LIBS = path.join(__dirname, 'arduino-libs');
const candidats = [
  process.env.ARDUINO_CLI,
  'arduino-cli',
  path.join(RACINE, '..', 'TheatreDombre', 'tools', 'arduino-cli', process.platform === 'win32' ? 'arduino-cli.exe' : 'arduino-cli'),
].filter(Boolean);
const cli = candidats.find((c) => {
  try {
    execFileSync(c, ['version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
});
if (!cli) {
  console.error('arduino-cli introuvable : installer arduino-cli ou indiquer son chemin dans ARDUINO_CLI.');
  process.exit(1);
}
const env = { ...process.env, ARDUINO_DIRECTORIES_USER: LIBS };
const lancer = (args) => execFileSync(cli, args, { env, stdio: 'inherit' });

fs.mkdirSync(LIBS, { recursive: true });
lancer(['lib', 'install', 'Servo']);

const exercices = chargerExercices();
const programmes = {};
fs.mkdirSync(SORTIE, { recursive: true });
for (const id of ['13A', '13B']) {
  const ex = exercices.find((e) => e.id === id);
  const nom = `distributeur_${id}`;
  const dossier = fs.mkdtempSync(path.join(os.tmpdir(), 'atelier-fw-'));
  const croquis = path.join(dossier, nom);
  fs.mkdirSync(croquis);
  const { boutonsVersMasse } = require('../tests/outils.js').chargerParametres();
  const code = versArduino(ex.solutionReference, { titre: `Distributeur de céréales — exercice ${id} (${ex.titre})`, boutonsVersMasse });
  fs.writeFileSync(path.join(croquis, nom + '.ino'), code);
  fs.writeFileSync(path.join(SORTIE, nom + '.ino'), code);
  const sortie = path.join(dossier, 'compile');
  lancer(['compile', '--fqbn', 'arduino:avr:uno', '--output-dir', sortie, croquis]);
  programmes[id] = fs.readFileSync(path.join(sortie, nom + '.ino.hex'), 'utf8');
  console.log(`OK : ${nom} compilé.`);
}
// Programme vierge (protocole de démontage du tutoriel de câblage) : la carte ne commande plus rien.
{
  const dossier = fs.mkdtempSync(path.join(os.tmpdir(), 'atelier-fw-'));
  const croquis = path.join(dossier, 'vierge');
  fs.mkdirSync(croquis);
  fs.writeFileSync(path.join(croquis, 'vierge.ino'), '// Programme vierge : la carte ne commande plus rien (démontage).\nvoid setup() {}\n\nvoid loop() {}\n');
  const sortie = path.join(dossier, 'compile');
  lancer(['compile', '--fqbn', 'arduino:avr:uno', '--output-dir', sortie, croquis]);
  programmes.vierge = fs.readFileSync(path.join(sortie, 'vierge.ino.hex'), 'utf8');
  console.log('OK : programme vierge compilé.');
}

fs.writeFileSync(
  path.join(SORTIE, 'programmes.js'),
  '// Programmes du distributeur compilés pour Arduino Uno (format Intel HEX). Fichier généré par\n' +
    '// « npm run firmware » à partir des solutions de référence 13A et 13B : ne pas modifier à la main.\n' +
    `definirProgrammesCarte(${JSON.stringify(programmes, null, 1)});\n`,
);
console.log('OK : site/firmware/programmes.js mis à jour.');
