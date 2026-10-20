// Fabrique des sauvegardes d'équipes d'exemple, pour essayer l'outil professeur (prof.html) :
//   npm run exemples
// Les fichiers sont créés dans exemples/DISTRIBUTEUR DE CEREALES/<Équipe>/<Équipe>.json, comme sur le réseau.
// Les tentatives sont réalistes : de vrais programmes faux passés au validateur de Labo Blocs, puis la solution,
// notées comme le fait l'écran d'exercice. Une « ancienne copie » est au format de l'atelier d'avant Labo Blocs.

const fs = require('node:fs');
const path = require('node:path');
const LB = require(require('./dependances-tests.js').noyau);
const P = require('../site/js/moteur/progression.js');
const { catalogue } = require('../site/js/moteur/catalogue.js');
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

const duParcours = (ex) => catalogue.paquet().exercices.find((e) => e.id === ex.idParcours);

function verifier(d, ex, programme) {
  const r = LB.valider(duParcours(ex), programme);
  LB.noterVerification(d, duParcours(ex), { reussi: r.reussi, message: r.message, programme: LB.versV1(programme) });
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
    LB.noterOuverture(d, ex.idParcours);
    for (let n = 1; n <= p.indices; n++) {
      avancer(2);
      LB.noterIndice(d, ex.idParcours, n);
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

// Carnets de projet plus ou moins remplis (0 : rien, 3 : tout, avec quelques essais ratés).
const vm = require('node:vm');
const Cn = require('../site/js/moteur/carnet.js');
let contenu;
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'site', 'donnees', 'carnet.js'), 'utf8'), { definirCarnet: (c) => (contenu = c) });
const ex13 = exercices.find((e) => e.id === '13A');
function remplirCarnet(d, niveau) {
  const K = d.carnet;
  if (niveau >= 1) {
    K.idees = ['Une trémie avec une trappe qui s’ouvre', 'Un bouton pour choisir la quantité'];
    K.definition = 'Un objet fabriqué par l’homme pour répondre à un besoin.';
  }
  if (niveau >= 2) {
    for (const e of contenu.classement) K.classement[e.nom] = e.place;
    Cn.noterVerificationCarnet(d, 'classement', { reussi: false, bien: 13, total: 15 });
    Cn.noterVerificationCarnet(d, 'classement', { reussi: true, bien: 15, total: 15 });
    for (const a of contenu.algorigrammes) {
      K.algos[a.id] = Cn.attenduLineaire(a);
      Cn.noterVerificationCarnet(d, a.id, { reussi: true, bien: 5, total: 5 });
    }
  }
  if (niveau >= 3) {
    K.algos.final = { ...contenu.algoFinal.cases };
    Cn.noterVerificationCarnet(d, 'final', { reussi: false, bien: 15, total: 18 });
    Cn.noterVerificationCarnet(d, 'final', { reussi: true, bien: 18, total: 18 });
    for (const l of Cn.lignesCablage(ex13.composants)) if (!l.couleurImposee) K.couleurs[l.broche] = 'rouge';
  }
}
[3, 2, 1, 1, 3, 0].forEach((n, i) => {
  const date = equipes[i].modifieLe;
  remplirCarnet(equipes[i], n);
  equipes[i].modifieLe = date;
});

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
// Elle est au format 1 (atelier d'avant Labo Blocs : exercices rangés par numéro), comme les fichiers des équipes
// qui n'ont pas retravaillé depuis la mise à jour.
const ancienne = JSON.parse(JSON.stringify(equipes[4]));
ancienne.modifieLe = '2026-10-05T10:00:00';
ancienne.formatVersion = 1;
ancienne.exercices = {};
for (const [id, e] of Object.entries(equipes[4].exercices)) if (!['10', '11', '12'].includes(id)) ancienne.exercices[id] = JSON.parse(JSON.stringify(e));
for (const e of Object.values(ancienne.exercices)) for (const h of e.historique) if (h.programme) h.programme = LB.versSimplifie(h.programme);
ancienne.exerciceCourant = '10';
ancienne.exercice13 = { versionReussie: null };
delete ancienne.programmation;
fs.writeFileSync(path.join(RACINE, 'Chloé_Lucas', 'Chloé_Lucas (ancienne copie).json'), JSON.stringify(ancienne, null, 1));
console.log('\nDossier :', RACINE);
