// Recette automatique des critères du brief, dans de vrais navigateurs (Chrome et Edge installés sur le poste) :
//   npm run recette
// Pour chaque navigateur, en ouvrant index.html directement (file://, comme depuis l'archive ZIP)
// et par un serveur web (comme GitHub Pages) :
//   - les 14 solutions de référence réussissent « Vérifier mon programme » dans l'interface ;
//   - aucun défilement de la page à 1366×768 et 1920×1080, rien ne déborde du simulateur ;
//   - une boucle sans « attendre » ne fige pas l'onglet ;
//   - aucune requête réseau hors du site, aucune erreur dans la console ;
//   - enregistrer, fermer, rouvrir et reprendre (serveur seulement : dossier simulé) ;
//   - le fichier d'équipe s'ouvre dans l'outil professeur.
// Le résultat est écrit dans RECETTE-AUTO.md.

const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const puppeteer = require('puppeteer-core');

const RACINE = path.join(__dirname, '..');
const SITE = path.join(RACINE, 'site');
const PORT = 8093;
const NAVIGATEURS = [
  { nom: 'Chrome', chemin: 'C:/Program Files/Google/Chrome/Application/chrome.exe' },
  { nom: 'Edge', chemin: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' },
].filter((n) => fs.existsSync(n.chemin));
const TAILLES = [
  [1366, 768],
  [1920, 1080],
];
const IDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13A', '13B'];
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

const resultats = []; // { critere, contexte, ok, detail }
function noter(critere, contexte, ok, detail) {
  resultats.push({ critere, contexte, ok, detail: detail || '' });
  console.log(`${ok ? 'OK  ' : 'ÉCHEC'} ${critere} · ${contexte}${detail ? ' · ' + detail : ''}`);
}

// Surveille la console et le réseau d'une page.
function surveiller(page, origine) {
  const s = { erreurs: [], externes: [] };
  page.on('console', (m) => m.type() === 'error' && s.erreurs.push(m.text()));
  page.on('pageerror', (e) => s.erreurs.push(String(e.message || e)));
  page.on('request', (r) => {
    const u = r.url();
    if (!u.startsWith(origine) && !u.startsWith('data:') && !u.startsWith('blob:')) s.externes.push(u);
  });
  return s;
}

async function ouvrirExercice(page, base, id) {
  await page.goto(`${base}index.html?enseignant=1&exercice=${id}`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.Atelier && Atelier.ecran && Atelier.ecran.etat.exercice, { timeout: 10000 });
}

async function recetteNavigateur(nav, mode, base, origine) {
  const contexte = `${nav.nom}, ${mode}`;
  let navigateur;
  try {
    navigateur = await puppeteer.launch({ executablePath: nav.chemin, headless: true, args: ['--lang=fr-FR', '--allow-file-access-from-files'] });
  } catch (e) {
    noter('Le navigateur démarre en mode automatique', contexte, false, String(e.message || e).split('\n')[0]);
    return;
  }
  try {
    const page = await navigateur.newPage();
    const s = surveiller(page, origine);

    // Accueil
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(base + 'index.html', { waitUntil: 'load' });
    const accueil = await page.evaluate(() => !document.querySelector('.ecran-accueil').hidden);
    noter('Accueil affiché', contexte, accueil);

    // Les 14 solutions, aux deux tailles d'écran
    for (const [w, h] of TAILLES) {
      await page.setViewport({ width: w, height: h });
      const echecs = [];
      const defilements = [];
      for (const id of IDS) {
        await ouvrirExercice(page, base, id);
        const r = await page.evaluate(async () => {
          const E = Atelier.ecran;
          const ex = E.etat.exercice;
          E.editeur.charger(ex, Atelier.versBlockly(ex.solutionReference));
          await new Promise((x) => setTimeout(x, 150));
          document.querySelector('.btn-lancer').click();
          await new Promise((x) => setTimeout(x, 300));
          document.querySelector('.btn-verifier').click();
          const panneau = document.querySelector('.panneau-verification');
          const sim = document.querySelector('.simulateur');
          const cmd = document.querySelector('.simu-commandes');
          const de = document.documentElement;
          return {
            reussi: !panneau.hidden && panneau.classList.contains('reussi'),
            message: panneau.innerText.slice(0, 120),
            defile: de.scrollHeight > innerHeight + 1 || de.scrollWidth > innerWidth + 1,
            deborde: sim.scrollHeight > sim.clientHeight + 1 || cmd.scrollWidth > cmd.clientWidth + 1,
          };
        });
        if (!r.reussi) echecs.push(`${id} (${r.message})`);
        if (r.defile || r.deborde) defilements.push(`${id}${r.defile ? ' page' : ''}${r.deborde ? ' simulateur' : ''}`);
      }
      noter(`Les 14 solutions réussissent la vérification (${w}×${h})`, contexte, !echecs.length, echecs.join(', '));
      noter(`Aucun défilement ni débordement (${w}×${h})`, contexte, !defilements.length, defilements.join(', '));
    }

    // Boucle sans « attendre » : l'onglet reste réactif et le temps avance.
    await page.setViewport({ width: 1366, height: 768 });
    await ouvrirExercice(page, base, '2');
    const boucle = await page.evaluate(async () => {
      const E = Atelier.ecran;
      E.editeur.charger(E.etat.exercice, Atelier.versBlockly({ demarrage: [], boucle: [
        { bloc: 'led_etat', broche: 'D3', etat: 1 }, { bloc: 'led_etat', broche: 'D3', etat: 0 } ] }));
      await new Promise((x) => setTimeout(x, 150));
      document.querySelector('.btn-lancer').click();
      const debut = performance.now();
      let tours = 0;
      while (performance.now() - debut < 2000) {
        await new Promise((x) => setTimeout(x, 20));
        tours++;
      }
      return { tours, t: E.etat.sim.t };
    });
    noter('Une boucle sans « attendre » ne fige pas l’onglet', contexte, boucle.tours > 40 && boucle.t > 500, `${boucle.tours} réponses en 2 s, horloge ${Math.round(boucle.t)} ms`);

    // Outil professeur : s'ouvre, lit une sauvegarde d'exemple.
    const exemple = path.join(RACINE, 'exemples', 'DISTRIBUTEUR DE CEREALES', 'Léa_Hugo', 'Léa_Hugo.json');
    await page.goto(base + 'prof.html', { waitUntil: 'load' });
    if (fs.existsSync(exemple)) {
      const lignes = await page.evaluate(async (texte) => {
        const dt = new DataTransfer();
        dt.items.add(new File([texte], 'Léa_Hugo.json', { type: 'application/json' }));
        document.querySelector('.zone-depot').dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
        await new Promise((x) => setTimeout(x, 400));
        return [...document.querySelectorAll('.ligne-equipe')].map((l) => l.innerText.replace(/\s+/g, ' ').slice(0, 60));
      }, fs.readFileSync(exemple, 'utf8'));
      noter('Outil professeur : une sauvegarde apparaît dans le tableau', contexte, lignes.length === 1, lignes[0] || '');
    }

    // Enregistrer, fermer, rouvrir, reprendre (dossier simulé dans le stockage du navigateur).
    if (mode === 'serveur') {
      const cycle = await cycleSauvegarde(navigateur, base);
      noter('Enregistrer, fermer, rouvrir et reprendre à l’exercice en cours', contexte, cycle.ok, cycle.detail);
      if (cycle.texte) {
        const p2 = await navigateur.newPage();
        await p2.goto(base + 'prof.html', { waitUntil: 'load' });
        const ligne = await p2.evaluate(async (texte) => {
          const dt = new DataTransfer();
          dt.items.add(new File([texte], 'Recette_Test.json', { type: 'application/json' }));
          document.querySelector('.zone-depot').dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
          await new Promise((x) => setTimeout(x, 400));
          const l = document.querySelector('.ligne-equipe');
          return l ? l.innerText.replace(/\s+/g, ' ') : '';
        }, cycle.texte);
        noter('Le fichier enregistré par l’atelier s’ouvre dans l’outil professeur', contexte, /Recette, Test/.test(ligne) && /1\/13/.test(ligne), ligne.slice(0, 80));
        await p2.close();
      }
    }

    noter('Aucune requête réseau hors du site', contexte, !s.externes.length, [...new Set(s.externes)].slice(0, 3).join(' '));
    noter('Aucune erreur dans la console', contexte, !s.erreurs.length, [...new Set(s.erreurs)].slice(0, 3).join(' | '));
  } catch (e) {
    noter('Recette interrompue', contexte, false, String(e.message || e));
  } finally {
    await navigateur.close();
  }
}

// Nouvelle équipe → dossier (simulé) → exercice 1 réussi → la page est fermée → « Reprendre ».
async function cycleSauvegarde(navigateur, base) {
  const page = await navigateur.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(base + 'index.html', { waitUntil: 'load' });
  const texte = await page.evaluate(async () => {
    localStorage.clear();
    const racine = await navigator.storage.getDirectory();
    for await (const [n] of racine.entries()) await racine.removeEntry(n, { recursive: true });
    const parent = await racine.getDirectoryHandle('DISTRIBUTEUR DE CEREALES', { create: true });
    window.showDirectoryPicker = async () => parent;
    document.querySelector('.btn-nouvelle').click();
    const c = document.querySelectorAll('.champ-prenom');
    c[0].value = 'recette';
    c[1].value = 'test';
    document.querySelector('.champ-classe').value = '5A';
    document.querySelector('.formulaire-equipe button[type=submit]').click();
    document.querySelector('.btn-choisir-dossier').click();
    await new Promise((x) => setTimeout(x, 500));
    document.querySelector('.btn-commencer').click();
    await new Promise((x) => setTimeout(x, 500));
    // Le carnet de projet s'ouvre d'abord : une idée, puis l'exercice 1 depuis l'onglet Programmation.
    if (document.querySelector('.ecran-carnet').hidden) throw new Error('le carnet ne s’ouvre pas après l’accueil');
    const idee = document.querySelector('[data-idee="0"]');
    idee.value = 'Une trémie avec une trappe';
    idee.dispatchEvent(new Event('input', { bubbles: true }));
    Atelier.ouvrirExercice('1');
    await new Promise((x) => setTimeout(x, 500));
    const E = Atelier.ecran;
    E.editeur.charger(E.etat.exercice, Atelier.versBlockly(E.etat.exercice.solutionReference));
    await new Promise((x) => setTimeout(x, 200));
    document.querySelector('.btn-verifier').click();
    await new Promise((x) => setTimeout(x, 800));
    const dossier = await parent.getDirectoryHandle('Recette_Test');
    return (await (await dossier.getFileHandle('Recette_Test.json')).getFile()).text();
  });
  // On « ferme » : nouvelle page, puis Reprendre.
  await page.goto('about:blank');
  await page.goto(base + 'index.html', { waitUntil: 'load' });
  const reprise = await page.evaluate(async () => {
    const carte = !document.querySelector('.accueil-reprendre').hidden;
    document.querySelector('.btn-reprendre').click();
    await new Promise((x) => setTimeout(x, 800));
    const carnet = !document.querySelector('.ecran-carnet').hidden;
    const idee = document.querySelector('[data-idee="0"]').value;
    document.querySelector('[data-onglet="programmation"]').click();
    document.querySelector('.btn-continuer').click();
    await new Promise((x) => setTimeout(x, 800));
    const E = Atelier.ecran;
    return { carte, carnet, idee, exercice: E && E.etat.exercice.id, fichier: !!(E && E.session.handle), equipe: document.querySelector('.equipe-noms').innerText };
  });
  await page.close();
  const d = JSON.parse(texte);
  const ok = d.exercices['1'].statut === 'reussi' && d.carnet.idees[0] && reprise.carte && reprise.carnet && reprise.idee && reprise.exercice === '2' && reprise.fichier;
  return {
    ok,
    texte,
    detail: `fichier écrit (ex. 1 ${d.exercices['1'].statut}, idée du carnet ${d.carnet.idees[0] ? 'gardée' : 'perdue'}), reprise : carnet ${reprise.carnet ? 'ouvert' : 'absent'}, ` +
      `« Continuer » ouvre l’exercice ${reprise.exercice}, équipe ${reprise.equipe}, fichier ${reprise.fichier ? 'retrouvé' : 'perdu'}`,
  };
}

(async () => {
  if (!NAVIGATEURS.length) throw new Error('Aucun navigateur Chrome ou Edge trouvé.');
  // Sauvegardes d'exemple pour l'outil professeur.
  require('node:child_process').execFileSync(process.execPath, [path.join(__dirname, 'exemples-equipes.js')], { stdio: 'ignore' });
  const serveur = spawn(process.execPath, [path.join(__dirname, 'serve.js')], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
  await attendre(800);
  const debut = Date.now();
  try {
    for (const nav of NAVIGATEURS) {
      await recetteNavigateur(nav, 'fichier', pathToFileURL(SITE).href + '/', 'file://');
      await recetteNavigateur(nav, 'serveur', `http://localhost:${PORT}/`, `http://localhost:${PORT}/`);
    }
  } finally {
    serveur.kill();
  }

  const ok = resultats.filter((r) => r.ok).length;
  const lignes = [
    '# Recette automatique',
    '',
    `Lancée le ${new Date().toLocaleString('fr-FR')} avec \`npm run recette\` (${Math.round((Date.now() - debut) / 1000)} s).`,
    `Navigateurs : ${NAVIGATEURS.map((n) => n.nom).join(', ')} ; modes : fichier (index.html ouvert directement, comme l’archive ZIP) et serveur (comme GitHub Pages).`,
    '',
    `**${ok} / ${resultats.length} vérifications réussies.**`,
    '',
    '| Résultat | Critère | Navigateur, mode | Détail |',
    '|---|---|---|---|',
    ...resultats.map((r) => `| ${r.ok ? '✓' : '✗ ÉCHEC'} | ${r.critere} | ${r.contexte} | ${r.detail.replace(/\|/g, '/').replace(/\n/g, ' ')} |`),
    '',
  ];
  fs.writeFileSync(path.join(RACINE, 'RECETTE-AUTO.md'), lignes.join('\n'));
  console.log(`\n${ok}/${resultats.length} vérifications réussies — RECETTE-AUTO.md`);
  process.exitCode = ok === resultats.length ? 0 : 1;
})();
