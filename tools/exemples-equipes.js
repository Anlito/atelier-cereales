// Fabrique des sauvegardes d'équipes d'exemple, pour essayer l'outil professeur (prof.html) :
//   npm run exemples
// Les fichiers sont créés dans exemples/DISTRIBUTEUR DE CEREALES/<Équipe>/<Équipe>.json, comme sur le réseau.
// Les tentatives sont réalistes : de vrais programmes faux passés au vrai validateur, puis la solution.

const fs = require('node:fs');
const path = require('node:path');
const P = require('../site/js/moteur/progression.js');
const { valider, jouerScenario } = require('../site/js/moteur/validation.js');
const { chargerExercices } = require('../tests/outils.js');
const faux = require('../tests/programmes-faux.js');

const exercices = chargerExercices();
const RACINE = path.join(__dirname, '..', 'exemples', 'DISTRIBUTEUR DE CEREALES');

// Horloge fictive : chaque action avance le temps, pour des dates et des durées crédibles.
let horloge = new Date('2026-10-12T09:00:00');
const avancer = (minutes) => (horloge = new Date(horloge.getTime() + minutes * 60000));
const iso = () => {
  const d = horloge;
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`;
};

function verifier(d, ex, programme) {
  const r = valider(ex, programme);
  const ecarts = r.reussi ? [] : ex.scenarios.map((sc) => jouerScenario(ex, programme, sc)).filter((x) => !x.reussi).map((x) => x.message);
  P.noterVerification(d, ex.id, { reussi: r.reussi, message: r.message, ecarts, programme });
  const e = d.exercices[ex.id];
  e.historique[e.historique.length - 1].date = iso();
  if (r.reussi && e.historique.filter((h) => h.type === 'verification' && h.reussi).length === 1) e.premiereReussite = iso();
}

// profil : jusqu'où l'équipe est allée, combien d'erreurs et d'indices par exercice.
function equipe(eleves, classe, profil) {
  const d = P.creerProgression({ eleves, classe });
  d.creeLe = iso();
  for (const ex of exercices) {
    if (!P.estDebloque(d, ex.id)) break;
    const p = profil(ex.id);
    if (!p) break;
    P.noterOuverture(d, ex.id);
    for (let n = 1; n <= p.indices; n++) {
      avancer(2);
      P.noterIndice(d, ex.id, n);
      const h = d.exercices[ex.id].historique;
      h[h.length - 1].date = iso();
    }
    const erreurs = faux[ex.id] || [];
    for (let i = 0; i < p.erreurs; i++) {
      avancer(3);
      verifier(d, ex, erreurs[i % erreurs.length].programme);
    }
    if (p.reussi) {
      avancer(2);
      verifier(d, ex, ex.solutionReference);
    }
    d.exercices[ex.id].tempsPasseSecondes = Math.round((p.minutes || 3 + p.erreurs * 3) * 60);
    d.exercices[ex.id].programme = null;
  }
  d.modifieLe = iso();
  return d;
}

const equipes = [
  // Équipe rapide : tout réussi, 13B compris.
  equipe(['Léa', 'Hugo'], '5A', (id) => ({ reussi: true, erreurs: ['4', '8', '13A'].includes(id) ? 1 : 0, indices: 0 })),
  // Équipe régulière, en cours à l'exercice 9.
  equipe(['Inès', 'Tom', 'Sacha'], '5A', (id) => (Number.parseInt(id, 10) <= 9 ? { reussi: id !== '9', erreurs: id === '5' ? 2 : id === '9' ? 1 : 0, indices: id === '5' ? 1 : 0 } : null)),
  // Équipe bloquée à l'exercice 5 : beaucoup de tentatives et les trois indices.
  equipe(['Noah', 'Jade'], '5A', (id) => (Number.parseInt(id, 10) <= 5 ? { reussi: id !== '5', erreurs: id === '5' ? 7 : 1, indices: id === '5' ? 3 : 0, minutes: id === '5' ? 26 : 4 } : null)),
  // Équipe seule, bloquée par le temps à l'exercice 3.
  equipe(['Maël'], '5A', (id) => (Number.parseInt(id, 10) <= 3 ? { reussi: id !== '3', erreurs: id === '3' ? 2 : 0, indices: id === '3' ? 2 : 1, minutes: id === '3' ? 24 : 6 } : null)),
  // Autre classe.
  equipe(['Chloé', 'Lucas'], '5B', (id) => (Number.parseInt(id, 10) <= 12 ? { reussi: true, erreurs: id === '11' ? 3 : 0, indices: id === '11' ? 2 : 0 } : null)),
  equipe(['Emma', 'Yanis'], '5B', (id) => (Number.parseInt(id, 10) <= 2 ? { reussi: id === '1', erreurs: id === '2' ? 1 : 0, indices: 0 } : null)),
];

fs.rmSync(RACINE, { recursive: true, force: true });
for (const d of equipes) {
  const nom = P.nomEquipe(d.equipe.eleves);
  fs.mkdirSync(path.join(RACINE, nom), { recursive: true });
  fs.writeFileSync(path.join(RACINE, nom, nom + '.json'), JSON.stringify(d, null, 1));
  console.log(`${nom.padEnd(18)} ${d.equipe.classe}  ${P.avancement(d)}/13`);
}
// Un fichier qui n'est pas une sauvegarde, pour voir qu'il est ignoré.
fs.writeFileSync(path.join(RACINE, 'Léa_Hugo', 'notes.json'), '{"titre":"pas une sauvegarde"}');
// Une ancienne copie d'une équipe : l'outil garde la plus récente et le signale.
const ancienne = JSON.parse(JSON.stringify(equipes[4]));
ancienne.modifieLe = '2026-10-05T10:00:00';
for (const id of ['10', '11', '12']) delete ancienne.exercices[id];
fs.writeFileSync(path.join(RACINE, 'Chloé_Lucas', 'Chloé_Lucas (ancienne copie).json'), JSON.stringify(ancienne, null, 1));
console.log('\nDossier :', RACINE);
